"use client";
import React, { useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import Icon from "../Icon";

interface DepositmodalProps {
  show: boolean;
  onHide: () => void;
}

type OptionType = {
  name: string;
  img: string | null;
};

const Depositmodal: React.FC<DepositmodalProps> = ({ show, onHide }) => {
  const tokens: OptionType[] = [
    { name: "RAIN", img: "/tokenimages/rain.png" },
    { name: "USDT", img: "/tokenimages/usdt.png" },
    { name: "USDC", img: "/tokenimages/usdc.png" },
    { name: "ETH", img: "/tokenimages/eth.png" },
    { name: "BTC", img: "/tokenimages/btc.png" },
  ];

  const chains: OptionType[] = [
    { name: "Arbitrum", img: "/tokenimages/arbitrum.svg" },
    { name: "Base", img: "/tokenimages/base.svg" },
    { name: "Ethereum", img: "/tokenimages/eth.png" },
    { name: "Bitcoin", img: "/tokenimages/btc.png" },
  ];

  const [selectedToken, setSelectedToken] = useState<OptionType>({
    name: "Select Token",
    img: null,
  });

  const [selectedChain, setSelectedChain] = useState<OptionType>({
    name: "Select Chain",
    img: null,
  });

  return (
    <Modal className="deposit" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span onClick={onHide} className="cursorpointer">
            <Icon name="backarrow" />
          </span>
          Via deposit address
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="depositcontent">
          <div className="firstbox">
            <div className="left">
              <p>Choose the asset you wish to swap to</p>
            </div>
            <div className="right">
              <div className="maintoken">
                <img
                  src="/tokenimages/usdt.png"
                  alt="tokenimg"
                  className="tokenimg"
                />
                <img
                  src="/tokenimages/arbitrum.svg"
                  alt="chainimg"
                  className="chainimg"
                />
              </div>
              <p className="usdtpara">
                <span>USDT</span> (Arbitrum)
              </p>
            </div>
          </div>

          <div className="parentdropdowns">
            <div className="maindrop">
              <p className="heading">Token</p>
              <Dropdown>
                <Dropdown.Toggle
                  id="token-dropdown"
                  className="d-flex align-items-center gap-2"
                >
                  <div className="forstyling">
                    {selectedToken.img && (
                      <img
                        src={selectedToken.img}
                        alt="token"
                        className="raintoken"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                    {selectedToken.name}
                  </div>

                  <Icon name="droparrowbig" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {tokens.map((token, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => setSelectedToken(token)}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src={token.img || ""}
                        alt="img"
                        className="raintoken"
                        style={{ width: "22px", height: "22px" }}
                      />
                      {token.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="maindrop">
              <p className="heading">Chain</p>
              <Dropdown>
                <Dropdown.Toggle
                  id="chain-dropdown"
                  className="token-btn d-flex align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="forstyling">
                      {selectedChain.img && (
                        <img
                          src={selectedChain.img}
                          alt="chain"
                          className="raintoken"
                          style={{ width: "20px", height: "20px" }}
                        />
                      )}
                      {selectedChain.name}
                    </div>
                  </div>
                  <Icon name="droparrowbig" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {chains.map((chain, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => setSelectedChain(chain)}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src={chain.img || ""}
                        alt="img"
                        className="raintoken"
                        style={{ width: "22px", height: "22px" }}
                      />
                      {chain.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* <div className="finalblancebox">
            <div className="parentboxmain">
              <div className="left">
                <h5 className="blance">Final balance:</h5>
              </div>
              <div className="right">
                <img
                  src="/tokenimages/usdt.png"
                  alt="img"
                  className="img-fluid imag"
                />
                <h6>
                  USDT <span>(Arbitrum)</span>
                </h6>
              </div>
            </div>

            <div className="brdrsec"></div>

            <h6 className="endpara">
              Note: All deposits will be automatically swapped to USDT on
              Arbitrum.
            </h6>
          </div> */}

          <div className="brdr"></div>

          <div className="mainqr">
            <span className="forfilter"></span>
            <img
              src="/modalassets/qr.png"
              alt="img"
              className="img-fluid qrimg"
            />
          </div>

          <div className="qrtextbottom">
            <div className="left">
              <h6>
                Refund Wallet Address <Icon name="iicon" />
              </h6>
            </div>
            <div className="right">
              <p>Please pay attention that you provide a BTC address</p>
            </div>
          </div>

          <div className="lastinput">
            <input
              type="text"
              placeholder="Enter a valid BTC wallet address"
            />
            {/* <p className="errortext">Invalid Wallet Address</p> */}
          </div>
          <div className="innerbox">
            <div className="leftinput">
              <label htmlFor="rewardToken">Your deposit address:</label>
              <input
                type="text"
                id="rewardToken"
                placeholder="3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy"
              />
            </div>
            <button className="copy">
              <Icon name="copywhite" />
              COPY
            </button>
          </div>

          <button className="address">Generate Address</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Depositmodal;