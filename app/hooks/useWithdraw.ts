import { useAtomValue } from "jotai";
import { encodeFunctionData, parseUnits, formatEther } from "viem";
import { Alchemy, Network } from "alchemy-sdk";
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
} from "@/app/config/environment";
import { USDT_DECIMALS, USDT_MOCK_VALUE } from "@/app/config/constants";
import {
  sendGasFeeAsUsdt,
  sendSmartAccountTx,
} from "@/app/utils/transaction";

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

  const estimateGasFee = async (
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
      data: sendGasFeeAsUsdt(USDT_MOCK_VALUE),
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

      const ethPrice = 2500;
      const gasFeeUsd = totalCostEth * ethPrice;
      return (gasFeeUsd * 140) / 100;
    } catch (error) {
      console.error("Gas estimation error:", error);
      return USDT_MOCK_VALUE;
    }
  };

  const withdraw = async (
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

      const gasFeeUsdt = await estimateGasFee(recipientAddress, amountInWei);
      const gasFeeInWei = parseUnits(
        (Math.floor(gasFeeUsdt * 1e6) / 1e6).toFixed(6),
        USDT_DECIMALS
      );

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
          data: sendGasFeeAsUsdt(gasFeeUsdt),
        },
      ];

      const { txHash, receipt } = await sendSmartAccountTx({
        calls,
        smartAccount,
        smartAccountClient,
        publicClient,
        permissions,
        sessionKey,
      });

      return { receipt, txHash, error: null };
    } catch (error) {
      console.error("Withdraw error:", error);
      return { receipt: null, txHash: null, error };
    }
  };

  return { withdraw };
};
