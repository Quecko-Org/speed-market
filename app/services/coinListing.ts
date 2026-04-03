import axios from "axios";
import { api_url } from "@/app/config/environment";


export const getCoinsPrices = async () => {

    try {
        const response = await axios.get(`${api_url}/coins/price?offset=1&limit=10`);
        return response.data?.data?.coins;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};