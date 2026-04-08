"use client";
import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import Icon from "../Icon";
import { uploadMedia, updateUserProfile } from "@/app/services/auth";
import { showToast } from "@/app/hooks/showToast";

interface EditprofilemodalProps {
  show: boolean;
  onHide: () => void;
  currentName?: string;
  currentImage?: string;
  onProfileUpdated?: () => void;
}

const Editprofilemodal: React.FC<EditprofilemodalProps> = ({
  show,
  onHide,
  currentName = "",
  currentImage = "",
  onProfileUpdated,
}) => {
  const [name, setName] = useState(currentName);
  const [imagePreview, setImagePreview] = useState(currentImage);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  React.useEffect(() => {
    if (show) {
      setName(currentName);
      setImagePreview(currentImage);
      setImageFile(null);
    }
  }, [show, currentName, currentImage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", { message: "Please select a PNG or JPEG image" });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      let imageUrl = currentImage;

      // 1. Upload image if user selected a new one
      if (imageFile) {
        const uploadResult = await uploadMedia(imageFile);
        if (!uploadResult) {
          showToast("error", { message: "Failed to upload image" });
          return;
        }
        imageUrl = uploadResult.url ?? uploadResult.mediaUrl ?? uploadResult;
      }

      // 2. Update profile with name and image
      const payload: { displayName?: string; profileImage?: string } = {};
      if (name.trim()) payload.displayName = name.trim();
      if (imageUrl) payload.profileImage = imageUrl;

      const result = await updateUserProfile(payload);
      if (result) {
        showToast("success", { message: "Profile updated successfully" });
        onProfileUpdated?.();
        onHide();
      } else {
        showToast("error", { message: "Failed to update profile" });
      }
    } catch {
      showToast("error", { message: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

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
                <img
                  src={imagePreview || "/importantassets/placeholderimg.svg"}
                  alt="profile"
                  className="innerimg"
                />
              </div>
              <div className="profiletexts">
                <h6 className="profilehead">Upload Image</h6>
                <p className="profilepara">Min 400x400px, PNG or JPEG</p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <button className="eidtbtn" onClick={() => fileInputRef.current?.click()}>
              Edit
              <Icon name="editwhite" />
            </button>
          </div>

          <div className="maininput">
            <p>Name</p>
            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="lastbutton">
            <button className="skip" onClick={onHide} disabled={saving}>
              Cancel
            </button>
            <button className="create" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Editprofilemodal;
