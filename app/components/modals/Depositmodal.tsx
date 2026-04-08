"use client";
import React, { useEffect, useState } from "react";
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
import { useDepositTransfer } from "@/app/hooks/useDepositTransfer";
import { useGetUsdtBalance } from "@/app/hooks/useBalance";
import Depositsuccessmodal from "./Depositsuccessmodal";
import { showToast } from "@/app/hooks/showToast";

interface DepositmodalProps {
  show: boolean;
  onHide: () => void;
}

type ModalKeys = "depositsuccess";
type ModalState = Record<ModalKeys, boolean>;

const Depositmodal: React.FC<DepositmodalProps> = ({ show, onHide }) => {
  const smartAccount = useAtomValue(userSmartAccount);
  const { getWalletBalance, transferToSmartAccount, isTransferring, walletAddress } = useDepositTransfer();
  const fetchUsdtBalance = useGetUsdtBalance();

  const [selectedToken, setSelectedToken] = useState<string>(TOKEN_USDT);
  const [selectedChain, setSelectedChain] = useState<string>(CHAIN_ARBITRUM);
  const [isCopied, setIsCopied] = useState(false);
  const [depostiVia, setDepostiVia] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [successAmount, setSuccessAmount] = useState<string>("0");

  const depositAddress = smartAccount || "";
  const tokenDisplay = DEPOSIT_TOKENS.find((t) => t.key === selectedToken);
  const chainDisplay = DEPOSIT_CHAINS.find((c) => c.key === selectedChain);

  const [modals, setModals] = useState<ModalState>({
    depositsuccess: false,
  });

  const openModal = (name: ModalKeys) =>
    setModals((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name: ModalKeys) =>
    setModals((prev) => ({ ...prev, [name]: false }));

  // Fetch connected wallet balance when "Via connected wallet" is selected
  useEffect(() => {
    if (depostiVia === "Via connected wallet" && walletAddress) {
      getWalletBalance().then((bal) => setWalletBalance(bal));
    }
  }, [depostiVia, walletAddress, getWalletBalance]);

  const handleAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setDepositAmount(value);
    }
  };

  const handleMaxClick = () => {
    setDepositAmount(walletBalance);
  };

  const handleDeposit = async () => {
    const amount = depositAmount.trim();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showToast("error", { message: "Please enter a valid amount" });
      return;
    }
    if (Number(amount) > Number(walletBalance)) {
      showToast("error", { message: "Insufficient balance" });
      return;
    }
    if (!smartAccount) {
      showToast("error", { message: "Smart account not available" });
      return;
    }

    const hash = await transferToSmartAccount(smartAccount, amount);
    if (hash) {
      setSuccessAmount(amount);
      setDepositAmount("");
      onHide();
      openModal("depositsuccess");
      // Fetch balance immediately and again after 3s to catch confirmation delay
      fetchUsdtBalance();
      setTimeout(() => fetchUsdtBalance(), 3000);
    }
  };

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
    setDepostiVia("");
    setDepositAmount("");
  };

  const handleClose = () => {
    resetState();
    onHide();
  };

  const showDepositArea =
    selectedToken !== DEFAULT_TOKEN &&
    selectedChain !== DEFAULT_CHAIN &&
    !!depositAddress;

  return (
    <>
    <Modal className="deposit" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {depostiVia === "Via deposit address" ? (
            <>
              <span
                onClick={() => setDepostiVia("")}
                className="cursorpointer"
              >
                <Icon name="backarrow" />
              </span>
              Via deposit address
            </>
          ) : depostiVia === "Via connected wallet" ? (
            <>
              <span
                onClick={() => setDepostiVia("")}
                className="cursorpointer"
              >
                <Icon name="backarrow" />
              </span>
              Via connected wallet
            </>
          ) : (
            "Deposit"
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {depostiVia === "Via deposit address" ? (
          <>
            <div className="depositcontent">
              <div className="firstbox">
                <div className="left">
                  <p>Choose the asset you wish to swap to</p>
                </div>
                <div className="right">
                  <div className="maintoken">
                    <img src="/tokenimages/usdt.png" alt="tokenimg" className="tokenimg" />
                    <img src="/tokenimages/arbitrum.svg" alt="chainimg" className="chainimg" />
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
                    <Dropdown.Toggle id="token-dropdown" className="d-flex align-items-center gap-2">
                      <div className="forstyling">
                        {tokenDisplay?.img && (
                          <img src={tokenDisplay.img} alt="token" className="raintoken" style={{ width: "20px", height: "20px" }} />
                        )}
                        {tokenDisplay?.label ?? selectedToken}
                      </div>
                    </Dropdown.Toggle>
                  </Dropdown>
                </div>

                <div className="maindrop">
                  <p className="heading">Chain</p>
                  <Dropdown>
                    <Dropdown.Toggle id="chain-dropdown" className="token-btn d-flex align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <div className="forstyling">
                          {chainDisplay?.img && (
                            <img src={chainDisplay.img} alt="chain" className="raintoken" style={{ width: "20px", height: "20px" }} />
                          )}
                          {chainDisplay?.label ?? "Select Chain"}
                        </div>
                      </div>
                    </Dropdown.Toggle>
                  </Dropdown>
                </div>
              </div>

              <div className="brdr"></div>

              {showDepositArea && (
                <>
                  <div className="mainqr">
                    <QRCode value={depositAddress} size={180} bgColor="#FFFFFF" fgColor="#000000" level="M" />
                  </div>

                  <div className="innerbox">
                    <div className="leftinput">
                      <label htmlFor="rewardToken">Your deposit address:</label>
                      <input type="text" id="rewardToken" value={getFormattedAddress(depositAddress)} readOnly />
                    </div>
                    <button className="copy" onClick={() => handleCopy(depositAddress)}>
                      <Icon name="copywhite" />
                      {isCopied ? "COPIED" : "COPY"}
                    </button>
                  </div>
                </>
              )}

              {!showDepositArea && !depositAddress && (
                <p style={{ color: "#9a9a9a", fontSize: "13px", marginTop: "12px", textAlign: "center" }}>
                  Please connect your wallet to get a deposit address.
                </p>
              )}
            </div>
          </>
        ) : depostiVia === "Via connected wallet" ? (
          <>
            <div className="depositcontent">
              <div className="parentdropdowns">
                <div className="maindrop">
                  <p className="heading">Token</p>
                  <Dropdown>
                    <Dropdown.Toggle id="token-dropdown" className="d-flex align-items-center gap-2">
                      <div className="forstyling">
                        {tokenDisplay?.img && (
                          <img src={tokenDisplay.img} alt="token" className="raintoken" style={{ width: "20px", height: "20px" }} />
                        )}
                        {tokenDisplay?.label ?? selectedToken}
                      </div>
                    </Dropdown.Toggle>
                  </Dropdown>
                </div>

                <div className="maindrop">
                  <p className="heading">Chain</p>
                  <Dropdown>
                    <Dropdown.Toggle id="chain-dropdown" className="token-btn d-flex align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <div className="forstyling">
                          {chainDisplay?.img && (
                            <img src={chainDisplay.img} alt="chain" className="raintoken" style={{ width: "20px", height: "20px" }} />
                          )}
                          {chainDisplay?.label ?? "Select Chain"}
                        </div>
                      </div>
                    </Dropdown.Toggle>
                  </Dropdown>
                </div>
              </div>
              <div className="amountheadings">
                <p className="amountpara">Amount</p>
                <div className="mainbalance">
                  <p className="balancepara">Balance</p>
                  <div className="tokenimg">
                    {tokenDisplay?.img && (
                      <img src={tokenDisplay.img} alt="token" className="innerimg" />
                    )}
                  </div>
                  <p className="amountpara">${Number(walletBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="maxinput">
                <input
                  type="text"
                  placeholder="0.00"
                  className="innerinput"
                  value={depositAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  disabled={isTransferring}
                />
                <button className="maxbtn" onClick={handleMaxClick} disabled={isTransferring}>
                  MAX
                </button>
              </div>
              <div className="depositbtns">
                <button className="closebtn" onClick={handleClose} disabled={isTransferring}>
                  Close
                </button>
                <button
                  className="depositbtn"
                  onClick={handleDeposit}
                  disabled={isTransferring || !depositAmount.trim()}
                >
                  {isTransferring ? "Depositing..." : "Deposit"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="maindeposit">
            <div
              className="innerdeposit"
              onClick={() => setDepostiVia("Via connected wallet")}
            >
              <div className="depositleft">
                <Icon name="walleticon" />
                <h6 className="innerhead">Via connected wallet</h6>
                <p className="innerpara">{walletAddress ? getFormattedAddress(walletAddress) : "Not connected"}</p>
              </div>
              <Icon name="rightarrow" className="arrowimg" />
            </div>
            <div
              className="innerdeposit"
              onClick={() => setDepostiVia("Via deposit address")}
            >
              <div className="depositleft">
                <Icon name="addressicon" />
                <h6 className="innerhead">Via deposit address</h6>
                <p className="innerpara">No Limit - Instant</p>
              </div>
              <Icon name="rightarrow" className="arrowimg" />
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
      <Depositsuccessmodal
        show={modals.depositsuccess}
        onHide={() => closeModal("depositsuccess")}
        amount={successAmount}
      />
    </>
  );
};

export default Depositmodal;
