"use client";
import React, { FC, useState } from "react";
import Icon from "../Icon";
import { usePositions } from "../positions/PositionsContext";
import Footer from "../footer/Footer";
import { Tab, Tabs } from "react-bootstrap";
import TradingChart from "./TradingChart";
import CommentSection from "./CommentSection";
import PlacePredictionModal from "../modals/PlacePredictionModal";
import TradeForm from "./PlaceTradeComponent";
import Token from "./Token";
import Marketinfo from "./Marketinfo";
import Positiontable from "./Positiontable";
import Activity from "./Activity";
import History from "./History";

const Exploredetail: FC = () => {
  const { activeTab, setActiveTab } = usePositions();
  const { isOpen: isPositionsOpen, toggle } = usePositions();

  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [direction, setDirection] = useState<"UP" | "DOWN">("UP");
  const [amount, setAmount] = useState(5);

  const maxPosition = 5;
  const balance = 500;
  const quickValues = [5, 10, 50, 100, 250];

  const feeValue = amount * 0.05;
  const effectiveAmount = amount - feeValue;
  const potentialWin = effectiveAmount * 2;

  const handlePlacePrediction = () => {
    console.log("Prediction placed:", { direction, amount });
    handleClose();
  };
  return (
    <>
      <section className="detailmain speedmarket">
        <button
          className="openbtn"
          onClick={toggle}
          style={{ right: isPositionsOpen ? "339px" : "0" }}
        >
          <span className="mainnumber">13</span>
          <p className="openpara">Open Positions</p>
          <Icon name="openarrow" className={isPositionsOpen ? "rotate" : ""} />
        </button>
        <div className="detaileft">
          <div className="mobiletabs d-none">
            <Tabs
            activeKey={activeTab}
  onSelect={(k) => setActiveTab(k as any)}
     className="detailtabs"
            >
              <Tab eventKey="trade" title="Trade">
                <Token />
                <div className="chart-parent">
                  <TradingChart />
                </div>
                <Positiontable />
                <div className="sharemain">
                  <p className="sharepara">SHARE</p>
                  <div className="iconsmain">
                    <span className="innericon">
                      <Icon name="x" />
                    </span>
                    <span className="innericon">
                      <Icon name="facebook" />
                    </span>
                    <span className="innericon">
                      <Icon name="telegram" />
                    </span>
                    <span className="innericon">
                      <Icon name="whatsapp" />
                    </span>
                    <span className="innericon">
                      <Icon name="mail" />
                    </span>
                    <span className="innericon">
                      <Icon name="link" />
                    </span>
                  </div>
                </div>
                <Marketinfo />
                <div className="placemain d-none">
                  <button
                    onClick={() => {
                      handleOpen();
                    }}
                    className="placebtn"
                  >
                    Place Prediction
                  </button>
                </div>
              </Tab>
              <Tab eventKey="activity" title="Activity">
                <div className="activitytabs">
                  <Tabs
                    defaultActiveKey="activity"
                    id="uncontrolled-tab-example"
                    className="mblactivitytabs"
                  >
                    <Tab eventKey="activity" title="Activity">
                      <Activity />
                    </Tab>
                    <Tab eventKey="history" title="History">
                      <History />
                    </Tab>
                  </Tabs>
                </div>
              </Tab>
              <Tab eventKey="comments" title="Comments">
                <CommentSection />
              </Tab>
            </Tabs>
          </div>
          <div className="d-noneformobileview w-100">
            <Token />

            <div className="chart-parent">
              <TradingChart />
            </div>
            <Positiontable />
            <Marketinfo />
            <div className="maintabs">
              <Tabs
                defaultActiveKey="comments"
                id="uncontrolled-tab-example"
                className="detailtabs"
              >
                <Tab eventKey="comments" title="Comments (98)">
                  <CommentSection />
                </Tab>
                <Tab eventKey="activity" title="Activity">
                  <Activity />
                </Tab>
                <Tab eventKey="history" title="History">
                  <History />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="detailright">
          <div className="sharemain">
            <p className="sharepara">SHARE</p>
            <div className="iconsmain">
              <span className="innericon">
                <Icon name="x" />
              </span>
              <span className="innericon">
                <Icon name="facebook" />
              </span>
              <span className="innericon">
                <Icon name="telegram" />
              </span>
              <span className="innericon">
                <Icon name="whatsapp" />
              </span>
              <span className="innericon">
                <Icon name="mail" />
              </span>
              <span className="innericon">
                <Icon name="link" />
              </span>
            </div>
          </div>
          <TradeForm
            direction={direction}
            setDirection={setDirection}
            amount={amount}
            setAmount={setAmount}
            maxPosition={maxPosition}
            balance={balance}
            quickValues={quickValues}
            feeValue={feeValue}
            effectiveAmount={effectiveAmount}
            potentialWin={potentialWin}
            onPlacePrediction={handlePlacePrediction}
          />
        </div>
      </section>
      <Footer />
      <PlacePredictionModal show={showModal} handleClose={handleClose} />
    </>
  );
};

export default Exploredetail;
