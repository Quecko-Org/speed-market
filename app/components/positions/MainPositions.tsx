"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import { usePositions } from "./PositionsContext";
import { getUserPosition } from "@/app/services/userPositions";

interface PositionItem {
  _id: string;
  betType?: "UP" | "DOWN";
  cryptoSymbol?: string;
  amount?: string;
  expiresAt?: string;
  pnl?: number;
  pnlPercent?: number;
}

function getRemainingTime(expiresAt?: string): string {
  if (!expiresAt) return "—";
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "0:00";
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface MainPositionsProps {
  symbol?: string | null;
}

const ITEMS_PER_PAGE = 20;

const MainPositions: FC<MainPositionsProps> = ({ symbol }) => {
  const { isOpen, toggle, close, activeTab, refreshKey } = usePositions();
  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [pnlData, setPnlData] = useState<{ totalPnL: number; totalAmount: number; totalPayout: number; totalBets: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [, setTick] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchPositions = async (pageNum: number, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    try {
      const response = await getUserPosition(symbol || undefined, pageNum, ITEMS_PER_PAGE);
      if (response) {
        const newBets = Array.isArray(response.bets) ? response.bets : [];
        setPositions((prev) => append ? [...prev, ...newBets] : newBets);
        setPnlData(response.pnl?.[0] ?? null);
        const totalPages = response.pages ?? 1;
        setHasMore(pageNum < totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    } finally {
      setLoading(false);
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

  // Live countdown
  useEffect(() => {
    if (positions.length === 0) return;
    const hasActive = positions.some(
      (p) => p.expiresAt && new Date(p.expiresAt).getTime() > Date.now()
    );
    if (!hasActive) return;

    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [positions]);

  const totalPnl = pnlData?.totalPnL ?? 0;
  const totalAmount = pnlData?.totalAmount ?? 0;
  const totalPnlPercent = totalAmount > 0 ? (totalPnl / totalAmount) * 100 : 0;
  const isPnlPositive = totalPnl >= 0;

  return (
    <aside className={`mainpositions ${isOpen ? "show" : "hide"}`}>

      <button className={`positions-handle ${
        activeTab === "activity" || activeTab === "comments"
          ? "active-style"
          : ""
      }`} onClick={toggle}>
        {!loading && positions.length > 0 && (
          <span className="mainnumber">{positions.length}</span>
        )}
        <p className="openpara">My Positions</p>
        <Icon name="openarrow" className={isOpen ? "rotate" : ""} />
      </button>

      <div className="positionheader">
        <div className="headerleft">
          <h3 className="mainheading">Open Positions ({positions.length})</h3>
          <p className="realpara">Real-time P&L tracking</p>
        </div>
        <button onClick={close} className="positionbtn">
          <Icon name="crossicon" />
        </button>
      </div>

      <div className="totalmain">
        <h6 className="totallefthead">Total P&L</h6>
        <div className="totalright">
          <h6 className={`totalhead ${isPnlPositive ? "greencolor" : "redcolor"}`}>
            {isPnlPositive ? "+" : ""}${totalPnl.toFixed(2)}
          </h6>
          <p className={`totalpara ${isPnlPositive ? "greencolor" : "redcolor"}`}>
            {isPnlPositive ? "+" : ""}{totalPnlPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="historytable" ref={scrollRef} onScroll={handleScroll}>
        <table>
          <thead>
            <tr>
              <th>Pair</th>
              <th>Time</th>
              <th>Amount</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#74728B", padding: 16 }}>
                  Loading...
                </td>
              </tr>
            ) : positions.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#74728B", padding: 16 }}>
                  No open positions
                </td>
              </tr>
            ) : (
              positions.map((item) => {
                const isUp = item.betType === "UP";
                const remaining = getRemainingTime(item.expiresAt);
                const isExpired = item.expiresAt && new Date(item.expiresAt).getTime() <= Date.now();
                const amount = Number(item.amount ?? 0);
                const pnl = isExpired ? amount * 1.92 : 0;
                const pnlPercent = isExpired && amount > 0 ? ((pnl - amount) / amount) * 100 : 0;
                const isPositive = pnl >= 0;

                return (
                  <tr key={item._id} className={isExpired ? (isPositive ? "green" : "red") : ""}>
                    <td>
                      <div className="maintoken">
                        <span className="tokenimg">
                          <Icon name={isUp ? "up" : "down"} />
                        </span>
                        <p className="tokenpara">{item.cryptoSymbol ?? "—"}/USDT</p>
                      </div>
                    </td>
                    <td>
                      <div className="maintimer">
                        <Icon name="timeicon" />
                        <p className="timepara">{remaining}</p>
                      </div>
                    </td>
                    <td><p className="amountpara">${amount.toFixed(0)}</p></td>
                    <td>
                      <div className="plmain">
                        {isExpired ? (
                          <>
                            <h6 className="plhead">
                              +${pnl.toFixed(2)}
                            </h6>
                            <p className="plpara">
                              +{pnlPercent.toFixed(1)}%
                            </p>
                          </>
                        ) : (
                          <h6 className="plhead">--</h6>
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

      <div className="positionfooter">
        <p className="footerpara">Positions update in real-time</p>
      </div>
    </aside>
  );
};

export default MainPositions;
