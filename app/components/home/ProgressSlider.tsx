"use client"
import React, { useRef, useState, useEffect } from "react";

interface ProgressSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const ProgressSlider: React.FC<ProgressSliderProps> = ({ value, onChange }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateFromPosition = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    onChange(percent);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateFromPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateFromPosition(e.touches[0].clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => updateFromPosition(e.clientX);
    const handleTouchMove = (e: TouchEvent) => updateFromPosition(e.touches[0].clientX);
    const handleEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="amountslider">
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="mainslider"
      >
        <div
          style={{ width: `${value}%` }}
          className="innerslider"
        />
        <div
          style={{
            left: `${value}%`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
          className="slidercircle"
        />
      </div>
    </div>
  );
};

export default ProgressSlider;
