import { io, Socket } from "socket.io-client";
import { api_url } from "@/app/config/environment";

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === "undefined") return null;
  if (!api_url) return null;

  if (!socket) {
    socket = io(api_url, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
