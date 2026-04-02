"use client";
import React, { FC } from "react";

interface PortfolioCardProps {
  onDeposit: () => void;
  onWithdraw: () => void;
}

const PortfolioCard: FC<PortfolioCardProps> = ({ onDeposit, onWithdraw }) => {
  return (
    <div className="upperinner">
      <div className="portfoliomain">
        <p className="portfoliopara">Portfolio</p>
        <h6 className="dollarhead">$7,120.99</h6>
        <div className="tokensmain">
          <div className="tokeninner">
            <div className="tokenimg">
              <img
                src="/tokenimages/usdt.png"
                alt="innerimg"
                className="innerimg"
              />
            </div>
            <h6 className="quantityhead">3,456.78</h6>
            <p className="tokenpara">USDT</p>
          </div>
          <div className="tokeninner">
            <div className="tokenimg">
              <img
                src="/tokenimages/eth.png"
                alt="innerimg"
                className="innerimg"
              />
            </div>
            <h6 className="quantityhead">1.43556</h6>
            <p className="tokenpara">ETH</p>
          </div>
        </div>
        <div className="fundsbtns">
          <button onClick={onDeposit} className="depositbtn">
            Deposit
          </button>
          <button onClick={onWithdraw} className="withdrawbtn">
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;