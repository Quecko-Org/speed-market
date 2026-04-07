import axios from "axios";
import { api_url } from "@/app/config/environment";


export const getCoinsPrices = async () => {

    try {
        const response = await axios.get(`${api_url}/coins/price?offset=1&limit=10`);
        return response.data?.data?.coins;
    } catch (error) {
        console.error("Error fetching coin prices:", error);
        return null;
    }
};

export const getCoinDetail = async (symbol: string) => {
    try {
        const response = await axios.get(`${api_url}/coins/price/${symbol}`);
        return response.data?.data;
    } catch (error) {
        console.error("Error fetching coin detail:", error);
        return null;
    }
};

export const getCoinActivity = async (symbol?: string, offset = 1, limit = 10, result?: string) => {
    try {
        let url = `${api_url}/bets/activity?offset=${offset}&limit=${limit}`;
        if (symbol) url += `&symbol=${symbol}`;
        if (result) url += `&result=${result}`;
        const response = await axios.get(url);
        return response.data?.data;
    } catch (error) {
        console.error("Error fetching coin activity:", error);
        return null;
    }
};


export interface SignaturePayload {
    amount: string;
    asset: string;
    duration: string;
    type: "UP" | "DOWN";
}

export const getSignature = async (payload: SignaturePayload) => {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await axios.post(`${api_url}/bets/create-option-sign`, payload, {
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