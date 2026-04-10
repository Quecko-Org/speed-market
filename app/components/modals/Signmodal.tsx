"use client";
import React from "react";
import { Modal } from "react-bootstrap";
import Icon from "../Icon";

interface SignmodalProps {
  show: boolean;
  onHide: () => void;
}
const Signmodal: React.FC<SignmodalProps> = ({ show, onHide }) => {
  return (
    <Modal className="profilemodal" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sign required</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="signmodal">
          <div className="signimg">
            <Icon name="signicon" />
          </div>
          <h6 className="signhead">Sign to Proceed</h6>
          <p className="signpara">
            This signature confirms your identity and connects your wallet
            safely to the platform.
          </p>
          <button className="signbtn">Sign</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Signmodal;
