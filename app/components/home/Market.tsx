"use client";
import React, { FC } from "react";
import Icon from "../Icon";
import { usePositions } from "../positions/PositionsContext";
import QuickFireMarket from "./Quickfiremarket";
import PowerPlayMarket from "./Powerplaymarket";
import MasterModeMarket from "./Mastermodemarket";

const Market: FC = () => {
  const { isOpen: isPositionsOpen, toggle } = usePositions();

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

      <QuickFireMarket />
      <PowerPlayMarket />
      <MasterModeMarket />
    </section>
  );
};

export default Market;