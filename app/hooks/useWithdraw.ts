import { useCallback } from "react";
import { useAtomValue } from "jotai";
import { encodeFunctionData, parseUnits, formatEther } from "viem";
import { Alchemy, Network } from "alchemy-sdk";
import { signPreparedCalls } from "@account-kit/wallet-client";
import { erc20Abi } from "@/app/utils/erc20Abi";
import {
  userSmartAccount,
  userSmartAccountClient,
  userPublicClient,
} from "@/app/store/atoms";
import { useSessionPermissions } from "@/app/hooks/useSessionPermissions";
import {
  ALCHEMY_API_KEY,
  usdt_token,
  PAYMASTER_ADDRESS,
} from "@/app/config/environment";

const USDT_DECIMALS = 6;
const USDT_MOCK_VALUE = 0.2;

// Encode a USDT transfer to paymaster for gas fee
const encodeGasFeeTransfer = (usdtAmount: number): `0x${string}` => {
  const amountInWei = parseUnits(usdtAmount.toFixed(6), USDT_DECIMALS);
  return encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [PAYMASTER_ADDRESS as `0x${string}`, amountInWei],
  });
};

// Poll for tx hash from smart account client
const getTxHashAndReceipt = async ({
  preparedCallId,
  smartAccountClient,
  publicClient,
  timeout = 60_000,
  interval = 2000,
}: {
  preparedCallId: string;
  smartAccountClient: any;
  publicClient: any;
  timeout?: number;
  interval?: number;
}) => {
  const startTime = Date.now();
  let txHash: string | null = null;

  while (Date.now() - startTime < timeout) {
    const status = await smartAccountClient.getCallsStatus(preparedCallId);
    const possibleHashes = [
      status.transactionHash,
      status.txHash,
      status.hash,
      status.receipt?.transactionHash,
      status.receipts?.[0]?.transactionHash,
      status.userOperationReceipt?.transactionHash,
      status.result?.transactionHash,
      status.data?.transactionHash,
    ];
    txHash = possibleHashes.find(Boolean) ?? null;
    if (txHash) break;
    await new Promise((r) => setTimeout(r, interval));
  }

  if (!txHash) throw new Error("Transaction hash not found within timeout");

  const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
  return { txHash, receipt };
};

export interface WithdrawResult {
  receipt: any;
  txHash: string | null;
  error: any;
}

export const useWithdraw = () => {
  const smartAccount = useAtomValue(userSmartAccount);
  const smartAccountClient = useAtomValue(userSmartAccountClient);
  const publicClient = useAtomValue(userPublicClient);
  const { grantPermissions } = useSessionPermissions();

  const alchemy = new Alchemy({
    apiKey: ALCHEMY_API_KEY,
    network: Network.ARB_MAINNET,
  });

  const estimateGasFee = useCallback(
    async (
      recipientAddress: string,
      amountInWei: bigint
    ): Promise<number> => {
      if (!smartAccount) return 0;

      const transferCall = {
        to: usdt_token,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [
            recipientAddress as `0x${string}`,
            amountInWei,
          ],
        }),
      };
      const gasCall = {
        to: usdt_token,
        data: encodeGasFeeTransfer(USDT_MOCK_VALUE),
      };

      try {
        const gasPrice = await alchemy.core.getGasPrice();
        const estimates = await Promise.all(
          [transferCall, gasCall].map((call) =>
            alchemy.core.estimateGas({
              from: smartAccount,
              to: call.to,
              data: call.data,
            })
          )
        );

        const totalGas = estimates.reduce(
          (acc, g) => acc + g.toBigInt(),
          0n
        );
        const totalCostEth = Number(
          formatEther(totalGas * gasPrice.toBigInt())
        );

        // Convert ETH to USD (rough estimate, can be improved)
        // For now use a conservative multiplier
        const ethPrice = 2500; // fallback
        const gasFeeUsd = totalCostEth * ethPrice;
        return (gasFeeUsd * 140) / 100; // 40% buffer
      } catch (error) {
        console.error("Gas estimation error:", error);
        return USDT_MOCK_VALUE; // fallback
      }
    },
    [smartAccount, alchemy]
  );

  const withdraw = useCallback(
    async (
      recipientAddress: string,
      amount: number,
      balance: number
    ): Promise<WithdrawResult> => {
      if (!smartAccount || !smartAccountClient || !publicClient) {
        return {
          receipt: null,
          txHash: null,
          error: new Error("Wallet not connected"),
        };
      }

      try {
        const amountInWei = parseUnits(amount.toFixed(6), USDT_DECIMALS);
        const balanceInWei = parseUnits(balance.toFixed(6), USDT_DECIMALS);

        // Estimate gas fee
        const gasFeeUsdt = await estimateGasFee(recipientAddress, amountInWei);
        const gasFeeInWei = parseUnits(
          (Math.floor(gasFeeUsdt * 1e6) / 1e6).toFixed(6),
          USDT_DECIMALS
        );

        // Adjust amount if balance is tight
        let finalAmountInWei = amountInWei;
        const totalCost = amountInWei + gasFeeInWei;
        if (balanceInWei < totalCost) {
          finalAmountInWei = amountInWei - gasFeeInWei;
          if (finalAmountInWei <= 0n) {
            return {
              receipt: null,
              txHash: null,
              error: new Error("Insufficient balance to cover gas fees"),
            };
          }
        }

        // Grant session permissions
        const permResult = await grantPermissions();
        if (!permResult) {
          return {
            receipt: null,
            txHash: null,
            error: new Error("Failed to grant session permissions"),
          };
        }
        const { userPermissions: permissions, userSessionKey: sessionKey } =
          permResult;

        // Build calls: 1) token transfer, 2) gas fee to paymaster
        const calls = [
          {
            to: usdt_token as `0x${string}`,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "transfer",
              args: [
                recipientAddress as `0x${string}`,
                finalAmountInWei,
              ],
            }),
          },
          {
            to: usdt_token as `0x${string}`,
            data: encodeGasFeeTransfer(gasFeeUsdt),
          },
        ];

        // Prepare → Sign → Send
        const preparedCalls = await (smartAccountClient as any).prepareCalls({
          calls,
          from: smartAccount,
          capabilities: { permissions },
        });

        const signedCalls = await signPreparedCalls(sessionKey, preparedCalls);

        const sendResult = await (smartAccountClient as any).sendPreparedCalls({
          ...signedCalls,
          capabilities: { permissions },
        });

        const { preparedCallIds } = sendResult;

        const { txHash, receipt } = await getTxHashAndReceipt({
          preparedCallId: preparedCallIds[0],
          smartAccountClient,
          publicClient,
        });

        return { receipt, txHash, error: null };
      } catch (error) {
        console.error("Withdraw error:", error);
        return { receipt: null, txHash: null, error };
      }
    },
    [smartAccount, smartAccountClient, publicClient, grantPermissions, estimateGasFee]
  );

  return { withdraw };
};
