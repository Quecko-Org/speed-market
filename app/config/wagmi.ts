import { createConfig, http } from "wagmi";
import { mainnet, arbitrum } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";
import { ALCHEMY_RPC_URL } from "./environment";

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum],
  connectors: [
    injected(),
    walletConnect({
      projectId: "14808831369ecdaaab7b8869eb13c6b0",
      metadata: {
        name: "Speed Markets",
        description: "Fast Crypto Predictions",
        url: "",
        icons: [],
      },
    }),
    coinbaseWallet({
      appName: "Speed Markets",
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(ALCHEMY_RPC_URL),
  },
});
