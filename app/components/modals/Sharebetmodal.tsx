"use client";
import React from "react";
import { Modal } from "react-bootstrap";
import Icon from "../Icon";

interface SharebetmodalProps {
  show: boolean;
  onHide: () => void;
}

const Sharebetmodal: React.FC<SharebetmodalProps> = ({ show, onHide }) => {
  return (
    <Modal
      className="profilemodal"
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Share Your Bet</Modal.Title>
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
                <div className="right">
                  <div className="maintimer">
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
                    <h4 className="timerpara">5 min</h4>
                  </div>
                </div>
              </div>
              <div className="speedtext">
                <div className="speedleft">
                  <p className="speedpara">My Bet</p>
                  <div className="textparent">
                    <h4 className="wingreen">$100,00</h4>
                    <button className="greenbtc">Up for BTC</button>
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
              <div className="brdr"></div>
              <div className="bottomcontent">
                <div className="innermain">
                  <p>Baseline Price</p>
                  <h4>$90,300.23</h4>
                </div>
                <div className="innermain">
                  <p>Effective Amount</p>
                  <h4>$90,300.23</h4>
                </div>
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

          <button onClick={onHide} className="close">Close</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Sharebetmodal;
