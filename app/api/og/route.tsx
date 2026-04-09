import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const BASE_URL = "https://dev-speedmarket.rain.one";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const symbol = p.get("symbol") ?? "BTC";
  const betType = p.get("betType") ?? "UP";
  const duration = p.get("duration") ?? "5 min";
  const baselinePrice = p.get("baselinePrice") ?? "—";
  const settlementPrice = p.get("settlementPrice") ?? "—";
  const amount = p.get("amount") ?? "0";
  const earned = p.get("earned") ?? "0";
  const pnl = p.get("pnl") ?? "0";
  const result = p.get("result") ?? "WIN";
  const userName = p.get("userName") ?? "User";
  const isWin = result === "WIN";
  const isUp = betType === "UP";
  const slug = symbol.toLowerCase();

  const tokenImg = `${BASE_URL}/tokenimages/${slug}.png`;
  const usdtImg = `${BASE_URL}/tokenimages/usdt.png`;
  const logoImg = `${BASE_URL}/logo.svg`;
  const bgImg = `${BASE_URL}/modalassets/modalbg.png`;

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        background: "#1B1C31", fontFamily: "sans-serif", padding: 30,
      }}>
        {/* Card */}
        <div style={{
          display: "flex", flexDirection: "column", width: 1050,
          borderRadius: 20, overflow: "hidden", position: "relative",
        }}>
          {/* Background image */}
          <img src={bgImg} alt="" style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            objectFit: "cover",
          }} />

          {/* Content overlay */}
          <div style={{
            display: "flex", flexDirection: "column", padding: "36px 40px",
            position: "relative", gap: 20,
          }}>
            {/* Header: User + Token pair */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", background: "#EC8711",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#000", fontSize: 20, fontWeight: 700,
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: "#fff", fontSize: 20, fontWeight: 600 }}>{userName}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={tokenImg} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                <img src={usdtImg} alt="" style={{ width: 28, height: 28, borderRadius: "50%", marginLeft: -8 }} />
                <span style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginLeft: 6 }}>{duration}</span>
              </div>
            </div>

            {/* Result row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ color: "#74728B", fontSize: 14 }}>Result</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 42, fontWeight: 800, color: isWin ? "#70E852" : "#ef4444" }}>
                    {isWin ? "Win" : "Loss"}
                  </span>
                  <span style={{
                    background: isUp ? "rgba(112,232,82,0.2)" : "rgba(239,68,68,0.2)",
                    color: isUp ? "#70E852" : "#ef4444",
                    padding: "8px 18px", borderRadius: 50, fontSize: 16, fontWeight: 600,
                  }}>
                    {betType} for {symbol}
                  </span>
                </div>
              </div>
              <img src={logoImg} alt="" style={{ height: 40 }} />
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 20,
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <span style={{ color: "#74728B", fontSize: 13 }}>Baseline Price</span>
                <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>{baselinePrice}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <span style={{ color: "#74728B", fontSize: 13 }}>Settlement Price</span>
                <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>{settlementPrice}</span>
              </div>
            </div>

            <div style={{
              display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 16,
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <span style={{ color: "#74728B", fontSize: 13 }}>Effective Amount</span>
                <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>${amount}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <span style={{ color: "#74728B", fontSize: 13 }}>P&L</span>
                <span style={{ color: Number(pnl) >= 0 ? "#70E852" : "#ef4444", fontSize: 20, fontWeight: 700 }}>
                  {Number(pnl) >= 0 ? "+" : ""}${pnl}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <span style={{ color: "#74728B", fontSize: 13 }}>Amount Earned</span>
                <span style={{ color: "#70E852", fontSize: 20, fontWeight: 700 }}>${earned}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
