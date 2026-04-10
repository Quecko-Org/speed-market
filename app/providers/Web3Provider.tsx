"use client";

import React, { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { wagmiConfig } from "@/app/config/wagmi";
import { WalletProvider } from "@/app/context/WalletContext";

const queryClient = new QueryClient();

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <WalletProvider>{children}</WalletProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
