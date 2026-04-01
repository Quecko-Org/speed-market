"use client";
import React, { FC } from "react";
import Icon from "../Icon";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import Depositmodal from "../modals/Depositmodal";
import Withdrawmodal from "../modals/Withdrawmodal";
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
const Profile: FC = () => {
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

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected);
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
            <div className="upperinner">
              <div className="profilemain">
                <div className="innerprofile">
                  <div className="profileimg">
                    <img
                      src="/dummyassets/dummyuser.png"
                      alt="innerimg"
                      className="innerimg"
                    />
                  </div>
                  <div className="profiletexts">
                    <h6 className="upperhead">Felix Hogan</h6>
                    <div className="smartmain">
                      <h6 className="smartpara">Smart Wallet</h6>
                      <h5 className="walletpara">0x1256...5911xa</h5>
                      <button className="copybtn">
                        <Icon name="copy" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="profilebtns">
                  <button className="editbtn">Edit Profile</button>
                  <button className="sharebtn">
                    Share Profile
                    <Icon name="sharewhite" />
                  </button>
                </div>
              </div>
            </div>
            <div className="upperinner">
              <div className="portfoliomain">
                <p className="portfoliopara">Portfolio</p>
                <h6 className="dollarhead">$7,120.99</h6>
                <div className="tokensmain">
                  <div className="tokeninner">
                    <div className="tokenimg">
                      <img
                        src="/tokenimages/usdt.png"
                        alt="innerimg"
                        className="innerimg"
                      />
                    </div>
                    <h6 className="quantityhead">3,456.78</h6>
                    <p className="tokenpara">USDT</p>
                  </div>
                  <div className="tokeninner">
                    <div className="tokenimg">
                      <img
                        src="/tokenimages/eth.png"
                        alt="innerimg"
                        className="innerimg"
                      />
                    </div>
                    <h6 className="quantityhead">1.43556</h6>
                    <p className="tokenpara">ETH</p>
                  </div>
                </div>
                <div className="fundsbtns">
                  <button onClick={()=>{
                    openModal("deposit");
                  }} className="depositbtn">Deposit</button>
                  <button onClick={()=>{
                    openModal("withdraw");
                  }} className="withdrawbtn">Withdraw</button>
                </div>
              </div>
            </div>
          </div>
          <div className="middetails">
            <div className="innerdetail">
              <p className="detailpara">Open Interest</p>
              <h6 className="detailhead">$16.23K</h6>
            </div>
            <div className="innerdetail">
              <p className="detailpara">Live Markets</p>
              <h6 className="detailhead">125</h6>
            </div>
            <div className="innerdetail">
              <p className="detailpara">Total Invested</p>
              <h6 className="detailhead">$36.23K</h6>
            </div>
            <div className="innerdetail">
              <p className="detailpara">Average PnL</p>
              <h6 className="detailhead green">+$2,059</h6>
            </div>
          </div>
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
    </>
  );
};

export default Profile;
