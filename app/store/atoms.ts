import { atom } from "jotai";
import type { PublicClient } from "viem";

export const userSmartAccount = atom<string>("");

export const userSmartAccountClient = atom<any>(null);

export const userPublicClient = atom<PublicClient | null>(null);

export const userProfileData = atom<any>(null);

export const userSmartAccountUsdtBalance = atom<number>(0);

export const userSmartAccountRainBalance = atom<number>(0);

export const userAccountUsdtBalance = atom<number>(0);

export const userSessionStorage = atom<any>(null);

export const userGrantedPermissions = atom<any>(null);
