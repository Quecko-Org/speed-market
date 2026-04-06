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
import { getCoinDetail, getSignature } from "@/app/services/coinListing";
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
import { toast } from "react-toastify";
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

  const { activeTab, setActiveTab, isOpen: isPositionsOpen, toggle } = usePositions();

  const [coinDetail, setCoinDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isTradeLoading, setIsTradeLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const usdtBalance = useAtomValue(userSmartAccountUsdtBalance);
  const smartAccount = useAtomValue(userSmartAccount);
  const smartAccountClient = useAtomValue(userSmartAccountClient);
  const publicClient = useAtomValue(userPublicClient);
  const { isWalletConnected } = useWalletContext();
  const { grantPermissions } = useSessionPermissions();
  const fetchUsdtBalance = useGetUsdtBalance();

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

  const [direction, setDirection] = useState<"UP" | "DOWN">("UP");
  const [amount, setAmount] = useState(5);

  const maxPosition = usdtBalance >= 100 ? 100 : usdtBalance;
  const quickValues = [5, 10, 50, 100];

  const feeValue = amount * 0.05;
  const effectiveAmount = amount - feeValue;
  const potentialWin = effectiveAmount * 2;

  const handlePlacePrediction = async () => {
    if (!symbol || !duration) {
      toast.error("Missing symbol or duration");
      return;
    }
    if (!isWalletConnected || !smartAccount) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!smartAccountClient || !publicClient) {
      toast.error("Wallet not fully initialized. Please try again.");
      return;
    }

    const trimmedAmount = String(amount).trim();
    const numAmount = Number(trimmedAmount);

    if (!trimmedAmount || isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    if (numAmount < 5) {
      toast.error("Minimum amount is $5");
      return;
    }
    if (numAmount > maxPosition) {
      toast.error(`Maximum amount is $${maxPosition}`);
      return;
    }
    if (numAmount > usdtBalance) {
      toast.error("Insufficient USDT balance");
      return;
    }
    if (isTradeLoading) return;

    setIsTradeLoading(true);

    try {
      // 1. Session permissions (with stale session recovery)
      let permResult = await grantPermissions();
      if (!permResult) {
        toast.error("Failed to grant session permissions");
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
        toast.error("Failed to get trade signature from server");
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
        toast.error("Transaction reverted. Please try again.");
        return;
      }

      // 5. Success
      showToast(direction === "UP" ? "positionOpenedup" : "positionOpeneddown");
      fetchUsdtBalance();
      handleClose();
    } catch (error: any) {
      console.error("Trade execution error:", error);
      toast.error(error?.shortMessage || error?.message || "Transaction failed");
    } finally {
      setIsTradeLoading(false);
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
          <span className="mainnumber">13</span>
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
                  <TradingChart coinDetail={coinDetail} symbol={symbol} />
                </div>
                <Positiontable />
                <Sharemarket />
                <Marketinfo coinDetail={coinDetail} />
                <div className="placemain d-none">
                  <button
                    onClick={() => {
                      handleOpen();
                    }}
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
                      <Activity />
                    </Tab>
                    <Tab eventKey="history" title="History">
                      <History />
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
              <TradingChart coinDetail={coinDetail} symbol={symbol} />
            </div>
            <Positiontable />
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
                  <Activity />
                </Tab>
                <Tab eventKey="history" title="History">
                  <History />
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
      <PlacePredictionModal show={showModal} handleClose={handleClose} />
    </>
  );
};

export default Exploredetail;
