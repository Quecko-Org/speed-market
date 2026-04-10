import { WALLET_IMAGES } from "@/app/config/constants";
import { getIndexKey } from "./indexDb";

export const getWalletImage = (name: string): string | null => {
  const key = name.toLowerCase();
  if (key.includes("metamask")) return WALLET_IMAGES.metamask;
  if (key.includes("coinbase")) return WALLET_IMAGES.coinbase;
  if (key.includes("walletconnect")) return WALLET_IMAGES.walletconnect;
  return null;
};

export const getFormattedAddress = (address: string): string => {
  if (!address || address.length < 10) return address || "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const handleCheckSession = async (): Promise<boolean> => {
  const currentTime = Math.floor(Date.now() / 1000);
  const sessionExpiryTime = Number(
    localStorage.getItem("sessionExpiryTime") ?? 0
  );
  const stored = await getIndexKey<{ privateKey: string }>("sessionKeyData");
  return currentTime >= sessionExpiryTime || !stored;
};

export const formatNumberWithCommas = (value: number): string => {
  if (isNaN(value)) return "0";
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
