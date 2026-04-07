"use client";
import React, { FC, useState } from "react";
import Depositmodal from "../modals/Depositmodal";
import Withdrawmodal from "../modals/Withdrawmodal";
import ProfileHeader from "./Profileheader";
import PortfolioCard from "./Portfoliocard";
import StatsBar from "./Statsbar";
import PredictionsTable from "./Predictionstable";
import Editprofilemodal from "../modals/Editprofilemodal";
import Shareprofilemodal from "../modals/Shareprofilemodal";

type ModalKeys = "withdraw" | "deposit" | "editprofile" | "shareprofile";
type ModalState = Record<ModalKeys, boolean>;

const Profile: FC = () => {
  const [modals, setModals] = useState<ModalState>({
    withdraw: false,
    deposit: false,
    editprofile: false,
    shareprofile: false
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
            <ProfileHeader onEdit={() => openModal("editprofile")} onShare={() => openModal("shareprofile")} />
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
      <Editprofilemodal
        show={modals.editprofile}
        onHide={() => closeModal("editprofile")}
      />
            <Shareprofilemodal
        show={modals.shareprofile}
        onHide={() => closeModal("shareprofile")}
      />
    </>
  );
};

export default Profile;
