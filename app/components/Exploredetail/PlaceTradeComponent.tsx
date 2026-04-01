import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Icon from "../Icon";

interface TradeFormProps {
  direction: "UP" | "DOWN";
  setDirection: (dir: "UP" | "DOWN") => void;
  amount: number;
  setAmount: (val: number) => void;
  maxPosition: number;
  balance: number;
  quickValues: number[];
  feeValue: number;
  effectiveAmount: number;
  potentialWin: number;
  onPlacePrediction: () => void;
}

const TradeForm: React.FC<TradeFormProps> = ({
  direction,
  setDirection,
  amount,
  setAmount,
  maxPosition,
  balance,
  quickValues,
  feeValue,
  effectiveAmount,
  potentialWin,
  onPlacePrediction,
}) => {
  const pct = ((amount - 5) / 495) * 100;
  return (
    <>
      <div className="for-detail-component">
        <div className="toggle-container">
          <button
            className={`predict-btn ${direction === "UP" ? "up" : ""}`}
            onClick={() => setDirection("UP")}
          >
            <span className="upimg"><Icon name="up" /></span> UP
          </button>
          <button
            className={`predict-btn ${direction === "DOWN" ? "down" : ""}`}
            onClick={() => setDirection("DOWN")}
          >
           
            <span className="downimg"> <Icon name="down"  /></span>
            DOWN
          </button>
        </div>

        <div className="balance-row">
          <span>
            Max Position: <b>${maxPosition}</b>
          </span>
          <span>
            Balance:
            <span className="token-icons mx-2">
              <img src="/usdt.svg" alt="usdt" className="main-img" />
              <img src="/arbitrum.svg" alt="chain" className="chain-img" />
            </span>
            <b>{balance} USDT</b>
          </span>
        </div>

        <div className="slider-box">
          <input
            className="custom-range"
            type="range"
            min={5}
            max={500}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right,#f97316 ${pct}%,#1F2233 ${pct}%)`,
            }}
          />
          <div className="amount-display">${amount}</div>
        </div>

        <div className="quick-amounts">
          {quickValues.map((val) => (
            <button key={val} onClick={() => setAmount(val)}>
              ${val}
            </button>
          ))}
          <button onClick={() => setAmount(500)}>MAX</button>
        </div>

        <div className="stats-card">
          <div className="stat-line">
            <span>Fee (5%)</span>
            <span>${feeValue.toFixed(2)}</span>
          </div>
          <div className="stat-line">
            <span>Effective Amount</span>
            <span>${effectiveAmount.toFixed(2)}</span>
          </div>
          <div className="stat-line win">
            <span>Potential Win</span>
            <span className="green">${potentialWin.toFixed(2)}</span>
          </div>
        </div>

        <Button className="place-btn" onClick={onPlacePrediction}>
          PLACE PREDICTION
        </Button>
      </div>
    </>
  );
};

export default TradeForm;
