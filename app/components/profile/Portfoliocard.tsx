"use client";
import { FC } from "react";
import { useAtomValue } from "jotai";
import { userSmartAccountUsdtBalance } from "@/app/store/atoms";
import { formatNumberWithCommas } from "@/app/utils/helpers";

interface PortfolioCardProps {
  onDeposit: () => void;
  onWithdraw: () => void;
}



const PortfolioCard: FC<PortfolioCardProps> = ({ onDeposit, onWithdraw }) => {

  const usdtBalance = useAtomValue(userSmartAccountUsdtBalance);

  return (
    <div className="upperinner">
      <div className="portfoliomain">
        <p className="portfoliopara">Portfolio</p>
        <h6 className="dollarhead">${formatNumberWithCommas(usdtBalance)}</h6>
        <div className="tokensmain">
          <div className="tokeninner">
            <div className="tokenimg">
              <img
                src="/tokenimages/usdt.png"
                alt="innerimg"
                className="innerimg"
              />
            </div>
            <h6 className="quantityhead">
              {formatNumberWithCommas(usdtBalance)}
            </h6>
            <p className="tokenpara">USDT</p>
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
