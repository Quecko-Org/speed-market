import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

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

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(145deg, #1e1f36 0%, #2a2b44 50%, #1e1f36 100%)", fontFamily: "sans-serif", padding: 30 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 1050, borderRadius: 24, background: "linear-gradient(160deg, rgba(44,45,66,0.95) 0%, rgba(27,28,49,0.98) 100%)", border: "1px solid rgba(255,255,255,0.08)", padding: "36px 44px", gap: 22 }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #EC8711, #E45F14)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 600 }}>{userName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#fff", fontSize: 26, fontWeight: 700 }}>{symbol}/USDT</span>
              <span style={{ color: "#9a9ab0", fontSize: 16, background: "rgba(255,255,255,0.06)", padding: "6px 14px", borderRadius: 20 }}>{duration}</span>
            </div>
          </div>

          {/* Result */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: "#74728B", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Result</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: isWin ? "#70E852" : "#ef4444", lineHeight: 1 }}>
                  {isWin ? "Win" : "Loss"}
                </span>
                <span style={{ background: isUp ? "rgba(112,232,82,0.15)" : "rgba(239,68,68,0.15)", color: isUp ? "#70E852" : "#ef4444", padding: "8px 20px", borderRadius: 50, fontSize: 16, fontWeight: 700, textTransform: "uppercase" }}>
                  {betType} for {symbol}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.06)" }} />

          {/* Stats Row 1 */}
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "16px 20px" }}>
              <span style={{ color: "#74728B", fontSize: 13 }}>Baseline Price</span>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{baselinePrice}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "16px 20px" }}>
              <span style={{ color: "#74728B", fontSize: 13 }}>Settlement Price</span>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{settlementPrice}</span>
            </div>
          </div>

          {/* Stats Row 2 */}
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "16px 20px" }}>
              <span style={{ color: "#74728B", fontSize: 13 }}>Effective Amount</span>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>${amount}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "16px 20px" }}>
              <span style={{ color: "#74728B", fontSize: 13 }}>P&L</span>
              <span style={{ color: Number(pnl) >= 0 ? "#70E852" : "#ef4444", fontSize: 22, fontWeight: 700 }}>
                {Number(pnl) >= 0 ? "+" : ""}${pnl}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "16px 20px" }}>
              <span style={{ color: "#74728B", fontSize: 13 }}>Amount Earned</span>
              <span style={{ color: "#70E852", fontSize: 22, fontWeight: 700 }}>${earned}</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <span style={{ color: "#EC8711", fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>Rain Speed Markets</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
