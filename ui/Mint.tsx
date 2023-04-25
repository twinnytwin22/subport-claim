"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import contractAbi from "../utils/contractABI.json";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ConnectWeb3 } from "./Connect";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { FaCoins, FaPencilAlt } from "react-icons/fa";
import { resolve4 } from "dns";

type FormValues = {
  domain: string;
  name: string;
  email: string;
  role: string;
};

const twitterLogo = "/twitter-logo.svg"; // Constants
const TWITTER_HANDLE = "subportxyz";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const tld = ".subport";
const CONTRACT_ADDRESS = "0xe95Cc033c0a0718D8daC521287ab46D80c8Dc073";

const Mint = () => {
  // Add some state data properties
  const { register, handleSubmit, control, watch } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      domain: "",
      name: "",
      email: "",
      role: "",
    },
  });
  const [domain, setDomain] = useState<any>("");
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<any>("");
  const { data: session, status } = useSession();

  const mintDomain = async (formData: FormValues) => {
    // Don't run if the domain is empty
    if (domain == formData?.domain) {
    // Alert the user if the domain is too short
    if (domain.length <= 5) {
      toast("handles 5 characters will require 10 matic");
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
      const price =
      domain.length <= 5 ? "10" : "0.0";
      console.log("Minting domain", domain, ".subport", "with price", price, 'as', role);

    try {
      if (status == "authenticated") {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");

        let tx = await contract.register(domain,role, {
          value: ethers.utils.parseEther(price),
        });
        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          toast.success("Created Successfully!");
          console.log(
            "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          // Set the record for the domain
          tx = await contract.setRole(domain, role);
          await tx.wait();

          console.log(
            "Role of",role,"set https://mumbai.polygonscan.com/tx/" + tx.hash
          );
          toast.success("Finalizing");
          setStep(2);
        } else {
          setDomain("");
          setRole("");
          toast.error("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    return;
  }
  
  };
  // Render Methods
  const ConnectContainer = () => {
    return (
      <div className="mx-auto w-full max-w-sm relative isolate">
        <p className="text-xl font-bold text-center p-4">claim your handle.</p>

        <img className="mb-3 rounded-2xl" src="/subport_xyz.svg" />
        <ConnectWeb3 />
      </div>
    );
  };
  const onSubmit = async (formData: FormValues) => {
    toast("Submitting");
    setDomain(formData?.domain);
    setRole(formData?.role)
    await mintDomain(formData);
    setStep(2);
  };

  // Form to enter domain name and data
  const InputForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-md w-full mx-auto flex flex-col">
          <h3 className="p-5 text-2xl font-medium text-zinc-900 dark:text-white text-center">
            choose your path.
          </h3>
          <div className="justify-between mb-5 items-center content-center relative mx-auto w-full">
            <ul className="grid w-full gap-6 md:grid-cols-2">
              <li>
                <input
                  type="radio"
                  id="creator"
                  name="role"
                  value="creator"
                  className="hidden peer"
                  required
                />
                <label
                  htmlFor="creator"
                  className="inline-flex items-center justify-between w-full p-5 text-zinc-500 bg-white border border-zinc-200 rounded-lg cursor-pointer dark:hover:text-zinc-300 dark:border-zinc-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-900 dark:hover:bg-zinc-700"
                >
                  <div className="block">
                    <div className="w-full">creator</div>
                  </div>
               <FaPencilAlt/>
                </label>
              </li>
              <li>
                <input
                  type="radio"
                  id="collector"
                  name="role"
                  value="collector"
                  className="hidden peer"
                />
                <label
                  htmlFor="collector"
                  className="inline-flex items-center justify-between w-full p-5 text-zinc-00 bg-white border border-zinc-200 rounded-lg cursor-pointer dark:hover:text-zinc-300 dark:border-zinc-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-900 dark:hover:bg-zinc-700"
                >
                  <div className="block">
                    <div className="w-full">collector</div>
                  </div>
           <FaCoins/>
                </label>
              </li>
            </ul>
          </div>
          <div className="flex justify-between mb-3 items-center content-center relative ">
            <input
              className="bg-zinc-900 border-zinc-700 border focus:ring-zinc-500 focus:ring rounded-lg p-4 w-full items-center text-center text-xl"
              type="text"
              placeholder="handle"
              id="domain"
              {...register("domain")}
            />
            <p className="absolute right-5 text-xl font-bold"> {tld} </p>
          </div>
          <p className="text-center text-sm pb-6">
            your handle must be between 5-15 characters, all lowercase, no
            special characters, and no underscores (_) at the beginning or end.
          </p>
         
         

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            claim
          </button>
        </div>
      </form>
    );
  };

  // This will take us into edit mode and show us the edit buttons!

  const onSuccessfulMint = () => {
    return (
      <div className="bg-zinc-900 border-zinc-700 border shadow-zinc-800 shadow-lg rounded-lg max-w-md w-full mx-auto p-8">
        <h1 className="mx-auto text-4xl font-extrabold text-center">
          You're in as a {role}!
        </h1>
        <div>
          <p className="text-center text-xl py-5 font-bold">{domain}.subport</p>
          <div className="flex justify-around p-4">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Share
            </button>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              View
            </button>
          </div>
        </div>
      </div>
    );
  };

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
            {status === "authenticated" && (
              <ConnectButton showBalance={false} />
            )}
          </div>
        </div>

        <>
          {status === "unauthenticated" && <ConnectContainer />}
          {status === "authenticated" && step === 1 && <InputForm />}
          {status === "authenticated" && step === 2 && onSuccessfulMint()}
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
