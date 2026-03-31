"use client";
import React, { FC, useState } from "react";
import Icon from "../Icon";
import { usePositions } from "../positions/PositionsContext";
import Footer from "../footer/Footer";
import { Tab, Tabs } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import TradingChart from "./TradingChart";

const Exploredetail: FC = () => {
  const { isOpen: isPositionsOpen, toggle } = usePositions();
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected);
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
          <div className="chart-parent">
            <TradingChart />
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
                <div className="mainactivity">
                  <div className="inneractivity">
                    <div className="leftactivity">
                      <div className="userimg">
                        <img src="/dummyassets/dummyuser.png" alt="innerimg" className="innerimg" />
                      </div>
                      <p className="userpara">
                        kgonzales placed a <span className="upstatus">Up</span>{" "}
                        prediction for BTC at $50.29
                      </p>
                    </div>
                    <p className="secondpara">4s ago</p>
                  </div>
                  <div className="inneractivity">
                    <div className="leftactivity">
                      <div className="userimg">
                        <img src="/dummyassets/dummyuser.png" alt="innerimg" className="innerimg" />
                      </div>
                      <p className="userpara">
                        0xadfc....9b9c placed a{" "}
                        <span className="downstatus">Down</span> prediction for
                        XRP at $35.48
                      </p>
                    </div>
                    <p className="secondpara">3s ago</p>
                  </div>
                  <div className="inneractivity">
                    <div className="leftactivity">
                      <div className="userimg">
                        <img src="/dummyassets/dummyuser.png" alt="innerimg" className="innerimg" />
                      </div>
                      <p className="userpara">
                        kgonzales placed a <span className="upstatus">Up</span>{" "}
                        prediction for BTC at $50.29
                      </p>
                    </div>
                    <p className="secondpara">4s ago</p>
                  </div>
                  <div className="inneractivity">
                    <div className="leftactivity">
                      <div className="userimg">
                        <img src="/dummyassets/dummyuser.png" alt="innerimg" className="innerimg" />
                      </div>
                      <p className="userpara">
                        0xadfc....9b9c placed a{" "}
                        <span className="downstatus">Down</span> prediction for
                        XRP at $35.48
                      </p>
                    </div>
                    <p className="secondpara">3s ago</p>
                  </div>
                </div>
                <ReactPaginate
                  previousLabel={"←"}
                  nextLabel={"→"}
                  breakLabel={"..."}
                  pageCount={15}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  nextClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </Tab>
              <Tab eventKey="history" title="History">
                <div className="predictiontable">
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Prediction</th>
                          <th>Amount</th>
                          <th>Result</th>
                          <th>Earned</th>
                          <th>Date & Time</th>
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
                          <td>$50</td>
                          <td>
                            <p className="resultpara won">Won</p>
                          </td>
                          <td>$180</td>
                          <td>
                            <div className="maintime">
                              <h6 className="timehead">13:26:30</h6>
                              <p className="timepara">2025-12-15</p>
                            </div>
                          </td>
                          <td>
                            <button className="sharebtn">
                              <Icon name="predictionshare" />
                            </button>
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
                          <td>$50</td>
                          <td>
                            <p className="resultpara lost">Lost</p>
                          </td>
                          <td>$180</td>
                          <td>
                            <div className="maintime">
                              <h6 className="timehead">13:26:30</h6>
                              <p className="timepara">2025-12-15</p>
                            </div>
                          </td>
                          <td>
                            <button className="sharebtn">
                              <Icon name="predictionshare" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mobileboxes d-none">
                    <div className="innerbox">
                      <div className="innerboxmain">
                        <div className="box">
                          <p className="boxpara">Prediction</p>
                          <div className="predictionmain upmain">
                            <span className="predictionimg">
                              <Icon name="up" className="up" />
                            </span>
                            <p className="predictionpara">Up</p>
                          </div>
                        </div>
                        <div className="box">
                          <p className="boxpara">Amount</p>
                          <h6 className="boxhead">$50</h6>
                        </div>
                      </div>
                      <div className="innerboxmain">
                        <div className="box">
                          <p className="boxpara">Result</p>
                          <h6 className="boxhead won">Won</h6>
                        </div>
                        <div className="box">
                          <p className="boxpara">Earned</p>
                          <h6 className="boxhead">$50</h6>
                        </div>
                      </div>
                      <div className="innerboxmain">
                        <div className="box">
                          <p className="boxpara">Date & Time</p>
                          <div className="maintime">
                            <h6 className="timehead">13:26:30</h6>
                            <p className="timepara">2025-12-15</p>
                          </div>
                        </div>
                        <div className="box">
                          <button className="sharebtn">
                            <Icon name="predictionshare" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="innerbox">
                      <div className="innerboxmain">
                        <div className="box">
                          <p className="boxpara">Prediction</p>
                          <div className="predictionmain downmain">
                            <span className="predictionimg">
                              <Icon name="down" className="down" />
                            </span>
                            <p className="predictionpara">Down</p>
                          </div>
                        </div>
                        <div className="box">
                          <p className="boxpara">Amount</p>
                          <h6 className="boxhead">$50</h6>
                        </div>
                      </div>
                      <div className="innerboxmain">
                        <div className="box">
                          <p className="boxpara">Result</p>
                          <h6 className="boxhead lost">Lost</h6>
                        </div>
                        <div className="box">
                          <p className="boxpara">Earned</p>
                          <h6 className="boxhead">$50</h6>
                        </div>
                      </div>
                      <div className="innerboxmain">
                        <div className="box">
                          <p className="boxpara">Date & Time</p>
                          <div className="maintime">
                            <h6 className="timehead">13:26:30</h6>
                            <p className="timepara">2025-12-15</p>
                          </div>
                        </div>
                        <div className="box">
                          <button className="sharebtn">
                            <Icon name="predictionshare" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ReactPaginate
                    previousLabel={"←"}
                    nextLabel={"→"}
                    breakLabel={"..."}
                    pageCount={15}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    nextClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
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
