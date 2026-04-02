import React, { FC } from "react";
import Icon from "../Icon";

const Token: FC = () => {
  return (
    <>
      <div className="maintoken">
              <div className="innertoken">
                <div className="tokenimg">
                  <img
                    src="/tokenimages/btc.png"
                    alt="innerimg"
                    className="innerimg"
                  />
                </div>
                <div className="tokentexts">
                  <h6 className="tokenhead">
                    BTC/USDT
                    <span className="maintimer">
                      <Icon name="timer" />5 min
                    </span>
                  </h6>
                  <p className="tokenpara">$90,298.5</p>
                </div>
              </div>
            </div>
    </>
  );
};

export default Token;
