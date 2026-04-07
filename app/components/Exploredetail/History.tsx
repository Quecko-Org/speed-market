import React, { FC, useEffect, useState } from "react";
import Icon from "../Icon";
import ReactPaginate from "react-paginate";
import Shareresultsmodal from "../modals/Shareresultsmodal";
import { getUserHistory } from "@/app/services/userPositions";

type ModalKeys =
  | "createprofile"
  | "Shareresults"
  | "Claimprocessed"
  | "Claimsuccessfully"
  | "Sharemarket"
  | "Sharebet"
  | "withdraw"
  | "deposit";
type ModalState = Record<ModalKeys, boolean>;

interface HistoryProps {
  symbol: string | null;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return { time: "—", date: "—" };
  const d = new Date(dateStr);
  const time = d.toLocaleTimeString("en-US", { hour12: false });
  const date = d.toISOString().split("T")[0];
  return { time, date };
}

const History: FC<HistoryProps> = ({ symbol }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!symbol) return;

    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await getUserHistory(symbol);
        setHistory(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [symbol]);

  const [modals, setModals] = useState<ModalState>({
    createprofile: false,
    Shareresults: false,
    Claimprocessed: false,
    Claimsuccessfully: false,
    Sharemarket: false,
    Sharebet: false,
    withdraw: false,
    deposit: false,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected);
  };
  const openModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: true }));
  };

  const closeModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: false }));
  };

  const pageCount = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
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
              {historyLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#74728B", padding: 24 }}>
                    Loading history...
                  </td>
                </tr>
              ) : paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#74728B", padding: 24 }}>
                    No history yet
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((item: any) => {
                  const isUp = item.betType === "UP";
                  const isWon = item.result === "WIN";
                  const { time, date } = formatDate(item.createdAt);
                  return (
                    <tr key={item._id}>
                      <td>
                        <div className={`predictionmain ${isUp ? "upmain" : "downmain"}`}>
                          <span className="predictionimg">
                            <Icon name={isUp ? "up" : "down"} className={isUp ? "up" : "down"} />
                          </span>
                          <p className="predictionpara">{isUp ? "Up" : "Down"}</p>
                        </div>
                      </td>
                      <td>${Number(item.amount || 0).toFixed(2)}</td>
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
                        <button onClick={() => openModal("Shareresults")} className="sharebtn">
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

        {/* Mobile view */}
        <div className="mobileboxes d-none">
          {historyLoading ? (
            <p style={{ textAlign: "center", color: "#74728B", padding: 16 }}>Loading history...</p>
          ) : paginatedHistory.length === 0 ? (
            <p style={{ textAlign: "center", color: "#74728B", padding: 16 }}>No history yet</p>
          ) : (
            paginatedHistory.map((item: any) => {
              const isUp = item.betType === "UP";
              const isWon = item.result === "won" || item.status === "won";
              const { time, date } = formatDate(item.createdAt);
              return (
                <div className="innerbox" key={item._id}>
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
                      <h6 className="boxhead">${Number(item.amount || 0).toFixed(2)}</h6>
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
                      <button onClick={() => openModal("Shareresults")} className="sharebtn">
                        <Icon name="predictionshare" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={pageCount}
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

      <Shareresultsmodal
        show={modals.Shareresults}
        onHide={() => closeModal("Shareresults")}
      />
    </>
  );
};

export default History;
