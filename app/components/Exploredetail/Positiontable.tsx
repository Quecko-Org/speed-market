import React, { FC, useEffect, useState } from "react";
import Icon from "../Icon";
import Claimprocessedmodal from "../modals/Claimprocessedmodal";
import Shareresultsmodal, { ShareResultsData } from "../modals/Shareresultsmodal";
import { getUserPosition, getClaimSignature } from "@/app/services/userPositions";
import { usePositions } from "../positions/PositionsContext";
import { useAtomValue } from "jotai";
import {
  userSmartAccount,
  userSmartAccountClient,
  userPublicClient,
  userProfileData,
} from "@/app/store/atoms";
import { useWalletContext } from "@/app/context/WalletContext";
import { useSessionPermissions } from "@/app/hooks/useSessionPermissions";
import { useGetUsdtBalance } from "@/app/hooks/useBalance";
import { encodeFunctionData } from "viem";
import { speedMarketAbi } from "@/app/utils/speedMarket";
import { SPEED_MARKET_CONTRACT, usdt_token } from "@/app/config/environment";
import { USDT_MOCK_VALUE } from "@/app/config/constants";
import { sendGasFeeAsUsdt, sendSmartAccountTx, isSessionNotFoundError, clearStaleSession } from "@/app/utils/transaction";
import { handleCheckSession } from "@/app/utils/helpers";
import { showToast } from "@/app/hooks/showToast";

type ModalKeys =
  | "createprofile"
  | "Shareresults"
  | "Claimprocessed"
  | "Claimsuccessfully"
  | "Sharemarket"
  | "Sharebet"
  | "withdraw"
  | "deposit";
type ModalState = Record<ModalKeys, boolean>;

interface PositiontableProps {
  symbol: string | null;
  refreshKey?: number;
  onTimerExpired?: () => void;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return { time: "—", full: "—" };
  const d = new Date(dateStr);
  const time = d.toLocaleTimeString("en-US", { hour12: false });
  const full = `${d.toISOString().split("T")[0]} ${time}`;
  return { time, full };
}

