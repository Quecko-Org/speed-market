import { useEffect, useRef } from "react";
import { getSocket } from "@/app/services/socket";
import type { CoinType } from "@/app/components/home/Market";

const SPEED_MARKET_EVENT = "speed_market_event";
const COIN_PRICES_EVENT_TYPE = "CoinPricesV1";
const POSITION_UPDATED_EVENT_TYPE = "PositionUpdatedV1";

interface SpeedMarketSocketCallbacks {
  onCoinPrices: (coins: CoinType[]) => void;
  onPositionUpdated?: (data: any) => void;
}

export const useSpeedMarketSocket = (callbacks: SpeedMarketSocketCallbacks) => {
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (data: any) => {
      if (data?.eventType === COIN_PRICES_EVENT_TYPE) {
        const coins = data?.data?.coins ?? data?.coins ?? data?.data;
        if (coins) {
          callbacksRef.current.onCoinPrices(Array.isArray(coins) ? coins : [coins]);
        }
      }

      if (data?.eventType === POSITION_UPDATED_EVENT_TYPE) {
        callbacksRef.current.onPositionUpdated?.(data?.data ?? data);
      }
    };

    socket.on(SPEED_MARKET_EVENT, handler);

    return () => {
      socket.off(SPEED_MARKET_EVENT, handler);
    };
  }, []);
};
