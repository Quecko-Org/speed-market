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
}

const CustomToast: React.FC<Props> = ({ type }) => {
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
                Position Opened: BTC/USDT - 5 min{" "}
              </h6>
              <p className="positionpara">
                Position amount <span className="white">$10</span>
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
                Position Opened: BTC/USDT - 5 min{" "}
              </h6>
              <p className="positionpara">
                Position amount <span className="white">$10</span>
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
