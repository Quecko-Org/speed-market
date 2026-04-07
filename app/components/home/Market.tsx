"use client";
import React, { FC, useEffect, useState } from "react";
import Icon from "../Icon";
import { usePositions } from "../positions/PositionsContext";
import QuickFireMarket from "./Quickfiremarket";
import PowerPlayMarket from "./Powerplaymarket";
import MasterModeMarket from "./Mastermodemarket";
import { getCoinsPrices, getSignature } from "@/app/services/coinListing";
import { useSpeedMarketSocket } from "@/app/hooks/useSpeedMarketSocket";
import { useAtomValue } from "jotai";
import {
  userSmartAccount,
  userSmartAccountClient,
  userSmartAccountUsdtBalance,
  userPublicClient,
} from "@/app/store/atoms";
import { useWalletContext } from "@/app/context/WalletContext";
import { useSessionPermissions } from "@/app/hooks/useSessionPermissions";
import { useGetUsdtBalance } from "@/app/hooks/useBalance";
import { encodeFunctionData, parseUnits } from "viem";
import { erc20Abi } from "@/app/utils/erc20Abi";
import { speedMarketAbi } from "@/app/utils/speedMarket";
import {
  SPEED_MARKET_CONTRACT,
  usdt_token,
} from "@/app/config/environment";
import { USDT_DECIMALS, USDT_MOCK_VALUE, MAX_UINT256 } from "@/app/config/constants";
import { sendGasFeeAsUsdt, sendSmartAccountTx, isSessionNotFoundError, clearStaleSession } from "@/app/utils/transaction";
import { handleCheckSession } from "@/app/utils/helpers";
import { toast } from "react-toastify";
import { showToast } from "@/app/hooks/showToast";

// ── Types ──────────────────────────────────────────────────────────────

export interface CoinType {
  _id: string;
  coinId: string;
  name: string;
  slug: string;
  symbol: string;
  type: string;
  currentPrice: string;
  change24hr: string;
  isActive: boolean;
  isDefault: boolean;
  imageurl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type TradeDirection = "UP" | "DOWN";
export type MarketDuration = "5 min" | "10 min" | "15 min";

export interface CreateTradeParams {
  amount: string;
  asset: string;
  duration: MarketDuration;
  type: TradeDirection;
}

export interface HandleCreateTrade {
  (params: CreateTradeParams): Promise<boolean>;
}

const DURATION_TO_EXPIRY_INDEX: Record<MarketDuration, number> = {
  "5 min": 1,
  "10 min": 2,
  "15 min": 3,
};

// ── Component ──────────────────────────────────────────────────────────

const Market: FC = () => {
  const { isOpen: isPositionsOpen, toggle, triggerRefresh } = usePositions();
  const [coinListing, setCoinListing] = useState<CoinType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTradeLoading, setIsTradeLoading] = useState(false);

