"use client";
import React, { createContext, useContext, useState, FC, ReactNode } from "react";

type TabType = "trade" | "activity" | "comments";
interface PositionsContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  refreshKey: number;
  triggerRefresh: () => void;
  refreshNow: () => void;
}

const PositionsContext = createContext<PositionsContextValue | null>(null);

export const PositionsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("trade");
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setTimeout(() => {
      setIsOpen(true);
      setRefreshKey((k) => k + 1);
    }, 7000);
  };

  const refreshNow = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <PositionsContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((prev) => !prev),
        activeTab,
        setActiveTab,
        refreshKey,
        triggerRefresh,
        refreshNow,
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