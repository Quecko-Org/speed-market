"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { setLogoutCallback } from "@/app/services/axiosInterceptor";
import {
  useConnect,
  useDisconnect,
  useAccount,
  useWalletClient,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { signMessage, getConnection } from "@wagmi/core";
import {
  createWalletClient,
  custom,
  createPublicClient,
  http,
  type PublicClient,
} from "viem";
import { arbitrum, alchemy } from "@account-kit/infra";
import { WalletClientSigner } from "@aa-sdk/core";
import { createSmartWalletClient } from "@account-kit/wallet-client";
import { useAtom } from "jotai";
import {
  userSmartAccount,
  userSmartAccountClient,
  userPublicClient,
  userProfileData,
} from "@/app/store/atoms";
import { wagmiConfig } from "@/app/config/wagmi";
import {
  platform_chainId,
  ALCHEMY_API_KEY,
  PAYMASTER_POLICY_ID,
} from "@/app/config/environment";
import { loginOrRegister, getUserProfile } from "@/app/services/auth";
import { useGetUsdtBalance } from "@/app/hooks/useBalance";
import { LOGIN_SUCCESS, SIGNATURE_REJECTED } from "@/app/config/constants";
import { showToast } from "@/app/hooks/showToast";

interface WalletContextValue {
  isWalletConnected: boolean;
  isLoading: boolean;
  loadingStep: string;
  setLoadingStep: (step: string) => void;
  setIsLoading: (loading: boolean) => void;
  walletAddress: string | undefined;
  connectWallet: (connector: any) => Promise<void>;
  disconnectWallet: () => void;
  showSignModal: boolean;
  handleSign: () => void;
  closeSignModal: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export const useWalletContext = (): WalletContextValue => {
  const ctx = useContext(WalletContext);
  if (!ctx)
    throw new Error("useWalletContext must be used within WalletProvider");
  return ctx;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [smartAccount, setSmartAccount] = useAtom(userSmartAccount);
  const [, setSmartAccountClient] = useAtom(userSmartAccountClient);
  const [, setPubClient] = useAtom(userPublicClient);
  const [, setUserProfile] = useAtom(userProfileData);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [showSignModal, setShowSignModal] = useState(false);
  const pendingSign = useRef(false);
  const fetchUsdtBalance = useGetUsdtBalance();

  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const connectedChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const disconnectWallet = useCallback(() => {
    disconnect();
    setSmartAccount("");
    setSmartAccountClient(null);
    setPubClient(null);
    setUserProfile(null);
    pendingSign.current = false;
    localStorage.removeItem("connectorId");
    localStorage.removeItem("flag");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("lastAccount");
    localStorage.removeItem("sign");
    localStorage.removeItem("sessionExpiryTime");
  }, [disconnect, setSmartAccount, setSmartAccountClient, setPubClient, setUserProfile]);

  // Register 401 interceptor to auto-disconnect on auth failure
  useEffect(() => {
    setLogoutCallback(() => {
      disconnectWallet();
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    });
  }, [disconnectWallet]);

  const createSmartAccountFn = useCallback(
    async (wc: any) => {
      try {
        const signer = new WalletClientSigner(
          createWalletClient({
            chain: arbitrum,
            transport: custom(wc),
          }),
          "wallet"
        );

        const client = createSmartWalletClient({
          transport: alchemy({ apiKey: ALCHEMY_API_KEY }),
          chain: arbitrum,
          signer,
          policyId: PAYMASTER_POLICY_ID,
        });

        const smartAccountAddress = await (client as any).requestAccount();
        const addr = smartAccountAddress?.address as string;
        setSmartAccount(addr);
        setSmartAccountClient(client);
        return addr;
      } catch (error) {
        console.error("Error creating smart account:", error);
        return null;
      }
    },
    [setSmartAccount, setSmartAccountClient]
  );

  const performSign = useCallback(
    async (walletAddr: string) => {
      try {
        setIsLoading(true);
        setLoadingStep("Confirm signature request from your wallet");

        if (connectedChainId !== platform_chainId) {
          await switchChainAsync({ chainId: platform_chainId });
        }

        const connection = getConnection(wagmiConfig);

        const signData = await signMessage(wagmiConfig, {
          connector: connection.connector,
          message: walletAddr.toLowerCase(),
        });

        const lastConnectorId = localStorage.getItem("userlastconnectorId");
        if (lastConnectorId) {
          localStorage.setItem("connectorId", lastConnectorId);
        }
        localStorage.setItem("sign", signData);
        localStorage.setItem("lastAccount", walletAddr);

        return signData;
      } catch (error) {
        setLoadingStep("");
        setIsLoading(false);
        showToast("error", { message: SIGNATURE_REJECTED });
        disconnectWallet();
        console.error("Signing failed:", error);
        return null;
      }
    },
    [connectedChainId, switchChainAsync, disconnectWallet]
  );

  const connectWallet = useCallback(
    async (connector: any) => {
      try {
        setIsLoading(true);
        setLoadingStep("Confirm wallet connection from your wallet");

        const result = await connectAsync(
          connector?.name === "WalletConnect"
            ? { connector }
            : { connector, chainId: platform_chainId }
        );

        localStorage.setItem("connectorId", connector?.name ?? "");
        localStorage.setItem("flag", "true");
        localStorage.setItem("userlastconnectorId", connector?.name ?? "");

        if (result?.accounts?.[0]) {
          pendingSign.current = true;
        }
      } catch (error) {
        console.error("Wallet connection failed:", error);
        setLoadingStep("");
        setIsLoading(false);
        localStorage.removeItem("connectorId");
        localStorage.removeItem("flag");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
      }
    },
    [connectAsync]
  );

  // When walletClient becomes available after connect, show sign modal
  useEffect(() => {
    if (!pendingSign.current || !address || !walletClient) return;
    pendingSign.current = false;
    setIsLoading(false);
    setLoadingStep("");
    setShowSignModal(true);
  }, [address, walletClient]);

  const handleSign = useCallback(async () => {
    if (!address || !walletClient) return;
    setShowSignModal(false);
    setIsLoading(true);

    const signData = await performSign(address);
    if (!signData) return;

    setLoadingStep("Setting up your account...");
    const smartAddr = await createSmartAccountFn(walletClient);
    await loginOrRegister(signData, address, smartAddr ?? "");
    showToast("success", { message: LOGIN_SUCCESS });

    await fetchUsdtBalance(smartAddr ?? undefined);
    const profile = await getUserProfile();
    if (profile) setUserProfile(profile);

    setLoadingStep("");
    setIsLoading(false);
  }, [address, walletClient, performSign, createSmartAccountFn, fetchUsdtBalance, setUserProfile]);

  const closeSignModal = useCallback(() => {
    setShowSignModal(false);
    disconnectWallet();
  }, [disconnectWallet]);

  useEffect(() => {
    if (
      address &&
      walletClient &&
      !smartAccount &&
      !pendingSign.current &&
      localStorage.getItem("accessToken")
    ) {
      createSmartAccountFn(walletClient);
    }
  }, [address, walletClient, smartAccount, createSmartAccountFn]);

  // Create public client, fetch balance & profile on reconnect (page reload)
  useEffect(() => {
    if (smartAccount) {
      setPubClient(
        createPublicClient({
          chain: arbitrum,
          transport: http(),
        })
      );

      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        fetchUsdtBalance();
        getUserProfile().then((profile) => {
          if (profile) setUserProfile(profile);
        });
      }
    }
  }, [smartAccount, setPubClient, fetchUsdtBalance, setUserProfile]);

  // Clear session expiry on account change
  useEffect(() => {
    if (address && smartAccount) {
      const lastConnectedAccount = localStorage.getItem("lastAccount");
      if (lastConnectedAccount !== address) {
        localStorage.removeItem("sessionExpiryTime");
      }
    }
  }, [address, smartAccount]);

  return (
    <WalletContext.Provider
      value={{
        isWalletConnected: isConnected && !!address,
        isLoading,
        loadingStep,
        setLoadingStep,
        setIsLoading,
        walletAddress: address,
        connectWallet,
        disconnectWallet,
        showSignModal,
        handleSign,
        closeSignModal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
