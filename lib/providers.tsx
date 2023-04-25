"use client";
import "@rainbow-me/rainbowkit/styles.css";
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
import { polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ToastContainer } from "react-toastify";
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";


const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in subport. This will not trigger any transactions, transfers, mints, or deployments',
});
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID_TESTNET as string;
const { chains, provider, webSocketProvider } = configureChains(
  [polygon, polygonMumbai],
  [alchemyProvider({ apiKey }), publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "subport recommended",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ chains }),
      metaMaskWallet({ chains }),
      coinbaseWallet({ chains, appName: "subport.xyz" }),
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
    <SessionProvider>
    <WagmiConfig client={wagmiClient}>
       <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >         
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
      </RainbowKitSiweNextAuthProvider>
    </WagmiConfig></SessionProvider>
  );
};

export default Providers;

