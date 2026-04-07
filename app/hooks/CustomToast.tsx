"use client";

import React from "react";
import Icon from "../components/Icon";

interface Props {
  type:
    | "positionOpenedup"
    | "positionOpeneddown"
    | "roundWon"
    | "roundLost"
    | "profileupdated";
  asset?: string;
  amount?: string;
  duration?: string;
}

const CustomToast: React.FC<Props> = ({ type, asset = "BTC/USDT", amount = "0", duration = "5 min" }) => {
  return (
    <>
      {type === "positionOpenedup" && (
        <div className={`toast-${type}`}>
          <div className="lefttoast">
            <span className="upimg">
              <Icon name="up" />
            </span>
            <div className="toasttexts">
              <h6 className="positionhead">
                Position Opened: {asset} - {duration}
              </h6>
              <p className="positionpara">
                Position amount <span className="white">${amount}</span>
              </p>
            </div>
          </div>
        </div>
      )}
      {type === "positionOpeneddown" && (
        <div className={`toast-${type}`}>
          <div className="lefttoast">
            <span className="downimg">
              <Icon name="down" />
            </span>
            <div className="toasttexts">
              <h6 className="positionhead">
                Position Opened: {asset} - {duration}
              </h6>
              <p className="positionpara">
                Position amount <span className="white">${amount}</span>
              </p>
            </div>
          </div>
        </div>
      )}
      {type === "roundLost" && (
        <div className={`toast-${type}`}>
          <div className="lefttoast">
            <span className="lostimg">
              <Icon name="lost" />
            </span>
            <div className="toasttexts">
              <h6 className="positionhead">Round lost: BTC/USDT - 5 min</h6>
            </div>
          </div>
        </div>
      )}
      {type === "roundWon" && (
        <div className={`toast-${type}`}>
          <div className="lefttoast">
            <span className="wonimg">
              <Icon name="won" />
            </span>
            <div className="toasttexts">
              <h6 className="positionhead">Round Won: BTC/USDT - 5 min </h6>
            </div>
          </div>
        </div>
      )}
      {type === "profileupdated" && (
        <div className={`toast-${type}`}>
          <div className="lefttoast">
            <span className="tickimg">
              <Icon name="tick" />
            </span>
            <div className="toasttexts">
              <h6 className="positionhead">
                Your profile has been updated successfully.
              </h6>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomToast;
