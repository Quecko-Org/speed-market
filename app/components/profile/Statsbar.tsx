"use client";
import React, { FC } from "react";

interface StatsBarProps {
  pnlData: {
    totalPnL?: number;
    totalInvested?: number;
    totalPayout?: number;
    totalBets?: number;
  } | null;
}

const StatsBar: FC<StatsBarProps> = ({ pnlData }) => {
  const totalBets = pnlData?.totalBets ?? 0;
  const totalAmount = pnlData?.totalInvested ?? 0;
  const totalPayout = pnlData?.totalPayout ?? 0;
  const totalPnL = pnlData?.totalPnL ?? 0;
  const isPnlPositive = totalPnL >= 0;

  return (
    <div className="middetails">
      <div className="innerdetail">
        <p className="detailpara">Total Bets</p>
        <h6 className="detailhead">{totalBets}</h6>
      </div>
      <div className="innerdetail">
        <p className="detailpara">Total Payout</p>
        <h6 className="detailhead">${totalPayout.toFixed(2)}</h6>
      </div>
      <div className="innerdetail">
        <p className="detailpara">Total Invested</p>
        <h6 className="detailhead">${totalAmount.toFixed(2)}</h6>
      </div>
      <div className="innerdetail">
        <p className="detailpara">Total P&L</p>
        <h6 className={`detailhead ${isPnlPositive ? "green" : "red"}`}>
          {isPnlPositive ? "+" : ""}${totalPnL.toFixed(2)}
        </h6>
      </div>
    </div>
  );
};

export default StatsBar;
