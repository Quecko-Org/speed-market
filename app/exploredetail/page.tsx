import React from "react";
import Exploredetail from "../components/Exploredetail/Exploredetail";
import Header from "../components/header/Header";
import { PositionsProvider } from "../components/positions/PositionsContext";
import MainPositions from "../components/positions/MainPositions";

const page = () => {
  return (
    <>
      <Header />
      <PositionsProvider>
        <div className="app-layout explore-layout">
          <main className="app-main">
            <Exploredetail />
          </main>
          <MainPositions />
        </div>
      </PositionsProvider>
    </>
  );
};

export default page;
