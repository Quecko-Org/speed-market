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
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #1B1C31 0%, #2C2D42 100%)", fontFamily: "sans-serif", padding: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 40, width: 1000, gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#EC8711", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: 24, fontWeight: 700 }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: "#fff", fontSize: 24, fontWeight: 600 }}>{userName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>{symbol}/USDT</span>
              <span style={{ color: "#74728B", fontSize: 18, background: "rgba(255,255,255,0.05)", padding: "4px 12px", borderRadius: 20 }}>{duration}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: isWin ? "#70E852" : "#ef4444" }}>{isWin ? "WIN" : "LOSS"}</span>
            <span style={{ background: isUp ? "rgba(112,232,82,0.2)" : "rgba(239,68,68,0.2)", color: isUp ? "#70E852" : "#ef4444", padding: "10px 24px", borderRadius: 50, fontSize: 20, fontWeight: 700 }}>{betType} for {symbol}</span>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 20 }}>
              <span style={{ color: "#74728B", fontSize: 14 }}>Baseline Price</span>
              <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>{baselinePrice}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 20 }}>
              <span style={{ color: "#74728B", fontSize: 14 }}>Settlement Price</span>
              <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>{settlementPrice}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 20 }}>
              <span style={{ color: "#74728B", fontSize: 14 }}>Effective Amount</span>
              <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>${amount}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 20 }}>
              <span style={{ color: "#74728B", fontSize: 14 }}>P&L</span>
              <span style={{ color: Number(pnl) >= 0 ? "#70E852" : "#ef4444", fontSize: 24, fontWeight: 700 }}>{Number(pnl) >= 0 ? "+" : ""}${pnl}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 20 }}>
              <span style={{ color: "#74728B", fontSize: 14 }}>Amount Earned</span>
              <span style={{ color: "#70E852", fontSize: 24, fontWeight: 700 }}>${earned}</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <span style={{ color: "#EC8711", fontSize: 22, fontWeight: 700 }}>Rain Speed Markets</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
