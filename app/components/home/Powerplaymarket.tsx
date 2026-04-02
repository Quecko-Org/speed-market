"use client";
import React, { FC, useRef, useState } from "react";
import Icon from "../Icon";
import ProgressSlider from "./ProgressSlider";
import ConfettiCanvas, { ConfettiHandle } from "./ConfettiCanvas";
import Link from "next/link";
import { formatNumberWithCommas } from "@/app/utils/helpers";

interface CoinType {
  _id: string;
  coinId: string;
  name: string;
  slug: string;
  symbol: string;
  type: string;
  currentPrice: string;
  change24hr: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PowerPlayMarketProps {
  coinListing: CoinType[];
  isLoading: boolean;
  usdtBalance: number;
}

interface ActiveTrade {
  cardIndex: number;
  direction: "UP" | "DOWN";
}

const POWER_PLAY = {
  title: "Power Play",
  duration: "10 min",
  icon: "timer",
  description: "Extended trading — More time to analyze",
};

const FALLBACK_CARDS = [
  { pair: "ETH/USDT", price: "$0.00", baseToken: "eth", quoteToken: "usdt", balance: "500 USDT", balanceToken: "usdt", potentialWin: "$0.00", isLive: true },
  { pair: "BTC/USDT", price: "$0.00", baseToken: "btc", quoteToken: "usdt", balance: "500 USDT", balanceToken: "usdt", potentialWin: "$0.00", isLive: true },
  { pair: "SOL/USDT", price: "$0.00", baseToken: "sol", quoteToken: "usdt", balance: "500 USDT", balanceToken: "usdt", potentialWin: "$0.00", isLive: true },
];

const buildCards = (coinListing: CoinType[]) => {
  if (!coinListing.length) return FALLBACK_CARDS;
  return coinListing.map((coin) => ({
    pair: `${coin.symbol}/USDT`,
    price: `$${Number(coin.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
    baseToken: coin.slug,
    quoteToken: "usdt",
    balance: "500 USDT",
    balanceToken: "usdt",
    potentialWin: "$0.00",
    isLive: coin.isActive,
  }));
};

const PowerPlayMarket: FC<PowerPlayMarketProps> = ({ coinListing, isLoading, usdtBalance }) => {
  const confettiRef = useRef<ConfettiHandle>(null);
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    confettiRef.current?.launch(e.currentTarget);
  }

  const handleDirectionClick = (cardIndex: number, direction: "UP" | "DOWN") => {
    if (activeTrade?.cardIndex === cardIndex && activeTrade?.direction === direction) {
      setActiveTrade(null);
    } else {
      setActiveTrade({ cardIndex, direction });
    }
  };

  const handleClose = () => setActiveTrade(null);

  const isTradeOpen = (cardIndex: number) => activeTrade?.cardIndex === cardIndex;

  const getDirection = (cardIndex: number): "UP" | "DOWN" | null =>
    isTradeOpen(cardIndex) ? activeTrade!.direction : null;

  return (
    <div className="innermarket">
      <ConfettiCanvas ref={confettiRef} />

      <h2 className="innerhead">
        {POWER_PLAY.title}
        <span className="innerspan">
          <Icon name={POWER_PLAY.icon} className="timer" />
          {POWER_PLAY.duration}
        </span>
      </h2>
      <p className="innerpara">{POWER_PLAY.description}</p>

      <div className="mainmarketcards">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="marketcard skeleton-card">
              <div className="skeleton-shimmer" />
            </div>
          ))
        ) : !coinListing.length ? (
          <div className="no-data-found">
            <p>No data found</p>
          </div>
        ) : null}
        {!isLoading && coinListing.length > 0 && buildCards(coinListing).map((card, cardIndex) => {
          const tradeOpen = isTradeOpen(cardIndex);
          const direction = getDirection(cardIndex);

          return (
            <Link
              key={cardIndex}
              className={`marketcard${tradeOpen ? " card--trade-open" : ""}`}
              href="/exploredetail"
              draggable={false}
            >
              {card.isLive && (
                <div className="cardlive">
                  <span className="livecircle"></span>
                  <p className="livepara">LIVE</p>
                </div>
              )}

              <div className="tokenimages">
                <div className="innertoken">
                  <img src={`/tokenimages/${card.baseToken}.png`} alt={card.baseToken} className="tokenimg" />
                </div>
                <Icon name="energy" className="energy" />
                <div className="innertoken">
                  <img src={`/tokenimages/${card.quoteToken}.png`} alt={card.quoteToken} className="tokenimg" />
                </div>
              </div>

              <h4 className="tokenname">{card.pair}</h4>
              <h3 className="tokenprice">{card.price}</h3>

              <div className="cardbtns">
                <button
                  className={`upbtn${direction === "UP" ? " btn--active" : ""}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDirectionClick(cardIndex, "UP"); }}
                >
                  <span className="innerbtn"><Icon name="up" className="up" /></span>
                  UP
                </button>
                <button
                  className={`downbtn${direction === "DOWN" ? " btn--active" : ""}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDirectionClick(cardIndex, "DOWN"); }}
                >
                  <span className="innerbtn"><Icon name="down" className="down" /></span>
                  DOWN
                </button>
              </div>

              {tradeOpen && (
                <div
                  className={`maintrade maintrade--${direction?.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <div className="tradetop">
                    <div className="maintoken">
                      <div className="tokenimg">
                        <img src={`/tokenimages/${card.baseToken}.png`} alt={card.baseToken} className="innerimg" />
                      </div>
                      <h5 className="tokenpara">{card.pair}</h5>
                    </div>
                    <button className="closebtn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClose(); }}>
                      <Icon name="close" />
                    </button>
                  </div>

                  <div className="inputupper">
                    <p className="amountpara">Amount (USDT)</p>
                    <div className="mainbalance">
                      <p className="balancepara">Balance:</p>
                      <div className="tokenimg">
                        <img src={`/tokenimages/${card.balanceToken}.png`} alt={card.balanceToken} className="innerimg" />
                      </div>
                      <p className="innerbalance">{formatNumberWithCommas(usdtBalance)}</p>
                    </div>
                  </div>

                  <div className="maininput">
                    <input type="text" className="innerinput" placeholder="Amount" />
                    <button className="maxbtn">MAX</button>
                  </div>

                  <ProgressSlider />

                  <button
                    className={`tradebtn ${direction === "UP" ? "upbtn" : "downbtn"}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClick(e); }}
                  >
                    {direction}
                    <span className="winpara">
                      Potential Win <span className="bold">{card.potentialWin}</span>
                    </span>
                  </button>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PowerPlayMarket;