"use client";
import React, { FC, useState } from "react";
import Icon from "../Icon";
import ReactPaginate from "react-paginate";

const PredictionsTable: FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      <h6 className="predictionhead">My Predictions</h6>
      <div className="predictiontable">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Pair</th>
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
                <td className="maxwidth">
                  <div className="mainpair">
                    <div className="tokenimages">
                      <div className="innertoken">
                        <img
                          src="/tokenimages/btc.png"
                          alt="tokenimg"
                          className="tokenimg"
                        />
                      </div>
                      <Icon name="energy" className="energy" />
                      <div className="innertoken">
                        <img
                          src="/tokenimages/usdt.png"
                          alt="tokenimg"
                          className="tokenimg"
                        />
                      </div>
                    </div>
                    <h6 className="tokenname">BTC/USDT</h6>
                    <span className="innerspan">
                      <Icon name="timer" className="timer" />
                      15 MIN
                    </span>
                  </div>
                </td>
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
                <td className="maxwidth">
                  <div className="mainpair">
                    <div className="tokenimages">
                      <div className="innertoken">
                        <img
                          src="/tokenimages/btc.png"
                          alt="tokenimg"
                          className="tokenimg"
                        />
                      </div>
                      <Icon name="energy" className="energy" />
                      <div className="innertoken">
                        <img
                          src="/tokenimages/usdt.png"
                          alt="tokenimg"
                          className="tokenimg"
                        />
                      </div>
                    </div>
                    <h6 className="tokenname">BTC/USDT</h6>
                    <span className="innerspan">
                      <Icon name="timer" className="timer" />
                      15 MIN
                    </span>
                  </div>
                </td>
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

        {/* Mobile Cards */}
        <div className="mobileboxes d-none">
          <div className="innerbox">
            <div className="innerboxmain">
              <div className="box">
                <p className="boxpara">Pair</p>
                <div className="mainpair">
                  <div className="tokenimages">
                    <div className="innertoken">
                      <img
                        src="/tokenimages/btc.png"
                        alt="tokenimg"
                        className="tokenimg"
                      />
                    </div>
                    <Icon name="energy" className="energy" />
                    <div className="innertoken">
                      <img
                        src="/tokenimages/usdt.png"
                        alt="tokenimg"
                        className="tokenimg"
                      />
                    </div>
                  </div>
                  <h6 className="tokenname">BTC/USDT</h6>
                  <span className="innerspan">
                    <Icon name="timer" className="timer" />
                    15 MIN
                  </span>
                </div>
              </div>
            </div>
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
                <p className="boxpara">Pair</p>
                <div className="mainpair">
                  <div className="tokenimages">
                    <div className="innertoken">
                      <img
                        src="/tokenimages/btc.png"
                        alt="tokenimg"
                        className="tokenimg"
                      />
                    </div>
                    <Icon name="energy" className="energy" />
                    <div className="innertoken">
                      <img
                        src="/tokenimages/usdt.png"
                        alt="tokenimg"
                        className="tokenimg"
                      />
                    </div>
                  </div>
                  <h6 className="tokenname">BTC/USDT</h6>
                  <span className="innerspan">
                    <Icon name="timer" className="timer" />
                    15 MIN
                  </span>
                </div>
              </div>
            </div>
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
    </>
  );
};

export default PredictionsTable;