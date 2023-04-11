"use client";
import "@rainbow-me/rainbowkit/styles.css";
import "styles/globals.css";
import * as React from "react";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  walletConnectWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, WagmiConfig, createClient } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAccount } from 'wagmi'


const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon],
  [alchemyProvider({ apiKey }), publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "CRIB Recommended",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ chains }),
      metaMaskWallet({ chains }),
      coinbaseWallet({ chains, appName: "THE CRIB" }),
      ledgerWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});


export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
          
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({
          accentColor: "white",
          accentColorForeground: "black",
          fontStack: "system",
        })}
      >
          {children}
        <ToastContainer />
      </RainbowKitProvider>

    </WagmiConfig>
  );
};

export default Providers;

