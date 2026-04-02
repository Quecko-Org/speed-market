import React, { FC, useState } from "react";
import Icon from "../Icon";
import Claimprocessedmodal from "../modals/Claimprocessedmodal";
import Shareresultsmodal from "../modals/Shareresultsmodal";
import Sharebetmodal from "../modals/Sharebetmodal";
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
const Positiontable: FC = () => {
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

  const openModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: true }));
  };

  const closeModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: false }));
  };
  return (
    <>
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
                    <button
                      onClick={() => {
                        openModal("Sharebet");
                      }}
                      className="sharebtn"
                    >
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
                    <button
                      onClick={() => {
                        openModal("Claimprocessed");
                      }}
                      className="claimbtn"
                    >
                      Claim
                    </button>
                    <button
                      onClick={() => {
                        openModal("Sharebet");
                      }}
                      className="sharebtn"
                    >
                      <Icon name="predictionshare" />
                    </button>
                  </div>
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
                <p className="boxpara">Baseline value and time</p>
                <div className="maintime">
                  <h6 className="timehead">13:26:30</h6>
                  <p className="timepara">2025-12-15 13:26:30</p>
                </div>
              </div>
            </div>
            <div className="innerboxmain">
              <div className="box">
                <p className="boxpara">Settlement Price</p>
                <h6 className="boxhead">$92,300.56</h6>
              </div>
              <div className="box">
                <div className="tablebuttons">
                  <button className="timerbtn">2m 49s</button>
                  <button
                    onClick={() => {
                      openModal("Sharebet");
                    }}
                    className="sharebtn"
                  >
                    <Icon name="predictionshare" />
                  </button>
                </div>
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
                <p className="boxpara">Baseline value and time</p>
                <div className="maintime">
                  <h6 className="timehead">13:26:30</h6>
                  <p className="timepara">2025-12-15 13:26:30</p>
                </div>
              </div>
            </div>
            <div className="innerboxmain">
              <div className="box">
                <p className="boxpara">Settlement Price</p>
                <h6 className="boxhead">$92,300.56</h6>
              </div>
              <div className="box">
                <div className="tablebuttons">
                  <button
                    onClick={() => {
                      openModal("Claimprocessed");
                    }}
                    className="claimbtn"
                  >
                    Claim
                  </button>
                  <button
                    onClick={() => {
                      openModal("Sharebet");
                    }}
                    className="sharebtn"
                  >
                    <Icon name="predictionshare" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Claimprocessedmodal
        show={modals.Claimprocessed}
        onHide={() => closeModal("Claimprocessed")}
      />
      <Sharebetmodal
        show={modals.Sharebet}
        onHide={() => closeModal("Sharebet")}
      />
    </>
  );
};

export default Positiontable;
