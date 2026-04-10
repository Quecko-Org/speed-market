"use client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Withdrawsuccessmodal from "./Withdrawsuccessmodal";
import { useAtomValue } from "jotai";
import { userSmartAccountUsdtBalance, userSmartAccount } from "@/app/store/atoms";
import { formatNumberWithCommas } from "@/app/utils/helpers";
import { useWithdraw } from "@/app/hooks/useWithdraw";
import { useGetUsdtBalance } from "@/app/hooks/useBalance";
import { showToast } from "@/app/hooks/showToast";

interface WithdrawmodalProps {
  show: boolean;
  onHide: () => void;
}

const isValidEthAddress = (address: string): boolean =>
  /^0x[a-fA-F0-9]{40}$/.test(address);

type ModalKeys = "withdrawsuccess";
type ModalState = Record<ModalKeys, boolean>;

const Withdrawmodal: React.FC<WithdrawmodalProps> = ({ show, onHide }) => {
  const usdtBalance = useAtomValue(userSmartAccountUsdtBalance);
  const smartAccount = useAtomValue(userSmartAccount);
  const { withdraw } = useWithdraw();
  const fetchUsdtBalance = useGetUsdtBalance();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawnAmount, setWithdrawnAmount] = useState("");

  const [modals, setModals] = useState<ModalState>({
    withdrawsuccess: false,
  });

  const openModal = (name: ModalKeys) =>
    setModals((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name: ModalKeys) =>
    setModals((prev) => ({ ...prev, [name]: false }));

  const resetForm = () => {
    setRecipientAddress("");
    setAmount("");
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const handleMax = () => {
    setAmount(usdtBalance > 0 ? usdtBalance.toString() : "");
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleWithdraw = async () => {
    // Validations
    if (!smartAccount) {
      showToast("error", { message: "Please connect your wallet first." });
      return;
    }

    if (!recipientAddress.trim()) {
      showToast("error", { message: "Please enter a recipient address." });
      return;
    }

    if (!isValidEthAddress(recipientAddress.trim())) {
      showToast("error", { message: "Please enter a valid Ethereum address." });
      return;
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      showToast("error", { message: "Please enter a valid amount." });
      return;
    }

    if (numAmount > usdtBalance) {
      showToast("error", { message: "Insufficient balance." });
      return;
    }

    try {
      setIsWithdrawing(true);

      const result = await withdraw(
        recipientAddress.trim(),
        numAmount,
        usdtBalance
      );

      if (result.receipt && !result.error) {
        setWithdrawnAmount(amount);
        resetForm();
        onHide();
        openModal("withdrawsuccess");
        // Refresh balance
        await fetchUsdtBalance();
      } else {
        const errorMsg =
          result.error?.code === 4001
            ? "Transaction rejected by user."
            : "Withdrawal failed. Please try again.";
        showToast("error", { message: errorMsg });
      }
    } catch {
      showToast("error", { message: "Withdrawal failed. Please try again." });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <>
      <Modal className="withdraw" show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="withdrawcontent">
            <div className="parenttoken">
              <div className="lefttoken">
                <p className="tokenpar">Token</p>
                <span>
                  <img
                    src="/tokenimages/usdt.png"
                    alt="alt"
                    className="img-fluid img"
                  />
                  USDT
                </span>
              </div>
              <div className="lefttoken">
                <p className="tokenpar">Chain</p>
                <span>
                  <img
                    src="/tokenimages/arbitrum.svg"
                    alt="img"
                    className="img-fluid arb"
                  />
                  Arbitrum
                </span>
              </div>
            </div>

            <div className="maininputss">
              <div className="innerinput">
                <p>Address</p>
                <input
                  type="text"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  disabled={isWithdrawing}
                />
              </div>

              <div className="innerinput">
                <div className="parentmaintext">
                  <p>Amount</p>
                  <h6>
                    Balance
                    <img
                      src="/tokenimages/usdt.png"
                      alt="img"
                      className="img-fluid usd"
                    />
                    <span>${formatNumberWithCommas(usdtBalance)}</span>
                  </h6>
                </div>

                <div className="parentmaininput">
                  <input
                    type="text"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    disabled={isWithdrawing}
                  />
                  <button
                    className="max"
                    onClick={handleMax}
                    disabled={isWithdrawing}
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>

            <div className="buttonlast">
              <button
                className="close"
                onClick={handleClose}
                disabled={isWithdrawing}
              >
                Close
              </button>

              <button
                onClick={handleWithdraw}
                className="withdraw"
                disabled={isWithdrawing || !amount || !recipientAddress}
              >
                {isWithdrawing ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Withdrawsuccessmodal
        show={modals.withdrawsuccess}
        onHide={() => closeModal("withdrawsuccess")}
        amount={withdrawnAmount}
      />
    </>
  );
};

export default Withdrawmodal;
