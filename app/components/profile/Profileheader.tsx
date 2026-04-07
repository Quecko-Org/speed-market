"use client";
import React, { FC } from "react";
import Icon from "../Icon";
import { getFormattedAddress } from "@/app/utils/helpers";
import { useAtomValue } from "jotai";
import { userProfileData, userSmartAccount } from "@/app/store/atoms";
import { toast } from "react-toastify";
interface ProfileheaderProps {
  onEdit: () => void;
  onShare: () => void;
}
const Profileheader: FC<ProfileheaderProps> = ({ onEdit, onShare }) => {

  const smartAccount = useAtomValue(userSmartAccount);
  const userProfileInfo = useAtomValue(userProfileData);

  return (
    <div className="upperinner">
      <div className="profilemain">
        <div className="innerprofile">
          <div className="profileimg">
            <img
              src={userProfileInfo?.profileImage || "/dummyassets/dummyuser.png"}
              alt="innerimg"
              className="innerimg"
            />
          </div>
          <div className="profiletexts">
            <h6 className="upperhead">{userProfileInfo?.displayName}</h6>
            <div className="smartmain">
              <h6 className="smartpara">Smart Wallet</h6>
              <h5 className="walletpara">{getFormattedAddress(smartAccount)}</h5>
              <button className="copybtn" onClick={() => {
                if (!smartAccount) return;
                navigator.clipboard.writeText(smartAccount);
                toast.success("Address copied!");
              }}>
                <Icon name="copy" />
              </button>
            </div>
          </div>
        </div>
        <div className="profilebtns">
          <button onClick={onEdit} className="editbtn">Edit Profile</button>
          <button onClick={onShare} className="sharebtn">
            Share Profile
            <Icon name="sharewhite" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profileheader;