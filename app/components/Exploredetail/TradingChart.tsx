"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

// --- Types ---
interface PricePoint {
  time: number;
  price: number;
}

interface TooltipData {
  x: number;
  y: number;
  time: number;
  price: number;
}

// --- Utility functions ---
function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m}${suffix}`;
}

function formatPrice(p: number): string {
  return `$${p.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
}

function formatPriceFull(p: number): string {
  return `$${p.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
}

function formatTimeFull(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// --- Generate realistic price data ---
function generateInitialData(): PricePoint[] {
  const now = Date.now();
  const points: PricePoint[] = [];
  const startTime = now - 60 * 60 * 1000; // 1 hour ago
  let price = 90500;

  for (let i = 0; i < 360; i++) {
    const t = startTime + i * (60000 / 6);
    const volatility = (Math.random() - 0.48) * 120;
    const drift = Math.sin(i / 40) * 300;
    price += volatility;
    price = Math.max(84000, Math.min(94000, price));
    points.push({ time: t, price: price + drift });
  }

  return points;
}

// --- Main Component ---
export default function TradingChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const [data, setData] = useState<PricePoint[]>(generateInitialData);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 500 });

  // Chart config
  const PADDING = { top: 20, right: 100, bottom: 50, left: 20 };

  // Price boundaries from data
  const { minPrice, maxPrice, currentPrice, openPrice, vwap } = useMemo(() => {
    if (data.length === 0)
      return { minPrice: 84000, maxPrice: 94000, currentPrice: 90000, openPrice: 90000, vwap: 90300 };
    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;
    return {
      minPrice: min - range * 0.3,
      maxPrice: max + range * 0.3,
      currentPrice: data[data.length - 1].price,
      openPrice: data[0].price,
      vwap: prices.reduce((a, b) => a + b, 0) / prices.length,
    };
  }, [data]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.floor(width), height: Math.floor(height) });
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const volatility = (Math.random() - 0.48) * 80;
        const newPrice = Math.max(84000, Math.min(94000, last.price + volatility));
        const newPoint: PricePoint = { time: Date.now(), price: newPrice };
        const cutoff = Date.now() - 65 * 60 * 1000;
        return [...prev.filter((p) => p.time > cutoff), newPoint];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Coordinate mapping
  const mapX = useCallback(
    (time: number) => {
      const times = data.map((d) => d.time);
      const minT = Math.min(...times);
      const maxT = Math.max(...times);
      const range = maxT - minT || 1;
      return PADDING.left + ((time - minT) / range) * (dimensions.width - PADDING.left - PADDING.right);
    },
    [data, dimensions.width]
  );

  const mapY = useCallback(
    (price: number) => {
      const range = maxPrice - minPrice || 1;
      return PADDING.top + (1 - (price - minPrice) / range) * (dimensions.height - PADDING.top - PADDING.bottom);
    },
    [minPrice, maxPrice, dimensions.height]
  );

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    cancelAnimationFrame(animFrameRef.current);

    const draw = () => {
      const W = dimensions.width;
      const H = dimensions.height;

      // Background
      ctx.clearRect(0, 0, W, H);
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#1B1C31");
      bgGrad.addColorStop(1, "#2C2D42");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Grid lines (horizontal)
      const priceRange = maxPrice - minPrice;
      const priceStep = Math.pow(10, Math.floor(Math.log10(priceRange / 5)));
      const gridStep = priceStep * Math.ceil((priceRange / 5) / priceStep);
      const startPrice = Math.ceil(minPrice / gridStep) * gridStep;

      ctx.strokeStyle = "#312F47";
      ctx.lineWidth = 1;
      ctx.font = "12px 'SF Mono'";
      ctx.fillStyle = "#74728B";
      ctx.textAlign = "right";

      for (let p = startPrice; p <= maxPrice; p += gridStep) {
        const y = Math.round(mapY(p)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(PADDING.left, y);
        ctx.lineTo(W - PADDING.right, y);
        ctx.stroke();
        ctx.fillText(formatPrice(p), W - 8, y + 4);
      }

      // Time labels (vertical grid)
      const times = data.map((d) => d.time);
      const minT = Math.min(...times);
      const maxT = Math.max(...times);
      const timeRange = maxT - minT;
      const timeStep = 10 * 60 * 1000; // 10 min
      const startT = Math.ceil(minT / timeStep) * timeStep;

      ctx.textAlign = "center";
      ctx.fillStyle = "#74728B";

      for (let t = startT; t <= maxT; t += timeStep) {
        const x = Math.round(mapX(t)) + 0.5;
        ctx.strokeStyle = "rgba(0, 0, 0, 0)";
        ctx.beginPath();
        ctx.moveTo(x, PADDING.top);
        ctx.lineTo(x, H - PADDING.bottom);
        ctx.stroke();
        ctx.fillText(formatTime(t), x, H - PADDING.bottom + 25);
      }

      // VWAP dashed line (green)
      const vwapY = mapY(vwap);
      ctx.strokeStyle = "#70E852";
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(PADDING.left, vwapY);
      ctx.lineTo(W - PADDING.right, vwapY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Open price dashed line (orange dim)
      const openY = mapY(openPrice);
      ctx.strokeStyle = "#E45F14 ";
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(PADDING.left, openY);
      ctx.lineTo(W - PADDING.right, openY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Price line (orange)
      ctx.strokeStyle = "#EC8711";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();

      for (let i = 0; i < data.length; i++) {
        const x = mapX(data[i].time);
        const y = mapY(data[i].price);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Gradient fill under the line
      const gradPath = ctx.createLinearGradient(0, PADDING.top, 0, H - PADDING.bottom);
      gradPath.addColorStop(0, "rgba(255,154,46,0)");
      gradPath.addColorStop(1, "rgba(255,154,46,0.0)");

      ctx.fillStyle = gradPath;
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = mapX(data[i].time);
        const y = mapY(data[i].price);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(mapX(data[data.length - 1].time), H - PADDING.bottom);
      ctx.lineTo(mapX(data[0].time), H - PADDING.bottom);
      ctx.closePath();
      ctx.fill();

      // Current price dot
      const lastPoint = data[data.length - 1];
      const dotX = mapX(lastPoint.time);
      const dotY = mapY(lastPoint.price);

      // Glow
      const glow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 14);
      glow.addColorStop(0, "rgba(236, 20, 20, 0)");
      glow.addColorStop(1, "rgba(255,154,46,0.0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Dot
      ctx.fillStyle = "#EC8711";
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#2e1a1a";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Current price label (orange badge)
      const priceLabel = formatPriceFull(currentPrice);
      const timeLabel = formatTimeFull(Date.now());

      ctx.font = "bold 12px 'SF Mono', 'Fira Code', monospace";
      const priceLabelW = ctx.measureText(priceLabel).width + 14;
      const timeLabelW = ctx.measureText(timeLabel).width + 14;

      const badgeX = W - PADDING.right + 4;
      const badgeY = dotY - 10;

      // Price badge
      ctx.fillStyle = "linear-gradient(90deg, #EC8711 0%, #E45F14 100%)";
      roundRect(ctx, badgeX, badgeY, priceLabelW, 20, 3);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.fillText(priceLabel, badgeX + 7, badgeY + 14);

      // VWAP label (green badge)
      const vwapLabel = formatPriceFull(vwap);
      const vwapLabelW = ctx.measureText(vwapLabel).width + 14;
      const vwapBadgeY = vwapY - 10;

      ctx.fillStyle = "#70E852";
      roundRect(ctx, badgeX, vwapBadgeY, vwapLabelW, 20, 3);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.fillText(vwapLabel, badgeX + 7, vwapBadgeY + 14);

      const vwapTimeLabel = formatTimeFull(Date.now());
      const vwapTimeLabelW = ctx.measureText(vwapTimeLabel).width + 14;
      ctx.fillStyle = "rgba(61,220,132,0.15)";
      roundRect(ctx, badgeX + vwapLabelW + 2, vwapBadgeY, vwapTimeLabelW, 20, 3);
      ctx.fill();
      ctx.fillStyle = "#70E852";
      ctx.fillText(vwapTimeLabel, badgeX + vwapLabelW + 9, vwapBadgeY + 14);

      // Tooltip crosshair
      if (tooltip) {
        // Vertical line
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(tooltip.x, PADDING.top);
        ctx.lineTo(tooltip.x, H - PADDING.bottom);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(PADDING.left, tooltip.y);
        ctx.lineTo(W - PADDING.right, tooltip.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Tooltip box
        const ttPrice = formatPriceFull(tooltip.price);
        const ttTime = formatTime(tooltip.time);
        const ttText = `${ttPrice}  ${ttTime}`;
        ctx.font = "bold 12px 'SF Mono', 'Fira Code', monospace";
        const ttW = ctx.measureText(ttText).width + 20;
        const ttH = 28;
        const ttX = Math.min(tooltip.x - ttW / 2, W - ttW - 10);
        const ttY = tooltip.y - ttH - 12;

        ctx.fillStyle = "rgba(30,33,50,0.95)";
        ctx.strokeStyle = "rgba(255,154,46,0.5)";
        ctx.lineWidth = 1;
        roundRect(ctx, ttX, ttY, ttW, ttH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(ttText, ttX + ttW / 2, ttY + 18);
        ctx.textAlign = "left";

        // Crosshair dot
        ctx.fillStyle = "#EC8711";
        ctx.beginPath();
        ctx.arc(tooltip.x, tooltip.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    draw();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [data, dimensions, tooltip, mapX, mapY, minPrice, maxPrice, currentPrice, openPrice, vwap]);

  // Mouse interaction
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || data.length < 2) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (
        mx < PADDING.left ||
        mx > dimensions.width - PADDING.right ||
        my < PADDING.top ||
        my > dimensions.height - PADDING.bottom
      ) {
        setTooltip(null);
        return;
      }

      // Find nearest data point
      let closest = data[0];
      let closestDist = Infinity;
      for (const point of data) {
        const px = mapX(point.time);
        const dist = Math.abs(px - mx);
        if (dist < closestDist) {
          closestDist = dist;
          closest = point;
        }
      }

      setTooltip({
        x: mapX(closest.time),
        y: mapY(closest.price),
        time: closest.time,
        price: closest.price,
      });
    },
    [data, dimensions, mapX, mapY]
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  // Price change calculation
  const priceChange = currentPrice - openPrice;
  const priceChangePct = ((priceChange / openPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  return (
    <div
      style={{
        width: "100%",
        height: 429,
        background: "linear-gradient(117deg, #2C2D42 0%, #1B1C31 99.9%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'SF Mono'",
      }}
    >

      {/* Chart */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: 429,
            cursor: tooltip ? "crosshair" : "default",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      
    </div>
  );
}

// Utility: rounded rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
