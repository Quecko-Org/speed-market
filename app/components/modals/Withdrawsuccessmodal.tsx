"use client";
import React from "react";
import { Modal } from "react-bootstrap";

interface WithdrawsuccessmodalProps {
  show: boolean;
  onHide: () => void;
}

const Withdrawsuccessmodal: React.FC<WithdrawsuccessmodalProps> = ({
  show,
  onHide,
}) => {
  return (
    <Modal className="withdraw" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="withdrawcontent">
          <div className="sucesscontent">
            <img
              src="/modalassets/success.svg"
              alt="img"
              className="img-fluid"
            />
            <h4>Withdrawal Completed!</h4>

            <p>
              Your funds <span>(300 USDT)</span> were successfully transferred
            </p>
          </div>

          <div className="buttonlast">
            <button onClick={onHide} className="close">
              Close
            </button>

            <button className="withdraw" onClick={onHide}>
              Okay
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Withdrawsuccessmodal;
