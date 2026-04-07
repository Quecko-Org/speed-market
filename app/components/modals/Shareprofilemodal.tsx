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
       
      </Modal.Body>
    </Modal>
  );
};

export default Shareprofilemodal;