  const usdtBalance = useAtomValue(userSmartAccountUsdtBalance);
  const smartAccount = useAtomValue(userSmartAccount);
  const smartAccountClient = useAtomValue(userSmartAccountClient);
  const publicClient = useAtomValue(userPublicClient);
  const { isWalletConnected, setIsLoading: setWalletLoading, setLoadingStep } = useWalletContext();
  const { grantPermissions } = useSessionPermissions();
  const fetchUsdtBalance = useGetUsdtBalance();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setIsLoading(true);
        const coinPriceResponse = await getCoinsPrices();
        setCoinListing(coinPriceResponse || []);
      } catch (error) {
        console.log("Error fetching coin prices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoins();
  }, []);

  // ── Socket: real-time price updates ──────────────────────────────
  useSpeedMarketSocket({
    onCoinPrices: (updatedCoins) => {
      setIsLoading(false);
      setCoinListing(updatedCoins);
    },
  });

  // ── Trade Execution ────────────────────────────────────────────────

  const handleCreateTrade: HandleCreateTrade = async ({ amount, asset, duration, type }) => {
    // Validations
    if (!isWalletConnected || !smartAccount) {
      toast.error("Please connect your wallet first");
      return false;
    }
    if (!smartAccountClient || !publicClient) {
      toast.error("Wallet not fully initialized. Please try again.");
      return false;
    }

    const trimmedAmount = amount.trim();
    const numAmount = Number(trimmedAmount);
    const maxPosition = usdtBalance >= 100 ? 100 : usdtBalance;

    if (!trimmedAmount || isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return false;
    }
    if (numAmount < 5) {
      toast.error("Minimum amount is $5");
      return false;
    }
    if (numAmount > maxPosition) {
      toast.error(`Maximum amount is $${maxPosition}`);
      return false;
    }
    if (!asset) {
      toast.error("Please select an asset");
      return false;
    }
    if (numAmount > usdtBalance) {
      toast.error("Insufficient USDT balance");
      return false;
    }
    if (isTradeLoading) return false;

    setIsTradeLoading(true);

    try {
      // 1. Session permissions (with stale session recovery)
      const needsPermission = await handleCheckSession();
      if (needsPermission) {
        setWalletLoading(true);
        setLoadingStep("Confirm permission request from your wallet");
      }
      let permResult = await grantPermissions();
      if (!permResult) {
        toast.error("Failed to grant session permissions");
        return false;
      }
      let { userPermissions: permissions, userSessionKey: sessionKey } = permResult;

      const amountInWei = parseUnits(trimmedAmount, USDT_DECIMALS);

      // Helper to run a tx, retrying once on stale session
      const execTx = async (calls: { to: `0x${string}`; data: `0x${string}` }[]) => {
        try {
          return await sendSmartAccountTx({
            calls,
            smartAccount,
            smartAccountClient,
            publicClient,
            permissions,
            sessionKey,
          });
        } catch (err: any) {
          if (isSessionNotFoundError(err)) {
            await clearStaleSession();
            const freshPerm = await grantPermissions();
            if (!freshPerm) throw new Error("Failed to refresh session permissions");
            permissions = freshPerm.userPermissions;
            sessionKey = freshPerm.userSessionKey;
            return await sendSmartAccountTx({
              calls,
              smartAccount,
              smartAccountClient,
              publicClient,
              permissions,
              sessionKey,
            });
          }
          throw err;
        }
      };

      // Hide overlay after permissions granted
      setWalletLoading(false);
      setLoadingStep("");

      // 2. Check allowance & approve if needed
      const allowance = await publicClient.readContract({
        address: usdt_token as `0x${string}`,
        abi: erc20Abi,
        functionName: "allowance",
        args: [smartAccount as `0x${string}`, SPEED_MARKET_CONTRACT as `0x${string}`],
      });

      if ((allowance as bigint) < amountInWei) {
        await execTx([
          {
            to: usdt_token as `0x${string}`,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "approve",
              args: [SPEED_MARKET_CONTRACT as `0x${string}`, MAX_UINT256],
            }),
          },
          {
            to: usdt_token as `0x${string}`,
            data: sendGasFeeAsUsdt(USDT_MOCK_VALUE),
          },
        ]);
      }
      // 3. Get signature from backend
      const signatureResponse = await getSignature({
        amount: trimmedAmount,
        asset,
        duration,
        type,
      });

      if (!signatureResponse) {
        toast.error("Failed to get trade signature from server");
        return false;
      }

      const sigData = signatureResponse;
      // 4. Execute createOption — use backend values for signed fields
      const createOptionArgs = [
        sigData.asset ?? asset,
        BigInt(sigData.amount ?? amountInWei.toString()),
        sigData.expiryIndex ?? DURATION_TO_EXPIRY_INDEX[duration],
        sigData.isCall ?? (type === "UP"),
        BigInt(sigData.price),
        BigInt(sigData.deadline),
        sigData.signature as `0x${string}`,
      ] as const;

      const { receipt } = await execTx([
        {
          to: SPEED_MARKET_CONTRACT as `0x${string}`,
          data: encodeFunctionData({
            abi: speedMarketAbi,
            functionName: "createOption",
            args: createOptionArgs,
          }),
        },
        {
          to: usdt_token as `0x${string}`,
          data: sendGasFeeAsUsdt(USDT_MOCK_VALUE),
        },
      ]);

      if (receipt.status === "reverted") {
        toast.error("Transaction reverted. Please try again.");
        return false;
      }

      // 5. Success
      showToast(type === "UP" ? "positionOpenedup" : "positionOpeneddown");
      fetchUsdtBalance();
      triggerRefresh();
      return true;
    } catch (error: any) {
      console.error("Trade execution error:", error);
      toast.error(error?.shortMessage || error?.message || "Transaction failed");
      return false;
    } finally {
      setIsTradeLoading(false);
      setLoadingStep("");
      setWalletLoading(false);
    }
  };

  return (
    <section className="speedmarket">
      <button
        className="openbtn"
        onClick={toggle}
        style={{ right: isPositionsOpen ? "339px" : "0" }}
      >
        <span className="mainnumber"></span>
        <p className="openpara">Open Positions</p>
        <Icon name="openarrow" className={isPositionsOpen ? "rotate" : ""} />
      </button>

      <h1 className="markethead">Speed Markets</h1>
      <p className="marketpara">
        Make fast predictions on price movements. Win 2x your stake in minutes!
      </p>

      <QuickFireMarket
        coinListing={coinListing}
        isLoading={isLoading}
        usdtBalance={usdtBalance}
        onCreateTrade={handleCreateTrade}
        isTradeLoading={isTradeLoading}
      />
      <PowerPlayMarket
        coinListing={coinListing}
        isLoading={isLoading}
        usdtBalance={usdtBalance}
        onCreateTrade={handleCreateTrade}
        isTradeLoading={isTradeLoading}
      />
      <MasterModeMarket
        coinListing={coinListing}
        isLoading={isLoading}
        usdtBalance={usdtBalance}
        onCreateTrade={handleCreateTrade}
        isTradeLoading={isTradeLoading}
      />
    </section>
  );
};

export default Market;
