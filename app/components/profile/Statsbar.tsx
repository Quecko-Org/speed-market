"use client";
import React, { FC } from "react";

const StatsBar: FC = () => {
  return (
    <div className="middetails">
      <div className="innerdetail">
        <p className="detailpara">Open Interest</p>
        <h6 className="detailhead">$16.23K</h6>
      </div>
      <div className="innerdetail">
        <p className="detailpara">Live Markets</p>
        <h6 className="detailhead">125</h6>
      </div>
      <div className="innerdetail">
        <p className="detailpara">Total Invested</p>
        <h6 className="detailhead">$36.23K</h6>
      </div>
      <div className="innerdetail">
        <p className="detailpara">Average PnL</p>
        <h6 className="detailhead green">+$2,059</h6>
      </div>
    </div>
  );
};

export default StatsBar;