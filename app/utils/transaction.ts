import { encodeFunctionData, parseUnits } from "viem";
import { signPreparedCalls } from "@account-kit/wallet-client";
import { erc20Abi } from "@/app/utils/erc20Abi";
import { usdt_token, PAYMASTER_ADDRESS } from "@/app/config/environment";
import { USDT_DECIMALS, USDT_MOCK_VALUE } from "@/app/config/constants";
import { saveIndexKey } from "@/app/utils/indexDb";

export { USDT_MOCK_VALUE };

export const sendGasFeeAsUsdt = (usdtForGas: number): `0x${string}` => {
  const amountInWei = parseUnits(usdtForGas.toFixed(6), USDT_DECIMALS);
  return encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [PAYMASTER_ADDRESS as `0x${string}`, amountInWei],
  });
};

export const getTxHashAndReceipt = async ({
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

  // Retry getTransactionReceipt — receipt may not be available immediately
  let receipt = null;
  const receiptStart = Date.now();
  while (Date.now() - receiptStart < timeout) {
    try {
      receipt = await publicClient.getTransactionReceipt({ hash: txHash });
      if (receipt) break;
    } catch {
      // Receipt not yet available, retry
    }
    await new Promise((r) => setTimeout(r, interval));
  }

  if (!receipt) throw new Error("Transaction receipt not found within timeout");

  return { txHash, receipt };
};

export const sendSmartAccountTx = async ({
  calls,
  smartAccount,
  smartAccountClient,
  publicClient,
  permissions,
  sessionKey,
}: {
  calls: { to: `0x${string}`; data: `0x${string}` }[];
  smartAccount: string;
  smartAccountClient: any;
  publicClient: any;
  permissions: unknown;
  sessionKey: any;
}) => {
  const preparedCalls = await smartAccountClient.prepareCalls({
    calls,
    from: smartAccount,
    capabilities: { permissions },
  });

  const signedCalls = await signPreparedCalls(sessionKey, preparedCalls);

  const sendResult = await smartAccountClient.sendPreparedCalls({
    ...signedCalls,
    capabilities: { permissions },
  });

  const { preparedCallIds } = sendResult;

  const { txHash, receipt } = await getTxHashAndReceipt({
    preparedCallId: preparedCallIds[0],
    smartAccountClient,
    publicClient,
  });

  return { txHash, receipt };
};

export const isSessionNotFoundError = (error: any): boolean => {
  const message = error?.message || error?.details || "";
  return message.includes("Session not found");
};

export const clearStaleSession = async () => {
  localStorage.removeItem("sessionExpiryTime");
  await saveIndexKey("sessionKeyData", null);
};