function getRemainingTime(expiresAt?: string): string {
  if (!expiresAt) return "—";
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

const ITEMS_PER_PAGE = 10;

const Positiontable: FC<PositiontableProps> = ({ symbol, refreshKey, onTimerExpired }) => {
  const { refreshNow } = usePositions();
  const [positions, setPositions] = useState<any[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [, setTick] = useState(0);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [modals, setModals] = useState<ModalState>({
    createprofile: false,
    Shareresults: false,
    Claimprocessed: false,
    Claimsuccessfully: false,
    Sharemarket: false,
    Sharebet: false,
    withdraw: false,
    deposit: false,
  });

  const smartAccount = useAtomValue(userSmartAccount);
  const smartAccountClient = useAtomValue(userSmartAccountClient);
  const publicClient = useAtomValue(userPublicClient);
  const userProfile = useAtomValue(userProfileData);
  const { isWalletConnected, setIsLoading: setWalletLoading, setLoadingStep } = useWalletContext();
  const { grantPermissions } = useSessionPermissions();
  const fetchUsdtBalance = useGetUsdtBalance();

  // Live countdown timer + detect expiry
  const expiredIdsRef = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    if (positions.length === 0) return;
    const hasActive = positions.some(
      (p: any) => p.expiresAt && new Date(p.expiresAt).getTime() > Date.now()
    );
    if (!hasActive) return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);

      // Check if any position just expired
      let newlyExpired = false;
      positions.forEach((p: any) => {
        if (
          p.expiresAt &&
          new Date(p.expiresAt).getTime() <= Date.now() &&
          !expiredIdsRef.current.has(p._id)
        ) {
          expiredIdsRef.current.add(p._id);
          newlyExpired = true;
        }
      });

      if (newlyExpired && symbol) {
        // Background refresh positions
        getUserPosition(symbol).then((response) => {
          setPositions(Array.isArray(response?.bets) ? response.bets : Array.isArray(response) ? response : []);
        });
        onTimerExpired?.();
        refreshNow();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [positions, symbol, onTimerExpired]);

  // Fetch positions
  const fetchPositions = async (pageNum: number, append = false) => {
    if (!symbol) return;
    if (!append) setPositionsLoading(true);
    else setLoadingMore(true);
    try {
      const response = await getUserPosition(symbol, pageNum, ITEMS_PER_PAGE);
      const newBets = Array.isArray(response?.bets) ? response.bets : Array.isArray(response) ? response : [];
      setPositions((prev) => append ? [...prev, ...newBets] : newBets);
      const totalPages = response?.pages ?? 1;
      setHasMore(pageNum < totalPages);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    } finally {
      setPositionsLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPositions(1);
  }, [symbol, refreshKey]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loadingMore || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPositions(nextPage, true);
    }
  };

  // Claim handler
  const handleClaim = async (betId: string, optionId: string) => {
    if (!isWalletConnected || !smartAccount) {
      showToast("error", { message: "Please connect your wallet first" });
      return;
    }
    if (!smartAccountClient || !publicClient) {
      showToast("error", { message: "Wallet not fully initialized. Please try again." });
      return;
    }
    if (claimingId) return;

    setClaimingId(betId);

    try {
      const sigResponse = await getClaimSignature({ betId });
      if (!sigResponse) {
        showToast("error", { message: "Failed to get claim signature from server" });
        return;
      }

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

      const claimArgs = [
        BigInt(sigResponse.optionId ?? optionId),
        BigInt(sigResponse.price),
        BigInt(sigResponse.deadline),
        sigResponse.signature as `0x${string}`,
      ] as const;

      const { receipt } = await execTx([
        {
          to: SPEED_MARKET_CONTRACT as `0x${string}`,
          data: encodeFunctionData({
            abi: speedMarketAbi,
            functionName: "claim",
            args: claimArgs,
          }),
        },
        {
          to: usdt_token as `0x${string}`,
          data: sendGasFeeAsUsdt(USDT_MOCK_VALUE),
        },
      ]);

      if (receipt.status === "reverted") {
        showToast("error", { message: "Claim transaction reverted. Please try again." });
        return;
      }

      showToast("success", { message: "Claim successful!" });
      fetchUsdtBalance();
      const claimedItem = positions.find((p) => p._id === betId);
      setPositions((prev) => prev.filter((p) => p._id !== betId));
      refreshNow();
      if (claimedItem) openClaimShareModal(claimedItem);
    } catch (error: any) {
      console.error("Claim error:", error);
      showToast("error", { message: error?.shortMessage || error?.message || "Claim failed" });
    } finally {
      setClaimingId(null);
      setLoadingStep("");
      setWalletLoading(false);
    }
  };

  const closeModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: false }));
  };

  const [shareResultsData, setShareResultsData] = useState<ShareResultsData | undefined>();
  const [showShareResults, setShowShareResults] = useState(false);

  const openClaimShareModal = (item: any) => {
    setShareResultsData({
      symbol: item.cryptoSymbol,
      betType: item.betType,
      duration: item.timeframe ?? item.duration,
      baselinePrice: item.entryPrice ? `$${Number(item.entryPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}` : "—",
      settlementPrice: item.exitPrice ? `$${Number(item.exitPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}` : "—",
      amount: Number(item.amount ?? 0).toFixed(2),
      earned: Number((Number(item.amount ?? 0) * 1.92)).toFixed(2),
      pnl: Number((Number(item.amount ?? 0) * 1.92) - Number(item.amount ?? 0)).toFixed(2),
      result: "WIN",
      userName: userProfile?.displayName ?? "User",
      userImage: userProfile?.profileImage ?? "/importantassets/dummyrain.png",
    });
    setShowShareResults(true);
  };

  return (
    <>
      <div className="mainpositiontable">
        <div className="tabletop">
          <p className="positionhead">Positions ({positions.length})</p>
          {/* <button className="claimallbtn">Claim All</button> */}
        </div>

        <div className="table-responsive" ref={scrollRef} onScroll={handleScroll}>
          <table>
            <thead>
              <tr>
                <th>Prediction</th>
                <th>Baseline value and time</th>
                <th>Settlement Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {positionsLoading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "#74728B", padding: 24 }}>
                    Loading positions...
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "#74728B", padding: 24 }}>
                    No open positions
                  </td>
                </tr>
              ) : (
                positions.map((item: any) => {
                  const isUp = item.betType === "UP";
                  const { full } = formatDate(item.createdAt);
                  const baselinePrice = item.entryPrice
                    ? `$${Number(item.entryPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}`
                    : "—";
                  const settlementPrice = item.exitPrice
                    ? `$${Number(item.exitPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}`
                    : "—";
                  const remaining = getRemainingTime(item.expiresAt);
                  const isClaimable = item.status === "FINALISED" || item.isClaimable;

                  return (
                    <tr key={item._id}>
                      <td>
                        <div className={`predictionmain ${isUp ? "upmain" : "downmain"}`}>
                          <span className="predictionimg">
                            <Icon name={isUp ? "up" : "down"} className={isUp ? "up" : "down"} />
                          </span>
                          <p className="predictionpara">{isUp ? "Up" : "Down"}</p>
                        </div>
                      </td>
                      <td>
                        <div className="maintime">
                          <h6 className="timehead">{baselinePrice}</h6>
                          <p className="timepara">{full}</p>
                        </div>
                      </td>
                      <td>{settlementPrice}</td>
                      <td>
                        <div className="tablebuttons">
                          {isClaimable ? (
                            <button
                              onClick={() => handleClaim(item._id, item.optionId)}
                              className="claimbtn"
                              disabled={claimingId === item._id}
                            >
                              {claimingId === item._id ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                                  Claiming...
                                </>
                              ) : (
                                "Claim"
                              )}
                            </button>
                          ) : (
                            <button className="timerbtn">{remaining}</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {loadingMore && (
            <p style={{ textAlign: "center", color: "#74728B", fontSize: 12, padding: 8 }}>Loading more...</p>
          )}
        </div>

        {/* Mobile view */}
        <div className="mobileboxes d-none">
          {positionsLoading ? (
            <p style={{ textAlign: "center", color: "#74728B", padding: 16 }}>Loading positions...</p>
          ) : positions.length === 0 ? (
            <p style={{ textAlign: "center", color: "#74728B", padding: 16 }}>No open positions</p>
          ) : (
            positions.map((item: any) => {
              const isUp = item.betType === "UP";
              const { full } = formatDate(item.createdAt);
              const baselinePrice = item.entryPrice
                ? `$${Number(item.entryPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}`
                : "—";
              const settlementPrice = item.exitPrice
                ? `$${Number(item.exitPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}`
                : "—";
              const remaining = getRemainingTime(item.expiresAt);
              const isClaimable = item.status === "FINALISED" || item.isClaimable;

              return (
                <div className="innerbox" key={item._id}>
                  <div className="innerboxmain">
                    <div className="box">
                      <p className="boxpara">Prediction</p>
                      <div className={`predictionmain ${isUp ? "upmain" : "downmain"}`}>
                        <span className="predictionimg">
                          <Icon name={isUp ? "up" : "down"} className={isUp ? "up" : "down"} />
                        </span>
                        <p className="predictionpara">{isUp ? "Up" : "Down"}</p>
                      </div>
                    </div>
                    <div className="box">
                      <p className="boxpara">Baseline value and time</p>
                      <div className="maintime">
                        <h6 className="timehead">{baselinePrice}</h6>
                        <p className="timepara">{full}</p>
                      </div>
                    </div>
                  </div>
                  <div className="innerboxmain">
                    <div className="box">
                      <p className="boxpara">Settlement Price</p>
                      <h6 className="boxhead">{settlementPrice}</h6>
                    </div>
                    <div className="box">
                      <div className="tablebuttons">
                        {isClaimable ? (
                          <button
                            onClick={() => handleClaim(item._id, item.optionId)}
                            className="claimbtn"
                            disabled={claimingId === item._id}
                          >
                            {claimingId === item._id ? "Claiming..." : "Claim"}
                          </button>
                        ) : (
                          <button className="timerbtn">{remaining}</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Claimprocessedmodal
        show={modals.Claimprocessed}
        onHide={() => closeModal("Claimprocessed")}
      />
      <Shareresultsmodal
        show={showShareResults}
        onHide={() => setShowShareResults(false)}
        data={shareResultsData}
      />
    </>
  );
};

export default Positiontable;
