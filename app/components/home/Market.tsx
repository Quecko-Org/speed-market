"use client";
import React, { FC, useEffect, useState } from "react";
import Icon from "../Icon";
import { usePositions } from "../positions/PositionsContext";
import QuickFireMarket from "./Quickfiremarket";
import PowerPlayMarket from "./Powerplaymarket";
import MasterModeMarket from "./Mastermodemarket";
import { getCoinsPrices } from "@/app/services/coinListing";
import { useAtomValue } from "jotai";
import { userSmartAccountUsdtBalance } from "@/app/store/atoms";

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

const Market: FC = () => {
  const { isOpen: isPositionsOpen, toggle } = usePositions();
  const [coinListing, setCoinListing] = useState<CoinType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const usdtBalance = useAtomValue(userSmartAccountUsdtBalance);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setIsLoading(true);
        const coinPriceResponse = await getCoinsPrices();
        setCoinListing(coinPriceResponse || []);
      } catch (error) {
        console.log("Error fetching coin prices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, []);

  return (
    <section className="speedmarket">
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

      <QuickFireMarket coinListing={coinListing} isLoading={isLoading} usdtBalance={usdtBalance} />
      <PowerPlayMarket coinListing={coinListing} isLoading={isLoading} usdtBalance={usdtBalance} />
      <MasterModeMarket coinListing={coinListing} isLoading={isLoading} usdtBalance={usdtBalance} />
    </section>
  );
};

export default Market;