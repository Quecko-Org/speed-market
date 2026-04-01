"use client";
import React, { FC, useRef, useState } from "react";
import Icon from "../Icon";
import ProgressSlider from "./ProgressSlider";
import { usePositions } from "../positions/PositionsContext";
import ConfettiCanvas, { ConfettiHandle } from "./ConfettiCanvas";
import Link from "next/link";

interface ActiveTrade {
  marketIndex: number;
  cardIndex: number;
  direction: "UP" | "DOWN";
}

const MARKETS = [
  {
    title: "Quick Fire",
    duration: "5 min",
    icon: "timer",
    description: "Popular choice — Balance speed and strategy",
    cards: [
      {
        pair: "ETH/USDT",
        price: "$3,198.89",
        baseToken: "eth",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$10.20",
        isLive: true,
      },
      {
        pair: "BTC/USDT",
        price: "$67,432.10",
        baseToken: "btc",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$18.50",
        isLive: false,
      },
      {
        pair: "SOL/USDT",
        price: "$182.44",
        baseToken: "sol",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$9.80",
        isLive: true,
      },
      {
        pair: "EUR/USDT",
        price: "$594.20",
        baseToken: "euro",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$12.40",
        isLive: false,
      },
    ],
  },
  {
    title: "Power Play",
    duration: "10 min",
    icon: "timer",
    description: "Extended trading — More time to analyze",
    cards: [
      {
        pair: "SOL/USDT",
        price: "$182.44",
        baseToken: "sol",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$9.80",
        isLive: true,
      },
      {
        pair: "ETH/USDT",
        price: "$3,198.89",
        baseToken: "eth",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$10.20",
        isLive: true,
      },
      {
        pair: "BTC/USDT",
        price: "$67,432.10",
        baseToken: "btc",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$18.50",
        isLive: false,
      },
      {
        pair: "EUR/USDT",
        price: "$594.20",
        baseToken: "euro",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$12.40",
        isLive: false,
      },
    ],
  },
  {
    title: "Master Mode",
    duration: "15 min",
    icon: "timer",
    description: "Maximum duration — For the pros",
    cards: [
      {
        pair: "SOL/USDT",
        price: "$182.44",
        baseToken: "sol",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$9.80",
        isLive: true,
      },
      {
        pair: "EUR/USDT",
        price: "$594.20",
        baseToken: "euro",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$12.40",
        isLive: false,
      },
      {
        pair: "ETH/USDT",
        price: "$3,198.89",
        baseToken: "eth",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$10.20",
        isLive: true,
      },
      {
        pair: "BTC/USDT",
        price: "$67,432.10",
        baseToken: "btc",
        quoteToken: "usdt",
        balance: "500 USDT",
        balanceToken: "usdt",
        potentialWin: "$18.50",
        isLive: false,
      },
    ],
  },
];

