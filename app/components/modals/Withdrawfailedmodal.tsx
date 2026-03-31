"use client";
import React from "react";
import { Modal } from "react-bootstrap";

interface WithdrawfailedmodalProps {
  show: boolean;
  onHide: () => void;
}

const Withdrawfailedmodal: React.FC<WithdrawfailedmodalProps> = ({
  show,
  onHide,
}) => {
  return (
    <Modal className="withdraw" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="withdrawcontent">
          <div className="sucesscontent">
            <img src="/modalassets/failed.svg" alt="img" className="img-fluid" />
            <h4>Withdrawal Failed</h4>

            <h5>
              Yours withdrawal unsuccessful due to high congestion. Please try
              again later or break your withdrawal down into smaller chunks
            </h5>

            <span className="notetext">
              Note: Your USDT is safe this congestion should subside shortly.
            </span>
          </div>

          <div className="buttonlast">
            <button onClick={onHide} className="close">Close</button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Withdrawfailedmodal;
