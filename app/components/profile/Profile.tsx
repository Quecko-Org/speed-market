"use client";
import React, { FC, useState } from "react";
import Depositmodal from "../modals/Depositmodal";
import Withdrawmodal from "../modals/Withdrawmodal";
import ProfileHeader from "./Profileheader";
import PortfolioCard from "./Portfoliocard";
import StatsBar from "./Statsbar";
import PredictionsTable from "./Predictionstable";

type ModalKeys = "withdraw" | "deposit";
type ModalState = Record<ModalKeys, boolean>;

const Profile: FC = () => {
  const [modals, setModals] = useState<ModalState>({
    withdraw: false,
    deposit: false,
  });

  const openModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: true }));
  };

  const closeModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: false }));
  };

  return (
    <>
      <section className="mainprofile">
        <div className="custom-container">
          <div className="upperprofile">
            <ProfileHeader />
            <PortfolioCard
              onDeposit={() => openModal("deposit")}
              onWithdraw={() => openModal("withdraw")}
            />
          </div>
          <StatsBar />
          <PredictionsTable />
        </div>
      </section>

      <Depositmodal
        show={modals.deposit}
        onHide={() => closeModal("deposit")}
      />
      <Withdrawmodal
        show={modals.withdraw}
        onHide={() => closeModal("withdraw")}
      />
    </>
  );
};

export default Profile;