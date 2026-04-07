"use client";
import React, { FC, useEffect, useState } from "react";
import Depositmodal from "../modals/Depositmodal";
import Withdrawmodal from "../modals/Withdrawmodal";
import ProfileHeader from "./Profileheader";
import PortfolioCard from "./Portfoliocard";
import StatsBar from "./Statsbar";
import PredictionsTable from "./Predictionstable";
import { getUserHistory } from "@/app/services/userPositions";
import Editprofilemodal from "../modals/Editprofilemodal";
import Shareprofilemodal from "../modals/Shareprofilemodal";

type ModalKeys = "withdraw" | "deposit" | "editprofile" | "shareprofile";
type ModalState = Record<ModalKeys, boolean>;

const ITEMS_PER_PAGE = 10;

const Profile: FC = () => {
  const [modals, setModals] = useState<ModalState>({
    withdraw: false,
    deposit: false,
    editprofile: false,
    shareprofile: false
  });

  const [history, setHistory] = useState<any[]>([]);
  const [pnlData, setPnlData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchHistory = async (page: number) => {
    setLoading(true);
    try {
      const response = await getUserHistory(undefined, page + 1, ITEMS_PER_PAGE);
      if (response) {
        setHistory(response.bets ?? response.data ?? []);
        setPnlData(response.pnl ?? null);
        setTotalPages(response.pages ?? Math.ceil((response.count ?? 0) / ITEMS_PER_PAGE));
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          <StatsBar pnlData={pnlData} />
          <PredictionsTable
            history={history}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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
