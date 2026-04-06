import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { createPublicClient, http, formatUnits } from "viem";
import { arbitrum } from "viem/chains";
import { erc20Abi } from "@/app/utils/erc20Abi";
import { usdt_token, ALCHEMY_RPC_URL } from "@/app/config/environment";
import {
  userSmartAccount,
  userSmartAccountUsdtBalance,
} from "@/app/store/atoms";
import { USDT_DECIMALS } from "@/app/config/constants";

const getPublicClient = () =>
  createPublicClient({
    chain: arbitrum,
    transport: http(ALCHEMY_RPC_URL),
  });

export const useGetUsdtBalance = () => {
  const smartAccount = useAtomValue(userSmartAccount);
  const [, setSmartAccountUsdtBalance] = useAtom(userSmartAccountUsdtBalance);

  const fetchUsdtBalance = useCallback(async () => {
    if (!smartAccount) return;

    try {
      const client = getPublicClient();
      const balance = await client.readContract({
        address: usdt_token as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [smartAccount as `0x${string}`],
      });

      const formatted = Number(formatUnits(balance, USDT_DECIMALS));
      setSmartAccountUsdtBalance(formatted);
      return formatted;
    } catch (error) {
      console.error("Error fetching USDT balance:", error);
      return 0;
    }
  }, [smartAccount, setSmartAccountUsdtBalance]);

  return fetchUsdtBalance;
};
