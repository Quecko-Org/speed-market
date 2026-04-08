"use client";
import React, { FC, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "../Icon";
import { usePositions } from "../positions/PositionsContext";
import Footer from "../footer/Footer";
import { Tab, Tabs } from "react-bootstrap";
import TradingChart from "./TradingChart";
import CommentSection from "./CommentSection";
import PlacePredictionModal from "../modals/PlacePredictionModal";
import TradeForm from "./PlaceTradeComponent";
import Token from "./Token";
import Marketinfo from "./Marketinfo";
import Positiontable from "./Positiontable";
import Activity from "./Activity";
import History from "./History";
import Sharemarket from "./Sharemarket";
import { getCoinDetail, getCoinActivity, getSignature } from "@/app/services/coinListing";
import { getSocket } from "@/app/services/socket";
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
import { showToast } from "@/app/hooks/showToast";
import type { MarketDuration } from "../home/Market";

const DURATION_TO_EXPIRY_INDEX: Record<MarketDuration, number> = {
  "5 min": 1,
  "10 min": 2,
  "15 min": 3,
};

const Exploredetail: FC = () => {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");
  const duration = searchParams.get("duration") as MarketDuration | null;

  const { activeTab, setActiveTab, isOpen: isPositionsOpen, toggle, triggerRefresh } = usePositions();

  const [coinDetail, setCoinDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isTradeLoading, setIsTradeLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [positionRefreshKey, setPositionRefreshKey] = useState(0);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [chartPositions, setChartPositions] = useState<{ entryPrice: number; betType: "UP" | "DOWN" }[]>([]);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleTimerExpired = () => {
    setPositionRefreshKey((k) => k + 1);
    setHistoryRefreshKey((k) => k + 1);
  };

  const usdtBalance = useAtomValue(userSmartAccountUsdtBalance);
  const smartAccount = useAtomValue(userSmartAccount);
  const smartAccountClient = useAtomValue(userSmartAccountClient);
  const publicClient = useAtomValue(userPublicClient);
  const { isWalletConnected, setIsLoading: setWalletLoading, setLoadingStep } = useWalletContext();
  const { grantPermissions } = useSessionPermissions();
  const fetchUsdtBalance = useGetUsdtBalance();

  const [activities, setActivities] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityPage, setActivityPage] = useState(0);
  const [activityTotalPages, setActivityTotalPages] = useState(0);
  const ACTIVITY_LIMIT = 10;

  useEffect(() => {
    if (!symbol) return;

    const fetchCoinDetail = async () => {
      setLoading(true);
      try {
        const response = await getCoinDetail(symbol);
        setCoinDetail(response);
      } catch (err) {
        console.error("Failed to fetch coin detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetail();
  }, [symbol]);

  // Socket: update coinDetail with live price data
  useEffect(() => {
    if (!symbol) return;

    const socket = getSocket();

    const handler = (eventData: any) => {
      if (eventData?.eventType !== "CoinPricesV1") return;

      const coins = eventData?.data?.coins ?? eventData?.coins ?? eventData?.data;
      if (!Array.isArray(coins)) return;

      const coin = coins.find(
        (c: any) => c.symbol?.toUpperCase() === symbol.toUpperCase()
      );
      if (!coin) return;

      setCoinDetail((prev: any) => (prev ? { ...prev, ...coin } : coin));
    };

    socket.on("speed_market_event", handler);
    return () => { socket.off("speed_market_event", handler); };
  }, [symbol]);

  const fetchActivity = async (page: number) => {
    if (!symbol) return;
    setActivityLoading(true);
    try {
      const response = await getCoinActivity(symbol, page + 1, ACTIVITY_LIMIT);
      if (response) {
        setActivities(response.bets ?? response.data ?? []);
        setActivityTotalPages(response.pages ?? Math.ceil((response.count ?? 0) / ACTIVITY_LIMIT));
      }
    } catch (err) {
      console.error("Failed to fetch coin activity:", err);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) fetchActivity(activityPage);
  }, [symbol, activityPage]);

  const handleActivityPageChange = (page: number) => {
    setActivityPage(page);
  };

  const [direction, setDirection] = useState<"UP" | "DOWN">("UP");
  const [amount, setAmount] = useState(5);

  const maxPosition = usdtBalance >= 150 ? 150 : usdtBalance;
  const quickValues = [5, 10, 50, 100];

  const feeValue = amount * 0.05;
  const effectiveAmount = amount - feeValue;
  const potentialWin = effectiveAmount * 2;

  const handlePlacePrediction = async () => {
    if (!symbol || !duration) {
      showToast("error", { message: "Missing symbol or duration" });
      return;
    }
    if (!isWalletConnected || !smartAccount) {
      showToast("error", { message: "Please connect your wallet first" });
      return;
    }
    if (!smartAccountClient || !publicClient) {
      showToast("error", { message: "Wallet not fully initialized. Please try again." });
      return;
    }

    const trimmedAmount = String(amount).trim();
    const numAmount = Number(trimmedAmount);

    if (!trimmedAmount || isNaN(numAmount) || numAmount <= 0) {
      showToast("error", { message: "Please enter a valid amount greater than 0" });
      return;
    }
    if (numAmount < 5) {
      showToast("error", { message: "Minimum amount is $5" });
      return;
    }
    if (numAmount > maxPosition) {
      showToast("error", { message: `Maximum amount is $${maxPosition}` });
      return;
    }
    if (numAmount > usdtBalance) {
      showToast("error", { message: "Insufficient USDT balance" });
      return;
    }
    if (isTradeLoading) return;

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
        showToast("error", { message: "Failed to grant session permissions" });
        return;
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
        asset: symbol,
        duration,
        type: direction,
      });

      if (!signatureResponse) {
        showToast("error", { message: "Failed to get trade signature from server" });
        return;
      }

      // 4. Execute createOption
      const createOptionArgs = [
        signatureResponse.asset ?? symbol,
        BigInt(signatureResponse.amount ?? amountInWei.toString()),
        signatureResponse.expiryIndex ?? DURATION_TO_EXPIRY_INDEX[duration],
        signatureResponse.isCall ?? (direction === "UP"),
        BigInt(signatureResponse.price),
        BigInt(signatureResponse.deadline),
        signatureResponse.signature as `0x${string}`,
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
        showToast("error", { message: "Transaction reverted. Please try again." });
        return;
      }

      // 5. Success
      showToast(direction === "UP" ? "positionOpenedup" : "positionOpeneddown", {
        asset: `${symbol}/USDT`,
        amount: String(amount),
        duration: duration ?? "5 min",
      });
      fetchUsdtBalance();
      triggerRefresh();
      setTimeout(() => setPositionRefreshKey((k) => k + 1), 5000);
      handleClose();
    } catch (error: any) {
      console.error("Trade execution error:", error);
      showToast("error", { message: error?.shortMessage || error?.message || "Transaction failed" });
    } finally {
      setIsTradeLoading(false);
      setLoadingStep("");
      setWalletLoading(false);
    }
  };
  return (
    <>
      <section className="detailmain speedmarket">
        <button
          className="openbtn"
          onClick={toggle}
          style={{ right: isPositionsOpen ? "339px" : "0" }}
        >
          <span className="mainnumber"></span>
          <p className="openpara">Open Positions</p>
          <Icon name="openarrow" className={isPositionsOpen ? "rotate" : ""} />
        </button>
        <div className="detaileft">
          <div className="mobiletabs d-none">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k as any)}
              className="detailtabs"
            >
              <Tab eventKey="trade" title="Trade">
                <Token coinDetail={coinDetail} duration={duration} loading={loading} />
                <div className="chart-parent">
                  <TradingChart coinDetail={coinDetail} symbol={symbol} duration={duration} />
                </div>
                <Positiontable symbol={symbol} refreshKey={positionRefreshKey} onTimerExpired={handleTimerExpired} />
                <Sharemarket />
                <Marketinfo coinDetail={coinDetail} />
                <div className="placemain">
                  <button
                    onClick={handleOpen}
                    className="placebtn"
                  >
                    Place Prediction
                  </button>
                </div>
              </Tab>
              <Tab eventKey="activity" title="Activity">
                <div className="activitytabs">
                  <Tabs
                    defaultActiveKey="activity"
                    id="uncontrolled-tab-example"
                    className="mblactivitytabs"
                  >
                    <Tab eventKey="activity" title="Activity">
                      <Activity
                        activities={activities}
                        loading={activityLoading}
                        currentPage={activityPage}
                        totalPages={activityTotalPages}
                        onPageChange={handleActivityPageChange}
                      />
                    </Tab>
                    <Tab eventKey="history" title="History">
                      <History symbol={symbol} refreshKey={historyRefreshKey} />
                    </Tab>
                  </Tabs>
                </div>
              </Tab>
              <Tab eventKey="comments" title="Comments">
                <CommentSection coinId={coinDetail?._id ?? coinDetail?._id ?? ""} />
              </Tab>
            </Tabs>
          </div>
          <div className="d-noneformobileview w-100">
            <Token coinDetail={coinDetail} duration={duration} loading={loading} />

            <div className="chart-parent">
              <TradingChart coinDetail={coinDetail} symbol={symbol} duration={duration} />
            </div>
            <Positiontable symbol={symbol} refreshKey={positionRefreshKey} onTimerExpired={handleTimerExpired} />
            <Marketinfo coinDetail={coinDetail} />
            <div className="maintabs">
              <Tabs
                defaultActiveKey="comments"
                id="uncontrolled-tab-example"
                className="detailtabs"
              >
                <Tab eventKey="comments" title="Comments">
                  <CommentSection coinId={coinDetail?._id ?? coinDetail?._id ?? ""} />
                </Tab>
                <Tab eventKey="activity" title="Activity">
                  <Activity
                    activities={activities}
                    loading={activityLoading}
                    currentPage={activityPage}
                    totalPages={activityTotalPages}
                    onPageChange={handleActivityPageChange}
                  />
                </Tab>
                <Tab eventKey="history" title="History">
                  <History symbol={symbol} refreshKey={historyRefreshKey} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="detailright">
          <Sharemarket />
          <TradeForm
            direction={direction}
            setDirection={setDirection}
            amount={amount}
            setAmount={setAmount}
            maxPosition={maxPosition}
            balance={usdtBalance}
            quickValues={quickValues}
            feeValue={feeValue}
            effectiveAmount={effectiveAmount}
            potentialWin={potentialWin}
            onPlacePrediction={handlePlacePrediction}
            isTradeLoading={isTradeLoading}
          />
        </div>
      </section>
      <Footer />
      <PlacePredictionModal
        show={showModal}
        handleClose={handleClose}
        direction={direction}
        setDirection={setDirection}
        amount={amount}
        setAmount={setAmount}
        maxPosition={maxPosition}
        balance={usdtBalance}
        quickValues={quickValues}
        feeValue={feeValue}
        effectiveAmount={effectiveAmount}
        potentialWin={potentialWin}
        onPlacePrediction={handlePlacePrediction}
        isTradeLoading={isTradeLoading}
      />
    </>
  );
};

export default Exploredetail;
