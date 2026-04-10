// Token keys
export const TOKEN_USDT = "USDT";
export const TOKEN_USDC = "USDC";
export const TOKEN_ETH = "ETH";
export const TOKEN_BNB = "BNB";
export const TOKEN_BTC = "BTC";

// Chain keys
export const CHAIN_ARBITRUM = "Arbitrum";
export const CHAIN_BSC = "BSC";
export const CHAIN_BITCOIN = "bitcoin";

// Defaults
export const DEFAULT_TOKEN = "Select Token";
export const DEFAULT_CHAIN = "Select_Chain";

// Expiry for generated deposit address (2 minutes)
export const AQUA_WALLET_TIME_EXPIRE = 120000;

// Tokens that lock the chain dropdown (chain is auto-selected)
export const LOCKED_CHAIN_TOKENS = [TOKEN_BTC, TOKEN_BNB];

export interface DepositToken {
  key: string;
  label: string;
  img: string;
}

export interface DepositChain {
  key: string;
  label: string;
  img: string;
}

// Deposit tokens — RAIN removed
export const DEPOSIT_TOKENS: DepositToken[] = [
  // { key: TOKEN_BTC, label: "BTC", img: "/tokenimages/btc.png" },
  { key: TOKEN_USDT, label: "USDT", img: "/tokenimages/usdt.png" },
  // { key: TOKEN_USDC, label: "USDC", img: "/tokenimages/usdc.png" },
  // { key: TOKEN_BNB, label: "BNB", img: "/tokenimages/bnb.png" },
  // { key: TOKEN_ETH, label: "ETH", img: "/tokenimages/eth.png" },
];

// Deposit chains
export const DEPOSIT_CHAINS: DepositChain[] = [
  { key: "Arbitrum", label: "Arbitrum", img: "/tokenimages/arbitrum.svg" },
  // { key: "BASE", label: "Base", img: "/tokenimages/base.svg" },
  // { key: "BSC", label: "BNB Chain", img: "/tokenimages/bnb.png" },
  // { key: "Ethereum", label: "Ethereum", img: "/tokenimages/eth.png" },
  // { key: "bitcoin", label: "Bitcoin", img: "/tokenimages/btc.png" },
];

// Token contract addresses per chain (for aqua swap)
export const CHAIN_TO_TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
  ARBITRUM: {
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    ETH: "0x0000000000000000000000000000000000000000",
  },
  BASE: {
    USDT: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    ETH: "0x0000000000000000000000000000000000000000",
  },
  BSC: {
    USDT: "0x55d398326f99059fF775485246999027B3197955",
    USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    BNB: "0x0000000000000000000000000000000000000000",
  },
  BITCOIN: {
    BTC: "0x0000000000000000000000000000000000000000",
  },
  ETHEREUM: {
    ETH: "0x0000000000000000000000000000000000000000",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
};

// Minimum deposit amounts per chain/token
export const CHAIN_TO_TOKEN_MIN_AMOUNT: Record<string, Record<string, string>> = {
  ARBITRUM: { USDT: "$5", USDC: "$5", ETH: "0.002 ETH" },
  BASE: { USDT: "$5", USDC: "$5", ETH: "0.002 ETH" },
  BSC: { USDT: "$5", USDC: "$5", BNB: "0.004 BNB" },
  BITCOIN: { BTC: "0.0002 BTC" },
  ETHEREUM: { ETH: "0.002 ETH", USDC: "$5", USDT: "$5" },
};

// Resolve the correct chain for a token (auto-lock logic)
export const getAutoChain = (tokenKey: string): string => {
  if (tokenKey === TOKEN_BTC) return CHAIN_BITCOIN;
  if (tokenKey === TOKEN_BNB) return CHAIN_BSC;
  return DEFAULT_CHAIN;
};

// Get available chains for a given token
export const getChainsForToken = (tokenKey: string): DepositChain[] => {
  if (tokenKey === TOKEN_ETH) {
    return DEPOSIT_CHAINS.filter(
      (c) => c.key !== CHAIN_BSC && c.key !== CHAIN_BITCOIN
    );
  }
  return DEPOSIT_CHAINS;
};
