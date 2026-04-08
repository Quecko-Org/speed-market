import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { erc20Abi } from "@/app/utils/erc20Abi";
import { usdt_token } from "@/app/config/environment";
import { USDT_DECIMALS } from "@/app/config/constants";
import { showToast } from "@/app/hooks/showToast";

export const useDepositTransfer = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [isTransferring, setIsTransferring] = useState(false);

  const getWalletBalance = useCallback(async (): Promise<string> => {
    if (!address || !publicClient) return "0";
    try {
      const balance = await publicClient.readContract({
        address: usdt_token as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      });
      return formatUnits(balance as bigint, USDT_DECIMALS);
    } catch {
      return "0";
    }
  }, [address, publicClient]);

  const transferToSmartAccount = useCallback(
    async (toAddress: string, amount: string) => {
      if (!isConnected || !address) {
        showToast("error", { message: "Wallet not connected" });
        return false;
      }
      if (!publicClient) {
        showToast("error", { message: "Public client not available" });
        return false;
      }

      setIsTransferring(true);

      try {
        const tokenAmount = parseUnits(amount, USDT_DECIMALS);

        const gasPrice = await publicClient.getGasPrice();
        const adjustedGasPrice = gasPrice * 2n;

        const gasEstimate = await publicClient.estimateContractGas({
          address: usdt_token as `0x${string}`,
          abi: erc20Abi,
          functionName: "transfer",
          args: [toAddress as `0x${string}`, tokenAmount],
          account: address,
        });

        const totalGasCost = gasEstimate * adjustedGasPrice;
        const nativeBalance = await publicClient.getBalance({ address });

        if (nativeBalance < totalGasCost) {
          showToast("error", { message: "Insufficient ETH for gas fees" });
          return false;
        }

        const hash = await writeContractAsync({
          address: usdt_token as `0x${string}`,
          abi: erc20Abi,
          functionName: "transfer",
          args: [toAddress as `0x${string}`, tokenAmount],
          gas: gasEstimate,
          gasPrice: adjustedGasPrice,
        });

        return hash;
      } catch (error: any) {
        console.error("Transfer error:", error);
        showToast("error", { message: error?.shortMessage || error?.message || "Transfer failed" });
        return false;
      } finally {
        setIsTransferring(false);
      }
    },
    [address, isConnected, publicClient, writeContractAsync]
  );

  return { getWalletBalance, transferToSmartAccount, isTransferring, walletAddress: address };
};
