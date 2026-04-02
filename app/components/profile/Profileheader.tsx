"use client";
import React, { FC } from "react";
import Icon from "../Icon";
import { getFormattedAddress } from "@/app/utils/helpers";
import { useAtomValue } from "jotai";
import { userProfileData, userSmartAccount } from "@/app/store/atoms";

const ProfileHeader: FC = () => {

  const smartAccount = useAtomValue(userSmartAccount);
  const userProfileInfo = useAtomValue(userProfileData);

  return (
    <div className="upperinner">
      <div className="profilemain">
        <div className="innerprofile">
          <div className="profileimg">
            <img
              src="/dummyassets/dummyuser.png"
              alt="innerimg"
              className="innerimg"
            />
          </div>
          <div className="profiletexts">
            <h6 className="upperhead">{userProfileInfo?.displayName}</h6>
            <div className="smartmain">
              <h6 className="smartpara">Smart Wallet</h6>
              <h5 className="walletpara">{getFormattedAddress(smartAccount)}</h5>
              <button className="copybtn">
                <Icon name="copy" />
              </button>
            </div>
          </div>
        </div>
        <div className="profilebtns">
          <button className="editbtn">Edit Profile</button>
          <button className="sharebtn">
            Share Profile
            <Icon name="sharewhite" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;