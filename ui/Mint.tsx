
"use client";
import React, { Suspense, useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAbi from "../utils/contractABI.json";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork } from "wagmi";
import { ConnectWeb3 } from "./Connect";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

type FormValues = {
  domain: string;
  name: string;
  email: string;
};

const twitterLogo = "/twitter-logo.svg"; // Constants
const TWITTER_HANDLE = "subportxyz";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const tld = ".subport";
const CONTRACT_ADDRESS = "0x6A4044E612b8D0bD23e65629a243cB19265A80Ec";

const Mint = () => {
  // Add some state data properties
  const { register, handleSubmit, control, watch } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      domain: '',
      name: '',
      email: ''
    }
  });
  const [domain, setDomain] = useState<any>("");
  const [step, setStep] = useState(1)
  const [record, setRecord] = useState<any>("");
  const {data:session, status } = useSession()


  const mintDomain = async () => {
    // Don't run if the domain is empty
  
    // Alert the user if the domain is too short
    if ( domain.length < 3) {
      toast("Domain must be at least 3 characters long");
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price =
    domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
    console.log("Minting domain", domain,'.subport', "with price", price);

    try {
     
      if (status == "authenticated") {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
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
          toast.success('Created Successfully!')
          console.log(
            "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          // Set the record for the domain
          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log(
            "Record set! https://mumbai.polygonscan.com/tx/" + tx.hash
            
          );
          toast.success('Finalizing')
          setStep(2)
        } else {
          setDomain('')
          setRecord("");
          toast.error("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      console.log(error)
    } 
  };
  // Render Methods
  const ConnectedContainer = () =>  { 
    return (
    <div className="mx-auto w-full max-w-sm relative isolate">
      <img className="mb-3 rounded-2xl" src="/subport_xyz.svg" />
      <ConnectWeb3 />
    </div>
  )};
  const onSubmit = async (formData:FormValues) => { 
    toast('Submitting')
    setDomain(formData?.domain)
    setRecord(formData?.name)
    mintDomain()
   
    }


  // Form to enter domain name and data
  const InputForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-md w-full mx-auto flex flex-col">
        <p className="text-xl font-bold text-center p-4">Claim Your Handle</p>
        <div className="flex justify-between mb-3 items-center content-center relative ">
          <input
            className="bg-zinc-900 border-zinc-700 border focus:ring-zinc-500 focus:ring rounded-lg p-4 w-full items-center text-center text-xl"
            type="text"
            placeholder="handle"
            id="domain"
            {...register('domain')}
          />
          <p className="absolute right-5 text-xl font-bold"> {tld} </p>
        </div>
        <p className="text-center text-xs mb-3">Your handle must be between 3-15 characters, all lowercase, no special characters, and no underscores (_) at the beginning or end.</p>
        <div className="flex justify-between mb-3 items-center content-center relative ">
          <input
            className="bg-zinc-900 border-zinc-700 border focus:ring-zinc-500 focus:ring rounded-lg p-4 w-full items-center text-center text-xl"
            type="text"
           id="name"
            placeholder="your name"
            {...register('name')}
          />
        </div>

        <button type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Claim
        </button>
      </div></form>
    );
  };

  // This will take us into edit mode and show us the edit buttons!

  const onSuccessfulMint = () => {
    return (
      <div className="bg-zinc-900 border-zinc-700 border shadow-zinc-800 shadow-lg rounded-lg max-w-md w-full mx-auto p-8">
      <h1 className="mx-auto text-4xl font-extrabold text-center">
        You're in {record}!
      </h1>
      <div>
     

    <p className="text-center text-xl py-5 font-bold">{domain}.subport</p>
    <div className="flex justify-around p-4">
    <button 
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >Share</button>
        <button 
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >View</button></div>
      </div>
      </div>
    )
  }

  return (
    <div className="h-screen mx-auto w-full text-white">
      <div className="flex flex-col w-full h-full p-10 justify-between">
        <div className="pt-8">
          <div className="flex  p-8 justify-between items-center">
            <div className="flex items-center md:ml-[10%]">
              <Link href="/" className="flex">
                <img
                  src="/images/subport.png"
                  className="mx-3  w-9"
                  alt="Subport Logo"
                />
                <h1 className="text-lg font-bold">subport</h1>
              </Link>
            </div>
            {status === 'authenticated' && <ConnectButton showBalance={false}  />}
          </div>
        </div>

        <>
          {status === 'unauthenticated' && <ConnectedContainer/>}
          {status === 'authenticated' && step === 1 && <InputForm/>}
          {status === 'authenticated' && step === 2 && onSuccessfulMint()}
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
