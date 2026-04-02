import React from "react";
import Home from "./components/home/Home";
import Header from "./components/header/Header";
import Winninganimation from "./components/home/Winninganimation";
import { PositionsProvider } from "./components/positions/PositionsContext";
import MainPositions from "./components/positions/MainPositions";

const page = () => {
  return (
    <>
      <Header />
      <Winninganimation />
      <PositionsProvider>
        <div className="app-layout">
          <main className="app-main">
            <Home />
          </main>
          <MainPositions />
        </div>
      </PositionsProvider>
    </>
  );
};

export default page;
