export let api_url: string;
export let aqua_base_url: string;
export let usdt_token: string;
export let SPEED_MARKET_CONTRACT: string;
export let ACTIVE_SESSION_TIME: number;

export const platform_chainId = 42161;
export const PAYMASTER_ADDRESS = "0x5492B6624226F393d0813a8f0bc752B6C0521393";
export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_ID ?? "";
export const PAYMASTER_POLICY_ID = process.env.NEXT_PUBLIC_PAYMASTER_POLICY_ID ?? "";
export const ALCHEMY_RPC_URL = `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

const system_ENV = process.env.NEXT_PUBLIC_ENV;

if (system_ENV === "development") {
  api_url = "https://dev-api.pulsepairs.com";
  aqua_base_url = "https://dev-aqua-backend.quecko.org";
  SPEED_MARKET_CONTRACT = "0x35B4f9f775f236d66c53fC5F087015F4A1391FD3";
  usdt_token = "0xCa4f77A38d8552Dd1D5E44e890173921B67725F4";
  ACTIVE_SESSION_TIME = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1;
} else if (system_ENV === "stage") {
  api_url = "https://rain-speed-markets-stg-api.quecko.org";
  aqua_base_url = "https://stg-api.aqua.cash";
  SPEED_MARKET_CONTRACT = "0x20902004C236FAD57039964162A856b0059E16b2";
  usdt_token = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
  ACTIVE_SESSION_TIME = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1;
} else {
  api_url = "";
  aqua_base_url = "https://prod-api.aqua.cash";
  SPEED_MARKET_CONTRACT = "";
  usdt_token = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
  ACTIVE_SESSION_TIME = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1;
}
