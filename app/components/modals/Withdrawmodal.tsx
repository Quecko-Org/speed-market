"use client";
import React, { useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import Icon from "../Icon";
import Withdrawsuccessmodal from "./Withdrawsuccessmodal";

interface WithdrawmodalProps {
  show: boolean;
  onHide: () => void;
}
type ModalKeys = "withdrawsuccess";

type ModalState = Record<ModalKeys, boolean>;
const Withdrawmodal: React.FC<WithdrawmodalProps> = ({ show, onHide }) => {
  const [modals, setModals] = useState<ModalState>({
    withdrawsuccess: false,
  });
  const openModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: true }));
  };

  const closeModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: false }));
  };
  return (
    <>
      <Modal className="withdraw" show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="withdrawcontent">
            <div className="parenttoken">
              <div className="lefttoken">
                <p className="tokenpar">Token</p>

                <span>
                  <img
                    src="/tokenimages/usdt.png"
                    alt="alt"
                    className="img-fluid img"
                  />
                  USDT
                </span>
              </div>

              <div className="righttoken">
                <div className="drop">
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                      <div className="parent">
                        <p>Chain</p>

                        <div className="inner">
                          <img
                            src="/tokenimages/arbitrum.svg"
                            alt="img"
                            className="img-fluid arb"
                          />
                          <h6>Arbitrum</h6>
                          <Icon name="droparrowsmall" />
                        </div>
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>

                      <Dropdown.Item href="#/action-2">
                        Another action
                      </Dropdown.Item>

                      <Dropdown.Item href="#/action-3">
                        Something else
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>

            <div className="maininputss">
              <div className="innerinput">
                <p>Address</p>

                <input type="text" placeholder="0x..." />
              </div>

              <div className="innerinput">
                <div className="parentmaintext">
                  <p>Amount</p>

                  <h6>
                    Balance
                    <img
                      src="/tokenimages/usdt.png"
                      alt="img"
                      className="img-fluid usd"
                    />
                    <span>$2,432.54</span>
                  </h6>
                </div>

                <div className="parentmaininput">
                  <input type="text" placeholder="0.00" />
                  <button className="max">MAX</button>
                </div>
              </div>
            </div>

            <div className="buttonlast">
              <button className="close">Close</button>

              <button
                onClick={() => {
                  onHide();
                  openModal("withdrawsuccess");
                }}
                className="withdraw"
              >
                Withdraw
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Withdrawsuccessmodal
        show={modals.withdrawsuccess}
        onHide={() => closeModal("withdrawsuccess")}
      />
    </>
  );
};

export default Withdrawmodal;
