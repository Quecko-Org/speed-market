"use client";
import React from "react";
import { Modal, ProgressBar } from "react-bootstrap";

interface ClaimprocessedmodalProps {
  show: boolean;
  onHide: () => void;
}

const Claimprocessedmodal: React.FC<ClaimprocessedmodalProps> = ({
  show,
  onHide,
}) => {
  return (
    <Modal className="claimmodal" show={show} onHide={onHide} centered>
      <Modal.Body>
        <div className="claimcontent">
          <h2 className="heading">Claim is being processed...</h2>

          <p className="claimpara">
            Transaction in progress! Blockchain validation is underway. This may take a few minutes.
          </p>

          <div className="progressbox">
            <div className="upperpart">
              <h4 className="progresshead">Progress</h4>
              <p className="green">80%</p>
            </div>

            <div className="progressmain">
              <ProgressBar now={80} />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Claimprocessedmodal;
