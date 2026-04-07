import React, { FC, useEffect, useState } from "react";
import Icon from "../Icon";
import Claimprocessedmodal from "../modals/Claimprocessedmodal";
import Sharebetmodal from "../modals/Sharebetmodal";
import { getUserPosition, getClaimSignature } from "@/app/services/userPositions";
import { useAtomValue } from "jotai";
import {
  userSmartAccount,
  userSmartAccountClient,
  userPublicClient,
} from "@/app/store/atoms";
import { useWalletContext } from "@/app/context/WalletContext";
import { useSessionPermissions } from "@/app/hooks/useSessionPermissions";
import { useGetUsdtBalance } from "@/app/hooks/useBalance";
import { encodeFunctionData } from "viem";
import { speedMarketAbi } from "@/app/utils/speedMarket";
import { SPEED_MARKET_CONTRACT, usdt_token } from "@/app/config/environment";
import { USDT_MOCK_VALUE } from "@/app/config/constants";
import { sendGasFeeAsUsdt, sendSmartAccountTx, isSessionNotFoundError, clearStaleSession } from "@/app/utils/transaction";
import { toast } from "react-toastify";

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

const Positiontable: FC<PositiontableProps> = ({ symbol }) => {
  const [positions, setPositions] = useState<any[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [, setTick] = useState(0);
  const [claimingId, setClaimingId] = useState<string | null>(null);
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
  const { isWalletConnected } = useWalletContext();
  const { grantPermissions } = useSessionPermissions();
  const fetchUsdtBalance = useGetUsdtBalance();

  // Live countdown timer
  useEffect(() => {
    if (positions.length === 0) return;
    const hasActive = positions.some(
      (p: any) => p.expiresAt && new Date(p.expiresAt).getTime() > Date.now()
    );
    if (!hasActive) return;

    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [positions]);

  // Fetch positions
  useEffect(() => {
    if (!symbol) return;

    const fetchPositions = async () => {
      setPositionsLoading(true);
      try {
        const response = await getUserPosition(symbol);
        setPositions(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Failed to fetch positions:", err);
      } finally {
        setPositionsLoading(false);
      }
    };

    fetchPositions();
  }, [symbol]);

  // Claim handler
  const handleClaim = async (betId: string, optionId: string) => {
    if (!isWalletConnected || !smartAccount) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!smartAccountClient || !publicClient) {
      toast.error("Wallet not fully initialized. Please try again.");
      return;
    }
    if (claimingId) return;

    setClaimingId(betId);

    try {
      const sigResponse = await getClaimSignature({ betId });
      if (!sigResponse) {
        toast.error("Failed to get claim signature from server");
        return;
      }

      let permResult = await grantPermissions();
      if (!permResult) {
        toast.error("Failed to grant session permissions");
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
        toast.error("Claim transaction reverted. Please try again.");
        return;
      }

      toast.success("Claim successful!");
      fetchUsdtBalance();
      if (symbol) {
        const response = await getUserPosition(symbol);
        setPositions(Array.isArray(response) ? response : []);
      }
    } catch (error: any) {
      console.error("Claim error:", error);
      toast.error(error?.shortMessage || error?.message || "Claim failed");
    } finally {
      setClaimingId(null);
    }
  };

  const openModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: true }));
  };

  const closeModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: false }));
  };

  return (
    <>
      <div className="mainpositiontable">
        <div className="tabletop">
          <p className="positionhead">Positions ({positions.length})</p>
          {/* <button className="claimallbtn">Claim All</button> */}
        </div>

        <div className="table-responsive">
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
                  const { time, full } = formatDate(item.createdAt);
                  const settlementPrice = item.entryPrice
                    ? `$${Number(item.entryPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}`
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
                          <h6 className="timehead">{time}</h6>
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
                          <button
                            onClick={() => openModal("Sharebet")}
                            className="sharebtn"
                          >
                            <Icon name="predictionshare" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
              const { time, full } = formatDate(item.createdAt);
              const settlementPrice = item.entryPrice
                ? `$${Number(item.entryPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}`
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
                        <h6 className="timehead">{time}</h6>
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
                        <button
                          onClick={() => openModal("Sharebet")}
                          className="sharebtn"
                        >
                          <Icon name="predictionshare" />
                        </button>
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
      <Sharebetmodal
        show={modals.Sharebet}
        onHide={() => closeModal("Sharebet")}
      />
    </>
  );
};

export default Positiontable;
