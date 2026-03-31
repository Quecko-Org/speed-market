"use client"
import React, { useRef, useState, useEffect } from "react";

const ProgressSlider: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState(10);
  const [isDragging, setIsDragging] = useState(false);

  const updateValue = (clientX: number) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    let newValue = ((clientX - rect.left) / rect.width) * 100;

    newValue = Math.max(0, Math.min(100, newValue));
    setValue(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateValue(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    updateValue(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
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
          style={{
            width: `${value}%`,
          }}
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