"use client";
import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";

interface CreateprofilemodalProps {
  show: boolean;
  onHide: () => void;
}

const Createprofilemodal: React.FC<CreateprofilemodalProps> = ({
  show,
  onHide,
}) => {
  const [image, setImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal className="profilemodal" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Your Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="maincontent">
          <div className="parent">
            <div className="left">
              <img
                src={image || "/importantassets/placeholderimg.svg"}
                alt="img"
                className="img-fluid profileimg"
              />
            </div>

            <div className="right">
              <h2 className="head">Profile Image</h2>

              <p className="para">
                Recommended: 400×400, Max 5MB, Formats JPEG/PNG
              </p>

              <div className="uploadbutton">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleUpload}
                />

                {image ? (
                  <>
                  <button className="change" onClick={handleButtonClick}>
                    Change
                  </button>
                      <button
                    className="upload active"
                  >
                    Delete
                  </button>
                  </>
                ) : (
                  <button
                    className={image ? "upload active" : "upload"}
                    onClick={handleButtonClick}
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="maininput">
            <p>Username</p>
            <input type="text" placeholder="Enter your username" />
          </div>

          <div className="lastbutton">
            <button className="skip" onClick={onHide}>
              Skip
            </button>
            <button className="create">Create Profile</button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Createprofilemodal;
