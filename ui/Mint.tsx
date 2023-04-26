"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractAbi from "../utils/contractABI.json";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { FaCoins, FaPencilAlt } from "react-icons/fa";
import { useAccount } from "wagmi";
import { tokenGate } from "lib/tokenGate";
import { contract } from "lib/fatchVars";
import { getDomain } from "lib/serverFetch";
import { eligible } from "lib/eligble";
import { onSuccessfulMint } from "./SuccessfulMint";
import { ConnectContainer } from "./ConnectedContainer";
import LoadingContainer from "./LoadingContainer";
import Footer from "./Footer";
type FormValues = {
  domain: string;
  name: string;
  email: string;
  role: string;
};



const tld = ".subport";

const Mint = () => {
  const [data, setData] = useState<any>(false);
  const [loading, setLoading] = useState(false);
  // Add some state data properties
  const [domain, setDomain] = useState<any>("");
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<any>("");
  const [rolePreview, setRolePreview] = useState<any>("");
  const [NFT, setNFT] = useState<any>(null);
  const { data: session, status } = useSession();
  const { address } = useAccount();
  const hasAddress = address!!;
  const allowed = (eligible.includes(hasAddress)) 
  console.log(allowed)
    
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (hasAddress)
        try {
          const tokenGateData = await tokenGate({ address: hasAddress }).then(
            (res) => res.json()
          );
          setData(tokenGateData);

          const nftData = await getDomain(hasAddress).then((res) => res.json());
          setNFT(nftData);

          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setStep(1);
          setLoading(false);
        } else {
          setLoading(false)
        }
    };
    fetchData();
  }, []);

  let isHolder = null;
  let ownedNfts = null;
  let metadata: any = null;
  let tokenID = null;
  let osLink: any = null;

  if (data || NFT) {
    isHolder = data?.isHolderOfContract;
    ownedNfts = NFT?.ownedNfts?.[0];
    metadata = ownedNfts?.raw?.metadata;
    tokenID = ownedNfts?.tokenId;
    osLink = `https://testnets.opensea.io/assets/mumbai/${contract}/${tokenID}`;
    console.log(data, NFT);
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      domain: "",
      name: "",
      email: "",
      role: role,
    },
  });

  const handleRoleSelection = async (event: any) => {
    const input = event?.target.value;
    setRolePreview(input);
    setValue("role", input);
    console.log(rolePreview);
  };

  const mintDomain = async (formData: FormValues) => {
    console.log(formData, "from mint");
    // Don't run if the domain is empty
    if (domain == formData?.domain) {
      // Alert the user if the domain is too short

      // Calculate price based on length of domain (change this to match your contract)
      // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
      const price = "0.0";
      console.log(
        "Minting domain",
        domain,
        ".subport",
        "with price",
        price,
        "as",
        role
      );

      try {
        if (status == "unauthenticated") {
          const provider = new ethers.providers.Web3Provider(
            window.ethereum as any
          );
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(
            contract,
            contractAbi.abi,
            signer
          );

          console.log("Going to pop wallet now to pay gas...");

          let tx = await contractInstance.register(domain, role, {
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

  const onSubmit = async (formData: FormValues) => {
    if (formData.role) {
      setDomain(formData?.domain);
      setRole(formData?.role);
      try {
        await mintDomain(formData);
      } catch (error) {
        console.log("Error minting domain:", error);
      }
    }
  };
  if (loading) {
    return <LoadingContainer/>;
  }

  const NotAllowed = () => {
    return (
      <div className="flex flex-col text-center space-y-8">
        <h1 className="text-center font-bold text-3xl">You're not eligible to claim at this time.</h1>
        <p>Claim your handle/domain early by becoming a test user!</p>
        <Link href="https://docs.google.com/document/d/1MwDcv8xCZ_94hobPdky1R7GDVi49U24PCwy0IQ4o2l4/">
        <button className="p-4 hover:scale-105 bg-blue-800 text-white rounded-xl"><p>Learn More</p>
        </button>
        </Link>
        
      </div>
    )
  }
  // Form to enter domain name and data
  const InputForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-md w-full mx-auto flex flex-col">
          <p>{[data]?.[0]?.isHolderOfContract ? onSuccessfulMint({data, NFT, metadata, osLink}) : "bye"}</p>
          <h3 className="p-5 text-2xl font-medium text-zinc-900 dark:text-white text-center">
            {rolePreview ? (
              <> You have chosen {rolePreview} </>
            ) : (
              "choose your path."
            )}
          </h3>
          <div className="justify-between mb-5 items-center content-center relative mx-auto w-full">
            <ul className="grid w-full gap-6 md:grid-cols-2">
              <li>
                <input
                  type="radio"
                  id="creator"
                  value="creator"
                  className="hidden peer"
                  required
                  {...register("role")}
                  onChange={handleRoleSelection}
                />
                <label
                  htmlFor="creator"
                  className="inline-flex items-center justify-between w-full p-5 text-zinc-500 bg-white border border-zinc-200 rounded-lg cursor-pointer dark:hover:text-zinc-300 dark:border-zinc-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-900 dark:hover:bg-zinc-700"
                >
                  <div className="block">
                    <div className="w-full">creator</div>
                  </div>
                  <FaPencilAlt />
                </label>
              </li>
              <li>
                <input
                  type="radio"
                  id="collector"
                  value="collector"
                  className="hidden peer"
                  {...register("role")}
                  onChange={handleRoleSelection}
                />
                <label
                  htmlFor="collector"
                  className="inline-flex items-center justify-between w-full p-5 text-zinc-00 bg-white border border-zinc-200 rounded-lg cursor-pointer dark:hover:text-zinc-300 dark:border-zinc-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-900 dark:hover:bg-zinc-700"
                >
                  <div className="block">
                    <div className="w-full">collector</div>
                  </div>
                  <FaCoins />
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
          {status === "authenticated" && !allowed && <NotAllowed/> }
          {status === "authenticated" && allowed && !isHolder && step === 1 && (
            <InputForm />
          )}
          {status === "authenticated" && allowed && step === 2 && onSuccessfulMint({data, NFT, metadata, osLink})}
          {status === "authenticated" && allowed && isHolder && onSuccessfulMint({data, NFT, metadata, osLink})}
        </>
        <Footer/>
      </div>
    </div>
  );
};

export default Mint;
