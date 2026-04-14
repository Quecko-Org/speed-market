"use client";
import React, { FC } from "react";
import Icon from "../Icon";

const Profilestats: FC = () => {
  return (
    <div className="upperinner">
      <div className="profilemain">
        <div className="innerprofile">
          <div className="profileimg">
            <img
              src="/importantassets/placeholderimg.svg"
              alt="innerimg"
              className="innerimg"
            />
          </div>
          <div className="profiletexts">
            <h6 className="upperhead">Felix Hogan</h6>
            <div className="smartmain">
              <h6 className="smartpara">Smart Wallet</h6>
              <h5 className="walletpara">0x1256...5911xa</h5>
              <button className="copybtn">
                <Icon name="copy" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="statsmain">
        <div className="statsinner">
          <p className="stathead">Total bets</p>
          <h6 className="statpara">128</h6>
        </div>
        <div className="statsinner">
          <p className="stathead">Total payout</p>
          <h6 className="statpara">5.4K</h6>
        </div>
        <div className="statsinner">
          <p className="stathead">Total invested</p>
          <h6 className="statpara">4K</h6>
        </div>
        <div className="statsinner">
          <p className="stathead">Total P&L</p>
          <h6 className="statpara">+1.4K</h6>
        </div>
      </div>
    </div>
  );
};

export default Profilestats;
