import axios from "axios";
import { api_url } from "@/app/config/environment";

interface LoginResponseData {
  accessToken: string;
  user?: {
    _id: string;
  };
}

interface LoginResponse {
  data: LoginResponseData;
}

export const loginOrRegister = async (
  signature: string,
  walletAddress: string,
  userSmartAddress: string,
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${api_url}/auth/users/connect`,
    {
      sign: signature,
      externalWalletAddress: walletAddress,
      internalWalletAddress: userSmartAddress,
    }
  );

  localStorage.setItem("accessToken", response?.data?.data?.accessToken);
  if (response?.data?.data?.user?._id) {
    localStorage.setItem("userId", response?.data?.data?.user?._id);
  }
  localStorage.setItem("flag", "true");
  localStorage.setItem("sign", signature);

  return response.data;
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const response = await axios.get(`${api_url}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
