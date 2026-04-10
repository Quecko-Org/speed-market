"use client";
import React from "react";
import { Modal } from "react-bootstrap";
import Icon from "../Icon";
import { showToast } from "@/app/hooks/showToast";

export interface ShareResultsData {
  symbol?: string;
  betType?: "UP" | "DOWN";
  duration?: string;
  baselinePrice?: string;
  settlementPrice?: string;
  amount?: string;
  earned?: string;
  pnl?: string;
  result?: string;
  userName?: string;
  userImage?: string;
}

interface ShareresultsmodalProps {
  show: boolean;
  onHide: () => void;
  data?: ShareResultsData;
}

const Shareresultsmodal: React.FC<ShareresultsmodalProps> = ({
  show,
  onHide,
  data,
}) => {
  const symbol = data?.symbol ?? "BTC";
  const betType = data?.betType ?? "UP";
  const duration = data?.duration ?? "5 min";
  const baselinePrice = data?.baselinePrice ?? "—";
  const settlementPrice = data?.settlementPrice ?? "—";
  const amount = data?.amount ?? "0";
  const earned = data?.earned ?? "0";
  const pnl = data?.pnl ?? "0";
  const result = data?.result ?? "WIN";
  const userName = data?.userName ?? "SatoshiSeeker";
  const userImage = data?.userImage ?? "/importantassets/dummyrain.png";
  const isWin = result === "WIN";
  const isUp = betType === "UP";
  const slug = symbol.toLowerCase();

  const handleShare = (platform: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const ogParams = new URLSearchParams({
      symbol, betType, duration, baselinePrice, settlementPrice,
      amount, earned, pnl, result, userName,
    });
    const shareUrl = `${origin}/share?${ogParams.toString()}`;
    const text = `I just ${isWin ? "won" : "lost"} $${earned} on ${symbol}/USDT on Rain Speed Markets!`;

    const links: Record<string, string> = {
      x: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n${shareUrl}`)}`,
      mail: `mailto:?subject=${encodeURIComponent(`${isWin ? "Won" : "Lost"} on Rain Speed Markets`)}&body=${encodeURIComponent(`${text}\n${shareUrl}`)}`,
    };
    if (platform === "link") {
      try { navigator.clipboard.writeText(`${text}\n${shareUrl}`); } catch { /* fallback */ }
      showToast("success", { message: "Copied!" });
      return;
    }
    if (links[platform]) window.open(links[platform], "_blank");
  };

  return (
    <Modal className="profilemodal" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Share Results</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="claimedsucess">
          <div className="box">
            <img
              src="/modalassets/modalbg.png"
              alt="img"
              className="img-fluid image"
            />

            <div className="maintextmodal">
              <div className="parentupper">
                <div className="left">
                  <span>
                    <img
                      src={userImage}
                      alt="img"
                      className="img-fluid images"
                    />
                    {userName}
                  </span>
                </div>

                <div className="right">
                  <div className="maintimer">
                    <div className="tokenimages">
                      <div className="innertoken">
                        <img
                          src={`/tokenimages/${slug}.png`}
                          alt={symbol}
                          className="tokenimg"
                        />
                      </div>
                      <Icon name="energy" className="energyimg" />

                      <div className="innertoken">
                        <img
                          src="/tokenimages/usdt.png"
                          alt="tokenimg"
                          className="tokenimg"
                        />
                      </div>
                    </div>
                    <h4 className="timerpara">{duration}</h4>
                  </div>
                </div>
              </div>

              <div className="speedtext">
                <div className="speedleft">
                  <p className="speedpara">Result</p>

                  <div className="textparent">
                    <h4 className="wingreen" style={!isWin ? { color: "#ef4444" } : {}}>{isWin ? "Win" : "Loss"}</h4>

                    <button className="greenbtc" style={!isUp ? { background: "rgba(239,68,68,0.2)", color: "#ef4444" } : {}}>{betType} for {symbol}</button>
                  </div>
                </div>

                <div className="speedright">
                  <div className="mainimg">
                    <img
                      src="/logo.svg"
                      alt="img"
                      className="img-fluid market"
                    />
                  </div>
                </div>
              </div>

              <div className="bottomcontent">
                <div className="innermain">
                  <p>Baseline Price</p>
                  <h4>{baselinePrice}</h4>
                </div>

                <div className="innermain">
                  <p>Settlement Price</p>
                  <h4>{settlementPrice}</h4>
                </div>
                <div className="brdr"></div>

                <div className="innermain">
                  <p>Effective Amount</p>
                  <h4>${amount}</h4>
                </div>

                <div className="innermain">
                  <p>P&L</p>
                  <h4 style={{ color: Number(pnl) >= 0 ? "#70e852" : "#ef4444" }}>{Number(pnl) >= 0 ? "+" : ""}${pnl}</h4>
                </div>

                <div className="innermain">
                  <p>Amount Earned</p>
                  <h4 className="greenpara">${earned}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="sharebox">
            <p>Share with Friends</p>

            <div className="icons">
              <span onClick={() => handleShare("x")}>
               <Icon name="x" />
              </span>

              <span onClick={() => handleShare("facebook")}>
              <Icon name="facebook" />
              </span>

              <span onClick={() => handleShare("telegram")}>
              <Icon name="telegram" />
              </span>

              <span onClick={() => handleShare("whatsapp")}>
              <Icon name="whatsapp" />
              </span>

              <span onClick={() => handleShare("mail")}>
           <Icon name="mail" />
              </span>

              <span onClick={() => handleShare("link")}>
           <Icon name="link" />
              </span>
            </div>
          </div>

          <button className="close" onClick={onHide}>Close</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Shareresultsmodal;
