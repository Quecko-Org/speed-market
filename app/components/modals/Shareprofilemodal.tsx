"use client";
import React from "react";
import { Modal } from "react-bootstrap";
import Icon from "../Icon";
import { showToast } from "@/app/hooks/showToast";

interface ShareprofilemodalProps {
  show: boolean;
  onHide: () => void;
}

const Shareprofilemodal: React.FC<ShareprofilemodalProps> = ({
  show,
  onHide,
}) => {
  return (
    <Modal className="profilemodal" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Share Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="sharemodalmain">
          <p className="sharepara">Profile Link</p>
          <div className="mainlink">
            <p className="linkpara">
              https://speedmarkets.com/profile/felix-hogan
            </p>
            <button className="copybtn">
              <Icon name="copywhite" />
              Copy
            </button>
          </div>
          <p className="sharepara">Share via</p>
          <div className="socialicons">
            <a href="" className="innerlink">
              <Icon name="x" />
            </a>
            <a href="" className="innerlink">
              <Icon name="facebook" />
            </a>
            <a href="" className="innerlink">
              <Icon name="telegram" />
            </a>
            <a href="" className="innerlink">
              <Icon name="whatsapp" />
            </a>
            <a href="" className="innerlink">
              <Icon name="mail" />
            </a>
            <a href="" className="innerlink">
              <Icon name="link" />
            </a>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Shareprofilemodal;
