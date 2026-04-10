import axios from "axios";
import { api_url } from "@/app/config/environment";


export interface PostCommentPayload {
    coinId: string;
    content: string;
    replyTo?: string;
}

export const postComments = async (payload: PostCommentPayload) => {
    const token = localStorage.getItem("accessToken");
    try {
        const body: any = { coinId: payload.coinId, content: payload.content };
        if (payload.replyTo) {
            body.replyTo = payload.replyTo;
        }
        const response = await axios.post(`${api_url}/comments`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response?.data?.data;
    } catch (error) {
        console.error("Error posting comment:", error);
        return null;
    }
};

export interface GetCommentsParams {
    coinId: string;
    limit?: number;
    nextCursor?: string;
    replyTo?: string;
}

export const getComments = async (params: GetCommentsParams) => {
    const token = localStorage.getItem("accessToken");
    try {
        const query: Record<string, string> = { coinId: params.coinId };
        if (params.limit) query.limit = String(params.limit);
        if (params.nextCursor) query.nextCursor = params.nextCursor;
        if (params.replyTo) query.replyTo = params.replyTo;

        const queryString = new URLSearchParams(query).toString();
        const response = await axios.get(`${api_url}/comments?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response?.data?.data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return null;
    }
};


export const likeComments = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await axios.patch(`${api_url}/comments/${id}/react`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response?.data?.data;
    } catch (error) {
        console.error("Error posting comment:", error);
        return null;
    }
};
