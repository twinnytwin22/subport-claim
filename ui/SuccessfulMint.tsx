'use client'
import Link from "next/link";
import { ShareButton } from "./ShareCardButton";
export const OnSuccessfulMint = ({data, NFT, metadata, setLoading, osLink, role}:any) => {
const image = NFT?.ownedNfts[0]?.image?.cachedUrl
    return (
      <>
        <div className="bg-zinc-900 border-zinc-700 border shadow-zinc-800 shadow-lg rounded-lg max-w-md w-full mx-auto p-8">
          <h1 className="mx-auto text-4xl font-extrabold text-center">
            You're in as a {metadata?.role ?? role}!
          </h1>{" "}
          <div className="content-center mx-auto">
            <div className="w-full flex justify-center mx-auto content-center p-5">
              <img
                className="rounded-2xl"
                src={image}
              ></img>{" "}
            </div>
            <div className="flex justify-around p-4">
            <ShareButton image={image} link={osLink}/>
            {osLink && 
              <Link href={osLink}>
                <button className="text-white flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  View <div><img className="w-8 pl-2" src="/images/os-icon.svg"></img></div>
                </button>
              </Link>}
            </div>
          </div>
        </div>
      </>
    );
  };