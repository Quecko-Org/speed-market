"use client";
import React, { FC } from "react";
import Profilestats from "./Profilestats";
import Predictionshistory from "./Predictionshistory";

const Userprofile: FC = () => {
  return (
    <>
      <section className="mainprofile">
        <div className="custom-container">
          <div className="upperprofile userprofile">
            <Profilestats />
          </div>
          <Predictionshistory />
        </div>
      </section>
    </>
  );
};

export default Userprofile;
