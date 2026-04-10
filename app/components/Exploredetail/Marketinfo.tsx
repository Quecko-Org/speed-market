import React, { FC } from "react";

interface MarketinfoProps {
  coinDetail: any;
}

const Marketinfo: FC<MarketinfoProps> = ({ coinDetail }) => {
  const symbol = coinDetail?.symbol ?? "—";
  const name = coinDetail?.name ?? "—";
  const currentPrice = coinDetail?.currentPrice
    ? `$${Number(coinDetail.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "—";
  const change24hr = coinDetail?.change24hr
    ? `${Number(coinDetail.change24hr).toFixed(2)}%`
    : "—";
  const isPositive = coinDetail?.change24hr ? Number(coinDetail.change24hr) >= 0 : true;

  return (
    <>
 <div className="marketinfo">
            <h6 className="marketinnerhead">Market Info</h6>
            <p className="marketlowerhead">{name} ({symbol})</p>
            <div className="marketinnerpara">
              <div className="stat-line">
                <span>Current Price</span>
                <span>{currentPrice}</span>
              </div>
              <div className="stat-line">
                <span>24h Change</span>
                <span style={{ color: isPositive ? "#22c55e" : "#ef4444" }}>{change24hr}</span>
              </div>
              <div className="stat-line">
                <span>Status</span>
                <span>{coinDetail?.isActive ? "Active" : "—"}</span>
              </div>
            </div>
          </div>
    </>
  );
};

export default Marketinfo;
