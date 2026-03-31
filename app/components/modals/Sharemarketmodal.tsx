"use client";
import React, { useRef, useState } from "react";
import { Modal, ProgressBar } from "react-bootstrap";
import Icon from "../Icon";

interface SharemarketmodalProps {
  show: boolean;
  onHide: () => void;
}

const Sharemarketmodal: React.FC<SharemarketmodalProps> = ({
  show,
  onHide,
}) => {
  return (
    <Modal className="profilemodal" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Share This Market</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="claimedsucess">
          <div className="box">
              <img
              src="/modalassets/modalbg.png"
              alt="img"
              className="img-fluid image"
            />
            <div className="maintextmodal">
              <div className="parentupper">
                <div className="left">
                  <span>
                        <img
                      src="/importantassets/dummyrain.png"
                      alt="img"
                      className="img-fluid images"
                    />
                    SatoshiSeeker
                  </span>
                </div>
              </div>

              <div className="speedtext">
                <div className="speedleft">
                  <div className="usdparent">
 <div className="tokenimages">
                      <div className="innertoken">
                        <img
                          src="/tokenimages/btc.png"
                          alt="tokenimg"
                          className="tokenimg"
                        />
                      </div>
                      <Icon name="energy" className="energyimg" />

                      <div className="innertoken">
                        <img
                          src="/tokenimages/usdt.png"
                          alt="tokenimg"
                          className="tokenimg"
                        />
                      </div>
                    </div>

                    <div className="btctextmain">
                      <h3>BTC/USDT</h3>

                      <button>
                       <Icon name="timer"/>
                        5 min
                      </button>
                    </div>
                  </div>
                </div>

                <div className="speedright">
                  <div className="mainimg">
                 <img
                      src="/logo.svg"
                      alt="img"
                      className="img-fluid market"
                    />
                  </div>
                </div>
              </div>

              <div className="textbox">
                <p>
                  Want to try your luck? Bet on BTC/USD for a chance to win big in 5 minutes!
                </p>
              </div>
            </div>
          </div>

          <div className="sharebox">
            <p>Share with Friends</p>

             <div className="icons">
              <span>
                <Icon name="x" />
              </span>

              <span>
                <Icon name="facebook" />
              </span>

              <span>
                <Icon name="telegram" />
              </span>

              <span>
                <Icon name="whatsapp" />
              </span>

              <span>
                <Icon name="mail" />
              </span>

              <span>
                <Icon name="link" />
              </span>
            </div>
          </div>
          <button className="close">Close</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Sharemarketmodal;
