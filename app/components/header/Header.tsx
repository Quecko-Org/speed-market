"use client";
import { FC, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Dropdown, Offcanvas } from "react-bootstrap";
import Icon from "../Icon";
import Createprofilemodal from "../modals/Createprofilemodal";
import Withdrawmodal from "../modals/Withdrawmodal";
import Depositmodal from "../modals/Depositmodal";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { userSmartAccount, userProfileData } from "@/app/store/atoms";
import { useWalletContext } from "@/app/context/WalletContext";
import { useWalletList } from "@/app/hooks/useWalletList";
import { getWalletImage, getFormattedAddress } from "@/app/utils/helpers";
import { toast } from "react-toastify";

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
  const {
    isWalletConnected,
    isLoading,
    loadingStep,
    walletAddress,
    connectWallet,
    disconnectWallet,
  } = useWalletContext();

  const smartAccount = useAtomValue(userSmartAccount);
  const userProfile = useAtomValue(userProfileData);

  const wallets = useWalletList();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  const handleWalletClick = (wallet: (typeof wallets)[number]) => {
    if (wallet.isAvailable && wallet.connector) {
      connectWallet(wallet.connector);
      handleCloseNav();
    } else {
      toast.warning(`Please install ${wallet.name} extension first.`);
    }
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    disconnectWallet();
    setOpen(false);
    handleCloseNav();
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <>
      {isLoading && (
        <div className="wallet-loader-overlay">
          <div className="wallet-loader-spinner" />
          {loadingStep && <p className="wallet-loader-text">{loadingStep}</p>}
        </div>
      )}

      <section className="mainheader">
        <div className="custom-container">
          <div className="innerheader">
            <a href="/" className="mainlogo">
              <img src="/logo.svg" alt="logoimg" className="logoimg" />
            </a>
            <div className="navbtns">
              {!mounted || !isWalletConnected ? (
                <>
                  {/* Desktop only — dropdown connect */}
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
                        {wallets.map((wallet) => (
                          <div
                            key={wallet.name}
                            onClick={() => handleWalletClick(wallet)}
                            className={`innerwallet ${!wallet.isAvailable ? "disabled-wallet" : ""
                              }`}
                          >
                            {getWalletImage(wallet.name) && (
                              <img
                                src={getWalletImage(wallet.name)!}
                                alt="walletimg"
                                className="walletimg"
                              />
                            )}
                            <p className="walletpara">{wallet.name}</p>
                          </div>
                        ))}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Dropdown
                  className="profilebtn"
                  align="end"
                  show={open}
                  onToggle={(isOpen) => setOpen(isOpen)}
                >
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    <div className="profileimg">
                      <img
                        src={userProfile?.profileImage || "/dummyassets/dummyuser.png"}
                        alt="innerprofileimg"
                        className="innerprofileimg"
                      />
                    </div>
                    {userProfile?.displayName
                      ? userProfile.displayName.length > 10
                        ? userProfile.displayName.slice(0, 10) + "..."
                        : userProfile.displayName
                      : smartAccount
                        ? getFormattedAddress(smartAccount)
                        : walletAddress
                          ? getFormattedAddress(walletAddress)
                          : ""}
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
                    </Link>
                    <div className="lowerdrop" onClick={handleLogout}>
                      <div className="lowerlink redlink">
                        <div className="linkimg">
                          <Icon name="logouticon" className="logouticon" />
                        </div>
                        <p className="linkpara">Logout</p>
                      </div>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              )}

              {/* Mobile menu button — always visible on mobile */}
              <button onClick={handleShowNav} className="menubtn d-none">
                <Icon name="menu" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile offcanvas — wallet connect + profile + logout all in one */}
      <Offcanvas show={showNav} onHide={handleCloseNav} className="mobilenav">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src="/logo.svg" alt="logoimg" className="logoimg" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {mounted && isWalletConnected ? (
            <Link href="/profile" className="lowerlink" onClick={handleCloseNav}>
              <div className="linkimg">
                <Icon name="profilelink" className="profilelink" />
              </div>
              <p className="linkpara">Profile</p>
            </Link>
          ) : (
            <div className="mainwallets">
              {wallets
                .filter(
                  (w) =>
                    w.name === "Coinbase Wallet" || w.name === "WalletConnect"
                )
                .map((wallet) => (
                  <div
                    key={wallet.name}
                    onClick={() => handleWalletClick(wallet)}
                    className={`innerwallet ${!wallet.isAvailable ? "disabled-wallet" : ""
                      }`}
                  >
                    {getWalletImage(wallet.name) && (
                      <img
                        src={getWalletImage(wallet.name)!}
                        alt="walletimg"
                        className="walletimg"
                      />
                    )}
                    <p className="walletpara">{wallet.name}</p>
                  </div>
                ))}
            </div>
          )}
        </Offcanvas.Body>
        <div className="bottombtn">
          {mounted && isWalletConnected && (
            <button className="logoutbtn" onClick={handleLogout}>
              <span className="logoutimg">
                <Icon name="logoutwhite" />
              </span>
              Logout
            </button>
          )}
        </div>
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
