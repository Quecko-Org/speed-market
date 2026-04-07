"use client";
import React, { FC } from "react";
import Icon from "../Icon";
import ReactPaginate from "react-paginate";

interface PredictionsTableProps {
  history: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return { time: "—", date: "—" };
  const d = new Date(dateStr);
  const time = d.toLocaleTimeString("en-US", { hour12: false });
  const date = d.toISOString().split("T")[0];
  return { time, date };
}

const PredictionsTable: FC<PredictionsTableProps> = ({ history, loading, currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (event: any) => {
    onPageChange(event.selected);
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
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#74728B", padding: 24 }}>
                    Loading predictions...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#74728B", padding: 24 }}>
                    No predictions yet
                  </td>
                </tr>
              ) : (
                history.map((item: any) => {
                  const isUp = item.betType === "UP";
                  const isWon = item.result === "WIN";
                  const { time, date } = formatDate(item.createdAt);
                  const symbol = item.cryptoSymbol ?? "—";
                  const slug = symbol.toLowerCase();

                  return (
                    <tr key={item._id}>
                      <td className="maxwidth">
                        <div className="mainpair">
                          <div className="tokenimages">
                            <div className="innertoken">
                              <img
                                src={item.imageurl ?? `/tokenimages/${slug}.png`}
                                alt={symbol}
                                className="tokenimg"
                              />
                            </div>
                            <Icon name="energy" className="energy" />
                            <div className="innertoken">
                              <img
                                src="/tokenimages/usdt.png"
                                alt="usdt"
                                className="tokenimg"
                              />
                            </div>
                          </div>
                          <h6 className="tokenname">{symbol}/USDT</h6>
                          <span className="innerspan">
                            <Icon name="timer" className="timer" />
                            {item.timeframe ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={`predictionmain ${isUp ? "upmain" : "downmain"}`}>
                          <span className="predictionimg">
                            <Icon name={isUp ? "up" : "down"} className={isUp ? "up" : "down"} />
                          </span>
                          <p className="predictionpara">{isUp ? "Up" : "Down"}</p>
                        </div>
                      </td>
                      <td>${Number(item.amount ?? 0).toFixed(2)}</td>
                      <td>
                        <p className={`resultpara ${isWon ? "won" : "lost"}`}>
                          {isWon ? "Won" : "Lost"}
                        </p>
                      </td>
                      <td>${Number(item.earned ?? item.payout ?? 0).toFixed(2)}</td>
                      <td>
                        <div className="maintime">
                          <h6 className="timehead">{time}</h6>
                          <p className="timepara">{date}</p>
                        </div>
                      </td>
                      <td>
                        <button className="sharebtn">
                          <Icon name="predictionshare" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mobileboxes d-none">
          {loading ? (
            <p style={{ textAlign: "center", color: "#74728B", padding: 16 }}>Loading predictions...</p>
          ) : history.length === 0 ? (
            <p style={{ textAlign: "center", color: "#74728B", padding: 16 }}>No predictions yet</p>
          ) : (
            history.map((item: any) => {
              const isUp = item.betType === "UP";
              const isWon = item.result === "WIN";
              const { time, date } = formatDate(item.createdAt);
              const symbol = item.cryptoSymbol ?? "—";
              const slug = symbol.toLowerCase();

              return (
                <div className="innerbox" key={item._id}>
                  <div className="innerboxmain">
                    <div className="box">
                      <p className="boxpara">Pair</p>
                      <div className="mainpair">
                        <div className="tokenimages">
                          <div className="innertoken">
                            <img
                              src={item.imageurl ?? `/tokenimages/${slug}.png`}
                              alt={symbol}
                              className="tokenimg"
                            />
                          </div>
                          <Icon name="energy" className="energy" />
                          <div className="innertoken">
                            <img
                              src="/tokenimages/usdt.png"
                              alt="usdt"
                              className="tokenimg"
                            />
                          </div>
                        </div>
                        <h6 className="tokenname">{symbol}/USDT</h6>
                        <span className="innerspan">
                          <Icon name="timer" className="timer" />
                          {item.duration ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="innerboxmain">
                    <div className="box">
                      <p className="boxpara">Prediction</p>
                      <div className={`predictionmain ${isUp ? "upmain" : "downmain"}`}>
                        <span className="predictionimg">
                          <Icon name={isUp ? "up" : "down"} className={isUp ? "up" : "down"} />
                        </span>
                        <p className="predictionpara">{isUp ? "Up" : "Down"}</p>
                      </div>
                    </div>
                    <div className="box">
                      <p className="boxpara">Amount</p>
                      <h6 className="boxhead">${Number(item.amount ?? 0).toFixed(2)}</h6>
                    </div>
                  </div>
                  <div className="innerboxmain">
                    <div className="box">
                      <p className="boxpara">Result</p>
                      <h6 className={`boxhead ${isWon ? "won" : "lost"}`}>{isWon ? "Won" : "Lost"}</h6>
                    </div>
                    <div className="box">
                      <p className="boxpara">Earned</p>
                      <h6 className="boxhead">${Number(item.earned ?? item.payout ?? 0).toFixed(2)}</h6>
                    </div>
                  </div>
                  <div className="innerboxmain">
                    <div className="box">
                      <p className="boxpara">Date & Time</p>
                      <div className="maintime">
                        <h6 className="timehead">{time}</h6>
                        <p className="timepara">{date}</p>
                      </div>
                    </div>
                    <div className="box">
                      <button className="sharebtn">
                        <Icon name="predictionshare" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={totalPages}
            forcePage={currentPage}
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
        )}
      </div>
    </>
  );
};

export default PredictionsTable;
