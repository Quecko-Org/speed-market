import axios from "axios";
import { aqua_base_url } from "@/app/config/environment";

const AQUA_SWAP_URL = `${aqua_base_url}/api/swap/swap-asset`;
const AQUA_API_KEY = "AS-goABF5DIDOy-6iGPTzoQNXY";

export interface AquaSwapPayload {
  walletAddress: string;
  sourceChain: string;
  destinationChain: string;
  sourceTokenAddress: string;
  destinationTokenAddress: string;
  recipientAddress: string;
  refundWalletAddress: string;
}

export interface AquaSwapResponse {
  assignedWalletAddress: string;
  listener_key: string;
  existingRequest?: {
    assignedWalletAddress: string;
    listener_key: string;
  };
}

export const aquaSwapWalletGeneration = async (
  payload: AquaSwapPayload
): Promise<AquaSwapResponse | null> => {
  try {
    const { data } = await axios.post(AQUA_SWAP_URL, payload, {
      headers: {
        "x-api-key": AQUA_API_KEY,
      },
    });
    return data;
  } catch (error) {
    console.error("Aqua swap error:", error);
    return null;
  }
};
