export const WALLET_ORDER = [
  "MetaMask",
  "WalletConnect",
  "Coinbase Wallet",
] as const;

export const WALLET_IMAGES: Record<string, string> = {
  metamask: "/importantassets/metamask.svg",
  walletconnect: "/importantassets/walletconnect.svg",
  coinbase: "/importantassets/coinbase.svg",
};

export const LOGIN_SUCCESS = "Successfully logged in!";
export const SIGNATURE_REJECTED =
  "Signature request rejected. Please try again.";

export const USDT_DECIMALS = 6;
export const USDT_MOCK_VALUE = 0.2;
export const MAX_UINT256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
