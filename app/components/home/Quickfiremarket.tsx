"use client";
import React, { FC, useRef, useState } from "react";
import Icon from "../Icon";
import ProgressSlider from "./ProgressSlider";
import ConfettiCanvas, { ConfettiHandle } from "./ConfettiCanvas";
import Link from "next/link";
import { formatNumberWithCommas } from "@/app/utils/helpers";
import type { CoinType, HandleCreateTrade, MarketDuration } from "./Market";

interface QuickFireMarketProps {
  coinListing: CoinType[];
  isLoading: boolean;
  usdtBalance: number;
  onCreateTrade: HandleCreateTrade;
  isTradeLoading: boolean;
}

interface ActiveTrade {
  cardIndex: number;
  direction: "UP" | "DOWN";
}

const DURATION: MarketDuration = "5 min";

const QUICK_FIRE = {
  title: "Quick Fire",
  duration: DURATION,
  icon: "timer",
  description: "Popular choice — Balance speed and strategy",
};

const FALLBACK_CARDS = [
  { pair: "ETH/USDT", price: "$0.00", imageurl: "/tokenimages/eth.png", baseToken: "eth", quoteToken: "usdt", balance: "500 USDT", balanceToken: "usdt", potentialWin: "$0.00", isLive: true, symbol: "ETH" },
  { pair: "BTC/USDT", price: "$0.00", imageurl: "/tokenimages/btc.png", baseToken: "btc", quoteToken: "usdt", balance: "500 USDT", balanceToken: "usdt", potentialWin: "$0.00", isLive: true, symbol: "BTC" },
  { pair: "SOL/USDT", price: "$0.00", imageurl: "/tokenimages/sol.png", baseToken: "sol", quoteToken: "usdt", balance: "500 USDT", balanceToken: "usdt", potentialWin: "$0.00", isLive: true, symbol: "SOL" },
];

const buildCards = (coinListing: CoinType[]) => {
  if (!coinListing.length) return FALLBACK_CARDS;
  return coinListing.map((coin) => ({
    pair: `${coin.symbol}/USDT`,
    price: `$${Number(coin.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
    baseToken: coin.slug,
    quoteToken: "usdt",
    imageurl: coin.imageurl,
    balanceToken: "usdt",
    potentialWin: "$0.00",
    isLive: coin.isActive,
    symbol: coin.symbol,
  }));
};

const QuickFireMarket: FC<QuickFireMarketProps> = ({
  coinListing,
  isLoading,
  usdtBalance,
  onCreateTrade,
  isTradeLoading,
}) => {
  const confettiRef = useRef<ConfettiHandle>(null);
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null);
  const [tradeAmounts, setTradeAmounts] = useState<Record<number, string>>({});

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

  const handleAmountChange = (cardIndex: number, value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTradeAmounts((prev) => ({ ...prev, [cardIndex]: value }));
    }
  };

  const maxPosition = usdtBalance >= 100 ? 100 : usdtBalance;

  const handleSliderChange = (cardIndex: number, percent: number) => {
    if (maxPosition <= 0) return;
    const amount = Math.max(5, (percent / 100) * maxPosition);
    const rounded = Math.floor(amount * 100) / 100;
    setTradeAmounts((prev) => ({ ...prev, [cardIndex]: rounded > 0 ? String(rounded) : "" }));
  };

  const getSliderPercent = (cardIndex: number): number => {
    const amount = Number(tradeAmounts[cardIndex] || 0);
    if (maxPosition <= 0 || amount <= 0) return 0;
    return Math.min((amount / maxPosition) * 100, 100);
  };

  const handleMaxClick = (cardIndex: number) => {
    setTradeAmounts((prev) => ({ ...prev, [cardIndex]: String(maxPosition) }));
  };

  const handleTradeSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
    asset: string,
    cardIndex: number,
    direction: "UP" | "DOWN"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const amount = tradeAmounts[cardIndex] || "";
    const success = await onCreateTrade({
      amount,
      asset,
      duration: DURATION,
      type: direction,
    });

    if (success) {
      confettiRef.current?.launch(e.currentTarget);
      setTradeAmounts((prev) => ({ ...prev, [cardIndex]: "" }));
      setActiveTrade(null);
    }
  };

  return (
    <div className="innermarket">
      <ConfettiCanvas ref={confettiRef} />

      <h2 className="innerhead">
        {QUICK_FIRE.title}
        <span className="innerspan">
          <Icon name={QUICK_FIRE.icon} className="timer" />
          {QUICK_FIRE.duration}
        </span>
      </h2>
      <p className="innerpara">{QUICK_FIRE.description}</p>

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
          const currentAmount = tradeAmounts[cardIndex] || "";
          const potentialWin = currentAmount && !isNaN(Number(currentAmount))
            ? `$${(Number(currentAmount) * 1.92).toFixed(2)}`
            : card.potentialWin;

          return (
            <Link
              key={cardIndex}
              className={`marketcard${tradeOpen ? " card--trade-open" : ""}`}
              href={`/exploredetail?symbol=${card.symbol}&duration=${encodeURIComponent(DURATION)}`}
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
                  <img src={card.imageurl} alt={card.baseToken} className="tokenimg" />
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
                  disabled={isTradeLoading}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDirectionClick(cardIndex, "UP"); }}
                >
                  <span className="innerbtn"><Icon name="up" className="up" /></span>
                  UP
                </button>
                <button
                  className={`downbtn${direction === "DOWN" ? " btn--active" : ""}`}
                  disabled={isTradeLoading}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDirectionClick(cardIndex, "DOWN"); }}
                >
                  <span className="innerbtn"><Icon name="down" className="down" /></span>
                  DOWN
                </button>
              </div>

              {tradeOpen && direction && (
                <div
                  className={`maintrade maintrade--${direction.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <div className="tradetop">
                    <div className="maintoken">
                      <div className="tokenimg">
                        <img src={card.imageurl} alt={card.baseToken} className="innerimg" />
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
                    <input
                      type="text"
                      className="innerinput"
                      placeholder="Amount"
                      value={currentAmount}
                      onChange={(e) => handleAmountChange(cardIndex, e.target.value)}
                      disabled={isTradeLoading}
                    />
                    <button
                      className="maxbtn"
                      onClick={() => handleMaxClick(cardIndex)}
                      disabled={isTradeLoading}
                    >
                      MAX
                    </button>
                  </div>

                  <ProgressSlider
                    value={getSliderPercent(cardIndex)}
                    onChange={(p) => handleSliderChange(cardIndex, p)}
                  />

                  <button
                    className={`tradebtn ${direction === "UP" ? "upbtn" : "downbtn"}`}
                    disabled={isTradeLoading}
                    onClick={(e) => handleTradeSubmit(e, card.symbol, cardIndex, direction)}
                  >
                    {isTradeLoading ? "Processing..." : direction}
                    <span className="winpara">
                      Potential Win <span className="bold">{potentialWin}</span>
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

export default QuickFireMarket;
