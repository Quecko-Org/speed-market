"use client";
import React, { FC, useState } from "react";
import { Dropdown, Offcanvas } from "react-bootstrap";
import Icon from "../Icon";
import Createprofilemodal from "../modals/Createprofilemodal";
import Withdrawmodal from "../modals/Withdrawmodal";
import Depositmodal from "../modals/Depositmodal";
import Link from "next/link";

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

const Header: FC = () => {
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
  const [open, setOpen] = useState(false);

  const [showNav, setShowNav] = useState(false);

  const handleCloseNav = () => setShowNav(false);
  const handleShowNav = () => setShowNav(true);

  const [showConnect, setShowConnect] = useState(false);

  const handleCloseConnect = () => setShowConnect(false);
  const handleShowConnect = () => setShowConnect(true);

  const openModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: true }));
  };

  const closeModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: false }));
  };
  return (
    <>
      <section className="mainheader">
        <div className="custom-container">
          <div className="innerheader">
            <a href="/" className="mainlogo">
              <img src="/logo.svg" alt="logoimg" className="logoimg" />
            </a>
            <div className="navbtns">
              {/* <button
                onClick={() => openModal("deposit")}
                className="yellowbtn"
              >
                Deposit
              </button> */}
              <button onClick={handleShowConnect} className="yellowbtnmbl d-none">
                Connect Wallet
              </button>
              <Dropdown className="connectbtn" align="end">
                <Dropdown.Toggle
                  variant="success"
                  className="yellowbtn"
                  id="dropdown-basic"
                >
                  Connect Wallet
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <h6 className="drophead">Connect Wallet</h6>
                  <div className="mainwallets">
                    <div
                      onClick={() => openModal("createprofile")}
                      className="innerwallet"
                    >
                      <img
                        src="/importantassets/metamask.svg"
                        alt="walletimg"
                        className="walletimg"
                      />
                      <p className="walletpara">MetaMask</p>
                    </div>
                    <div
                      onClick={() => openModal("createprofile")}
                      className="innerwallet"
                    >
                      <img
                        src="/importantassets/walletconnect.svg"
                        alt="walletimg"
                        className="walletimg"
                      />
                      <p className="walletpara">WalletConnect</p>
                    </div>
                    <div
                      onClick={() => openModal("createprofile")}
                      className="innerwallet"
                    >
                      <img
                        src="/importantassets/coinbase.svg"
                        alt="walletimg"
                        className="walletimg"
                      />
                      <p className="walletpara">Coinbase Wallet</p>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                className="profilebtn"
                align="end"
                show={open}
                onToggle={(isOpen) => setOpen(isOpen)}
              >
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <div className="profileimg">
                    <img
                      src="/dummyassets/dummyuser.png"
                      alt="innerprofileimg"
                      className="innerprofileimg"
                    />
                  </div>
                  $50.32K
                  <Icon
                    name="droparrow"
                    className={`arrow ${open ? "rotate" : ""}`}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Link href="/profile" className="lowerdrop">
                    <div className="lowerlink">
                      <div className="linkimg">
                        <Icon name="profilelink" className="profilelink" />
                      </div>
                      <p className="linkpara">Profile</p>
                    </div>

                    <div className="lowerlink redlink">
                      <div className="linkimg">
                        <Icon name="logouticon" className="logouticon" />
                      </div>
                      <p className="linkpara">Logout</p>
                    </div>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
              <button onClick={handleShowNav} className="menubtn d-none">
                <Icon name="menu" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Offcanvas show={showNav} onHide={handleCloseNav} className="mobilenav">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src="/logo.svg" alt="logoimg" className="logoimg" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Link href="/profile" className="lowerlink">
            <div className="linkimg">
              <Icon name="profilelink" className="profilelink" />
            </div>
            <p className="linkpara">Profile</p>
          </Link>
        </Offcanvas.Body>
        <div className="bottombtn">
          <button className="logoutbtn">
            <span className="logoutimg">
              <Icon name="logoutwhite" />
            </span>
            Logout
          </button>
        </div>
      </Offcanvas>

      <Offcanvas
        show={showConnect}
        onHide={handleCloseConnect}
        className="mobilenav"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src="/logo.svg" alt="logoimg" className="logoimg" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <div className="mainwallets">
                    <div
                      onClick={() => openModal("createprofile")}
                      className="innerwallet"
                    >
                      <img
                        src="/importantassets/metamask.svg"
                        alt="walletimg"
                        className="walletimg"
                      />
                      <p className="walletpara">MetaMask</p>
                    </div>
                    <div
                      onClick={() => openModal("createprofile")}
                      className="innerwallet"
                    >
                      <img
                        src="/importantassets/walletconnect.svg"
                        alt="walletimg"
                        className="walletimg"
                      />
                      <p className="walletpara">WalletConnect</p>
                    </div>
                    <div
                      onClick={() => openModal("createprofile")}
                      className="innerwallet"
                    >
                      <img
                        src="/importantassets/coinbase.svg"
                        alt="walletimg"
                        className="walletimg"
                      />
                      <p className="walletpara">Coinbase Wallet</p>
                    </div>
                  </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Createprofilemodal
        show={modals.createprofile}
        onHide={() => closeModal("createprofile")}
      />
      <Withdrawmodal
        show={modals.withdraw}
        onHide={() => closeModal("withdraw")}
      />
      <Depositmodal
        show={modals.deposit}
        onHide={() => closeModal("deposit")}
      />
    </>
  );
};

export default Header;
