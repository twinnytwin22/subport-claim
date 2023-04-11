"use client";
import React, { useEffect, useState } from "react";
import "../styles/App.css";
import { ethers } from "ethers";
import contractAbi from "../utils/contractABI.json";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork } from "wagmi";
import { ConnectWeb3 } from "./Connect";


const twitterLogo = "/twitter-logo.svg"; // Constants
const TWITTER_HANDLE = "subportxyz";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const tld = ".subport";
const CONTRACT_ADDRESS = "0x6A4044E612b8D0bD23e65629a243cB19265A80Ec";

const Mint = () => {
  // Add some state data properties
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("");
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  if (chain) {
    console.log(chain.id);
  }
  // Render Methods
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img src="https://i.imgur.com/YTx1jjf.gif" />
      <ConnectWeb3 />
    </div>
  );

  // Form to enter domain name and data
  const renderInputForm = () => {
    return (
      <div className="max-w-md w-full mx-auto flex flex-col">
        <p className="text-xl font-bold text-center p-4">Claim Your Handle</p>
        <div className="flex justify-between mb-3 items-center content-center relative ">
          <input
            className="bg-zinc-900 border-zinc-700 border focus:ring-zinc-500 focus:ring rounded-lg p-4 w-full items-center text-center text-xl"
            type="text"
            value={domain}
            placeholder="handle"
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className="absolute right-5 text-xl font-bold"> {tld} </p>
        </div>
        <div className="flex justify-between mb-3 items-center content-center relative ">
          <input
            className="bg-zinc-900 border-zinc-700 border focus:ring-zinc-500 focus:ring rounded-lg p-4 w-full items-center text-center text-xl"
            type="text"
            value={record}
            placeholder="your name"
            onChange={(e) => setRecord(e.target.value)}
          />
        </div>

        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={mintDomain}
        >
          Claim
        </button>
      </div>
    );
  };

  // This will take us into edit mode and show us the edit buttons!

  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) {
      return;
    }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price =
      domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
    console.log("Minting domain", domain, "with price", price);

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");

        let tx = await contract.register(domain, {
          value: ethers.utils.parseEther(price),
        });
        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log(
            "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          // Set the record for the domain
          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log(
            "Record set! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          setRecord("");
          setDomain("");
        } else {
          alert("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen mx-auto w-full text-white">
     
        <>
          {!isConnected && renderNotConnectedContainer()}
          {isConnected && renderInputForm()}
        </>
        <div className="flex content-center p-8 items-center mx-auto">
          <img alt="Twitter Logo" className="w-12" src={twitterLogo} />
          <a
            className="text-white font-bold"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default Mint;
