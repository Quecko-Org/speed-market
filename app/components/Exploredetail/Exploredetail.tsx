"use client";
import React, { FC, useState } from "react";
import Icon from "../Icon";
import { usePositions } from "../positions/PositionsContext";
import Footer from "../footer/Footer";
import { Tab, Tabs } from "react-bootstrap";

const Exploredetail: FC = () => {
  const { isOpen: isPositionsOpen, toggle } = usePositions();
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
          <div className="maintoken">
            <div className="innertoken">
              <div className="tokenimg">
                <img
                  src="/tokenimages/btc.png"
                  alt="innerimg"
                  className="innerimg"
                />
              </div>
              <div className="tokentexts">
                <h6 className="tokenhead">
                  BTC/USDT
                  <span className="maintimer">
                    <Icon name="timer" />5 min
                  </span>
                </h6>
                <p className="tokenpara">$90,298.5</p>
              </div>
            </div>
          </div>
          <div className="mainpositiontable">
            <div className="tabletop">
              <p className="positionhead">Positions (1)</p>
              <button className="claimallbtn">Claim All</button>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Prediction</th>
                    <th>Baseline value and time</th>
                    <th>Settlement Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="predictionmain upmain">
                        <span className="predictionimg">
                          <Icon name="up" className="up" />
                        </span>
                        <p className="predictionpara">Up</p>
                      </div>
                    </td>
                    <td>
                      <div className="maintime">
                        <h6 className="timehead">13:26:30</h6>
                        <p className="timepara">2025-12-15 13:26:30</p>
                      </div>
                    </td>
                    <td>$92,200.45</td>
                    <td>
                      <div className="tablebuttons">
                        <button className="timerbtn">2m 49s</button>
                        <button className="sharebtn">
                          <Icon name="predictionshare" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="predictionmain downmain">
                        <span className="predictionimg">
                          <Icon name="down" className="down" />
                        </span>
                        <p className="predictionpara">Down</p>
                      </div>
                    </td>
                    <td>
                      <div className="maintime">
                        <h6 className="timehead">13:26:30</h6>
                        <p className="timepara">2025-12-15 13:26:30</p>
                      </div>
                    </td>
                    <td>$92,200.45</td>
                    <td>
                      <div className="tablebuttons">
                        <button className="claimbtn">Claim</button>
                        <button className="sharebtn">
                          <Icon name="predictionshare" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="marketinfo">
            <h6 className="marketinnerhead">Market Info</h6>
            <p className="marketlowerhead">Description</p>
            <p className="marketinnerpara">
              Donec a eros justo. Fusce egestas tristique ultrices. Nam tempor,
              augue nec tincidunt molestie, massa nunc varius arcu, at
              scelerisque elit erat a magna. Donec quis erat at libero ultrices
              mollis. In hac habitasse platea dictumst. Vivamus vehicula leo
              dui, at porta nisi facilisis finibus. In euismod augue vitae nisi
              ultricies, non aliquet urna tincidunt. Integer in nisi eget nulla
              commodo faucibus efficitur quis massa. Praesent felis est, finibus
              et nisi ac, hendrerit venenatis libero. Donec consectetur faucibus
              ipsum id gravida.
            </p>
          </div>
          <div className="maintabs">
            <Tabs
              defaultActiveKey="comments"
              id="uncontrolled-tab-example"
              className="detailtabs"
            >
              <Tab eventKey="comments" title="Comments (98)">
                Tab content for Home
              </Tab>
              <Tab eventKey="activity" title="Activity">
               <h6 className="activityhead">Activity</h6>
              </Tab>
              <Tab eventKey="history" title="History">
                Tab content for Contact
              </Tab>
            </Tabs>
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
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Exploredetail;
