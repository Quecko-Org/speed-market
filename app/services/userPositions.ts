import axios from "axios";
import { api_url } from "@/app/config/environment";

export const getUserPosition = async (symbol: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
        const response = await axios.get(`${api_url}/bets/my-positions?offset=1&limit=10&symbol=${symbol}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data?.data?.bets;
    } catch (error) {
        console.error("Error fetching user position:", error);
        return null;
    }
};


export const getUserHistory = async (symbol: string, offset = 1, limit = 10) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
        const response = await axios.get(`${api_url}/bets/history?offset=${offset}&limit=${limit}&symbol=${symbol}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data?.data;
    } catch (error) {
        console.error("Error fetching user history:", error);
        return null;
    }
};


export interface SignaturePayload {
    betId: string;
}

export const getClaimSignature = async (payload: SignaturePayload) => {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await axios.post(`${api_url}/bets/claim-sign`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response?.data?.data;
    } catch (error) {
        console.error("Error fetching signature:", error);
        return null;
    }
};