const Market: FC = () => {
  const confettiRef = useRef<ConfettiHandle>(null);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    confettiRef.current?.launch(e.currentTarget);
  }
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null);
  const { isOpen: isPositionsOpen, toggle } = usePositions();

  const handleDirectionClick = (
    marketIndex: number,
    cardIndex: number,
    direction: "UP" | "DOWN",
  ) => {
    if (
      activeTrade?.marketIndex === marketIndex &&
      activeTrade?.cardIndex === cardIndex &&
      activeTrade?.direction === direction
    ) {
      setActiveTrade(null);
    } else {
      setActiveTrade({ marketIndex, cardIndex, direction });
    }
  };

  const handleClose = () => setActiveTrade(null);

  const isTradeOpen = (marketIndex: number, cardIndex: number) =>
    activeTrade?.marketIndex === marketIndex &&
    activeTrade?.cardIndex === cardIndex;

  const getDirection = (
    marketIndex: number,
    cardIndex: number,
  ): "UP" | "DOWN" | null =>
    isTradeOpen(marketIndex, cardIndex) ? activeTrade!.direction : null;

  return (
    <section className="speedmarket">
      <ConfettiCanvas ref={confettiRef} />
      <button
        className="openbtn"
        onClick={toggle}
        style={{ right: isPositionsOpen ? "339px" : "0" }}
      >
        <span className="mainnumber">13</span>
        <p className="openpara">Open Positions</p>
        <Icon name="openarrow" className={isPositionsOpen ? "rotate" : ""} />
      </button>

      <h1 className="markethead">Speed Markets</h1>
      <p className="marketpara">
        Make fast predictions on price movements. Win 2x your stake in minutes!
      </p>

      {MARKETS.map((market, marketIndex) => (
        <div key={marketIndex} className="innermarket">
          <h2 className="innerhead">
            {market.title}
            <span className="innerspan">
              <Icon name={market.icon} className="timer" />
              {market.duration}
            </span>
          </h2>
          <p className="innerpara">{market.description}</p>

          <div className="mainmarketcards">
            {market.cards.map((card, cardIndex) => {
              const tradeOpen = isTradeOpen(marketIndex, cardIndex);
              const direction = getDirection(marketIndex, cardIndex);

              return (
                <Link
                  key={cardIndex}
                  className={`marketcard${tradeOpen ? " card--trade-open" : ""}`}
                  href={"/exploredetail"}
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
                      <img
                        src={`/tokenimages/${card.baseToken}.png`}
                        alt={card.baseToken}
                        className="tokenimg"
                      />
                    </div>
                    <Icon name="energy" className="energy" />
                    <div className="innertoken">
                      <img
                        src={`/tokenimages/${card.quoteToken}.png`}
                        alt={card.quoteToken}
                        className="tokenimg"
                      />
                    </div>
                  </div>

                  <h4 className="tokenname">{card.pair}</h4>
                  <h3 className="tokenprice">{card.price}</h3>

                  <div className="cardbtns">
                    <button
                      className={`upbtn${direction === "UP" ? " btn--active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDirectionClick(marketIndex, cardIndex, "UP");
                      }}
                    >
                      <span className="innerbtn">
                        <Icon name="up" className="up" />
                      </span>
                      UP
                    </button>
                    <button
                      className={`downbtn${direction === "DOWN" ? " btn--active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDirectionClick(marketIndex, cardIndex, "DOWN");
                      }}
                    >
                      <span className="innerbtn">
                        <Icon name="down" className="down" />
                      </span>
                      DOWN
                    </button>
                  </div>

                  {tradeOpen && (
                    <div
                      className={`maintrade maintrade--${direction?.toLowerCase()}`}
                       onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    onMouseDown={(e) => e.stopPropagation()}
    onTouchStart={(e) => e.stopPropagation()}
                    >
                      <div className="tradetop">
                        <div className="maintoken">
                          <div className="tokenimg">
                            <img
                              src={`/tokenimages/${card.baseToken}.png`}
                              alt={card.baseToken}
                              className="innerimg"
                            />
                          </div>
                          <h5 className="tokenpara">{card.pair}</h5>
                        </div>
                        <button
                          className="closebtn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClose();
                          }}
                        >
                          <Icon name="close" />
                        </button>
                      </div>

                      <div className="inputupper">
                        <p className="amountpara">Amount (USDT)</p>
                        <div className="mainbalance">
                          <p className="balancepara">Balance:</p>
                          <div className="tokenimg">
                            <img
                              src={`/tokenimages/${card.balanceToken}.png`}
                              alt={card.balanceToken}
                              className="innerimg"
                            />
                          </div>
                          <p className="innerbalance">{card.balance}</p>
                        </div>
                      </div>

                      <div className="maininput">
                        <input
                          type="text"
                          className="innerinput"
                          placeholder="Amount"
                        />
                        <button className="maxbtn">MAX</button>
                      </div>

                      <ProgressSlider />

                      <button
                        className={`tradebtn ${direction === "UP" ? "upbtn" : "downbtn"}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleClick(e);
                        }}
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
      ))}
    </section>
  );
};

export default Market;
