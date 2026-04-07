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

export const uploadMedia = async (file: File) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const formData = new FormData();
    formData.append("media", file);

    const response = await axios.post(`${api_url}/medias/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data?.data;
  } catch (error) {
    console.error("Error uploading media:", error);
    return null;
  }
};

export const updateUserProfile = async (payload: { displayName?: string; profileImage?: string }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const response = await axios.patch(`${api_url}/users`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    return null;
  }
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
