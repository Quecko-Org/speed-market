"use client";
import React from "react";
import { Modal } from "react-bootstrap";

interface DepositsuccessmodalProps {
  show: boolean;
  onHide: () => void;
}

const Depositsuccessmodal: React.FC<DepositsuccessmodalProps> = ({
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
            <h4>Deposit Completed!</h4>

            <p>
           <span>300 USDT</span> were successfully deposited to your account
            </p>
          </div>

          <div className="buttonlast">
            <button onClick={onHide} className="close">
           View History
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Depositsuccessmodal;
