import { useConnectors, type Connector } from "wagmi";
import { WALLET_ORDER } from "@/app/config/constants";

export interface WalletItem {
  name: string;
  connector: Connector | undefined;
  isAvailable: boolean;
}

export const useWalletList = (): WalletItem[] => {
  const connectors = useConnectors();

  return WALLET_ORDER.map((walletName) => {
    const connector = connectors.find((c) =>
      c.name?.toLowerCase()?.includes(walletName.toLowerCase())
    );

    return {
      name: walletName,
      connector,
      isAvailable: !!connector,
    };
  });
};
