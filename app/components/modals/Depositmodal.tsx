"use client";
import React, { useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import QRCode from "react-qr-code";
import Icon from "../Icon";
import { useAtomValue } from "jotai";
import { userSmartAccount } from "@/app/store/atoms";
import {
  DEPOSIT_TOKENS,
  DEPOSIT_CHAINS,
  DEFAULT_TOKEN,
  DEFAULT_CHAIN,
  TOKEN_USDT,
  CHAIN_ARBITRUM,
} from "@/app/config/deposit";
import { getFormattedAddress } from "@/app/utils/helpers";

interface DepositmodalProps {
  show: boolean;
  onHide: () => void;
}

const Depositmodal: React.FC<DepositmodalProps> = ({ show, onHide }) => {
  const smartAccount = useAtomValue(userSmartAccount);

  const [selectedToken, setSelectedToken] = useState<string>(TOKEN_USDT);
  const [selectedChain, setSelectedChain] = useState<string>(CHAIN_ARBITRUM);
  const [isCopied, setIsCopied] = useState(false);

  // The deposit address is always the smart account (USDT on Arbitrum = direct deposit)
  const depositAddress = smartAccount || "";

  const tokenDisplay = DEPOSIT_TOKENS.find((t) => t.key === selectedToken);
  const chainDisplay = DEPOSIT_CHAINS.find((c) => c.key === selectedChain);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const resetState = () => {
    setSelectedToken(TOKEN_USDT);
    setSelectedChain(CHAIN_ARBITRUM);
    setIsCopied(false);
  };

  const handleClose = () => {
    resetState();
    onHide();
  };

  // Show deposit area once both token and chain are selected
  const showDepositArea =
    selectedToken !== DEFAULT_TOKEN &&
    selectedChain !== DEFAULT_CHAIN &&
    !!depositAddress;

  return (
    <Modal className="deposit" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span onClick={handleClose} className="cursorpointer">
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
            {/* Token Dropdown */}
            <div className="maindrop">
              <p className="heading">Token</p>
              <Dropdown>
                <Dropdown.Toggle
                  id="token-dropdown"
                  className="d-flex align-items-center gap-2"
                >
                  <div className="forstyling">
                    {tokenDisplay?.img && (
                      <img
                        src={tokenDisplay.img}
                        alt="token"
                        className="raintoken"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                    {tokenDisplay?.label ?? selectedToken}
                  </div>
                  {/* <Icon name="droparrowbig" /> */}
                </Dropdown.Toggle>

                {/* <Dropdown.Menu>
                  {DEPOSIT_TOKENS.map((token) => (
                    <Dropdown.Item
                      key={token.key}
                      onClick={() => {
                        setSelectedToken(token.key);
                        setIsCopied(false);
                      }}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src={token.img}
                        alt="img"
                        className="raintoken"
                        style={{ width: "22px", height: "22px" }}
                      />
                      {token.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu> */}
              </Dropdown>
            </div>

            {/* Chain Dropdown */}
            <div className="maindrop">
              <p className="heading">Chain</p>
              <Dropdown>
                <Dropdown.Toggle
                  id="chain-dropdown"
                  className="token-btn d-flex align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="forstyling">
                      {chainDisplay?.img && (
                        <img
                          src={chainDisplay.img}
                          alt="chain"
                          className="raintoken"
                          style={{ width: "20px", height: "20px" }}
                        />
                      )}
                      {chainDisplay?.label ?? "Select Chain"}
                    </div>
                  </div>
                  {/* <Icon name="droparrowbig" /> */}
                </Dropdown.Toggle>

                {/* <Dropdown.Menu>
                  {DEPOSIT_CHAINS.map((chain) => (
                    <Dropdown.Item
                      key={chain.key}
                      onClick={() => {
                        setSelectedChain(chain.key);
                        setIsCopied(false);
                      }}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src={chain.img}
                        alt="img"
                        className="raintoken"
                        style={{ width: "22px", height: "22px" }}
                      />
                      {chain.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu> */}
              </Dropdown>
            </div>
          </div>

          <div className="brdr"></div>

          {/* QR code + deposit address — only shown after token & chain selected */}
          {showDepositArea && (
            <>
              <div className="mainqr">
                <QRCode
                  value={depositAddress}
                  size={180}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="M"
                />
              </div>

              <div className="innerbox">
                <div className="leftinput">
                  <label htmlFor="rewardToken">Your deposit address:</label>
                  <input
                    type="text"
                    id="rewardToken"
                    value={getFormattedAddress(depositAddress)}
                    readOnly
                  />
                </div>
                <button
                  className="copy"
                  onClick={() => handleCopy(depositAddress)}
                >
                  <Icon name="copywhite" />
                  {isCopied ? "COPIED" : "COPY"}
                </button>
              </div>
            </>
          )}

          {!showDepositArea && !depositAddress && (
            <p
              style={{
                color: "#9a9a9a",
                fontSize: "13px",
                marginTop: "12px",
                textAlign: "center",
              }}
            >
              Please connect your wallet to get a deposit address.
            </p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Depositmodal;
