"use client";
import React, { createContext, useContext, useState, FC, ReactNode } from "react";

interface PositionsContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const PositionsContext = createContext<PositionsContextValue | null>(null);

export const PositionsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PositionsContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((prev) => !prev),
      }}
    >
      {children}
    </PositionsContext.Provider>
  );
};

export const usePositions = (): PositionsContextValue => {
  const ctx = useContext(PositionsContext);
  if (!ctx) throw new Error("usePositions must be used inside <PositionsProvider>");
  return ctx;
};