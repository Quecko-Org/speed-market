"use client";
import React from "react";
import { Modal } from "react-bootstrap";
import Icon from "../Icon";
import { showToast } from "@/app/hooks/showToast";

interface EditprofilemodalProps {
  show: boolean;
  onHide: () => void;
}

const Editprofilemodal: React.FC<EditprofilemodalProps> = ({
  show,
  onHide,
}) => {
  return (
    <Modal className="profilemodal" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="maincontent">
          <div className="mainparent">
            <div className="profileleft">
            <div className="profileimg">
                <img src="/importantassets/placeholderimg.svg" alt="innerimg" className="innerimg" />
            </div>
            <div className="profiletexts">
                <h6 className="profilehead">Upload Image</h6>
                <p className="profilepara">
                    Min 400x400px, PNG or JPEG
                </p>
            </div>
            </div>
            <button className="eidtbtn">
                Edit
                <Icon name="editwhite" />
            </button>
          </div>

          <div className="maininput">
            <p>Name</p>
            <input type="text" placeholder="Enter Your Name" />
          </div>

          <div className="lastbutton">
            <button className="skip" onClick={onHide}>
              Cancel
            </button>
            <button className="create">Save Changes</button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Editprofilemodal;
