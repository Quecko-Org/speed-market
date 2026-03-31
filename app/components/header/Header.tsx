"use client";
import React, { FC, useState } from "react";
import { Dropdown, Offcanvas } from "react-bootstrap";
import Icon from "../Icon";
import Createprofilemodal from "../modals/Createprofilemodal";
import Shareresultsmodal from "../modals/Shareresultsmodal";
import { showToast } from "@/app/hooks/showToast";
import Claimprocessedmodal from "../modals/Claimprocessedmodal";
import Claimedsuccessfullymodal from "../modals/Claimedsuccessfullymodal";
import Sharemarketmodal from "../modals/Sharemarketmodal";
import Sharebetmodal from "../modals/Sharebetmodal";
import Withdrawmodal from "../modals/Withdrawmodal";
import Depositmodal from "../modals/Depositmodal";

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
              <button className="yellowbtn">Deposit</button>
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
                      onClick={() => openModal("deposit")}
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
                  <div className="lowerdrop">
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
                  </div>
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
          <div className="lowerlink">
            <div className="linkimg">
              <Icon name="profilelink" className="profilelink" />
            </div>
            <p className="linkpara">Profile</p>
          </div>
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

      <Createprofilemodal
        show={modals.createprofile}
        onHide={() => closeModal("createprofile")}
      />
      <Shareresultsmodal
        show={modals.Shareresults}
        onHide={() => closeModal("Shareresults")}
      />
      <Claimprocessedmodal
        show={modals.Claimprocessed}
        onHide={() => closeModal("Claimprocessed")}
      />
            <Claimedsuccessfullymodal
        show={modals.Claimsuccessfully}
        onHide={() => closeModal("Claimsuccessfully")}
      />
                  <Sharemarketmodal
        show={modals.Sharemarket}
        onHide={() => closeModal("Sharemarket")}
      />
                       <Sharebetmodal
        show={modals.Sharebet}
        onHide={() => closeModal("Sharebet")}
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
