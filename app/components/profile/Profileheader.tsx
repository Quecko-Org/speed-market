"use client";
import React, { FC } from "react";
import Icon from "../Icon";

const ProfileHeader: FC = () => {
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
            <h6 className="upperhead">Felix Hogan</h6>
            <div className="smartmain">
              <h6 className="smartpara">Smart Wallet</h6>
              <h5 className="walletpara">0x1256...5911xa</h5>
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