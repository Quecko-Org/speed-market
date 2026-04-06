import React, { FC } from "react";
import Icon from "../Icon";

interface TokenProps {
  coinDetail: any;
  duration: string | null;
  loading: boolean;
}

const Token: FC<TokenProps> = ({ coinDetail, duration, loading }) => {
  const symbol = coinDetail?.symbol ?? "BTC";
  const slug = coinDetail?.slug ?? "btc";
  const currentPrice = coinDetail?.currentPrice
    ? `$${Number(coinDetail.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "$0.00";
  const imageUrl = coinDetail?.imageurl ?? `/tokenimages/${slug}.png`;

  return (
    <>
      <div className="maintoken">
              <div className="innertoken">
                <div className="tokenimg">
                  {loading ? (
                    <div className="skeleton-shimmer" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                  ) : (
                    <img
                      src={imageUrl}
                      alt={slug}
                      className="innerimg"
                    />
                  )}
                </div>
                <div className="tokentexts">
                  <h6 className="tokenhead">
                    {loading ? "Loading..." : `${symbol}/USDT`}
                    <span className="maintimer">
                      <Icon name="timer" />{duration ?? "5 min"}
                    </span>
                  </h6>
                  <p className="tokenpara">{loading ? "—" : currentPrice}</p>
                </div>
              </div>
            </div>
    </>
  );
};

export default Token;
