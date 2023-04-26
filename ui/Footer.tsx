'use client'
import React from "react";
import Link from "next/link";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { useSession } from "next-auth/react";
function Footer({isHolder}: any) {
  const { status } = useSession()
  const TWITTER_HANDLE = "subportxyz";
  const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
  const INSTA_HANDLE = "subport.xyz";
  const INSTA_LINK = `https://instagram.com/${INSTA_HANDLE}`;
  return (
    <div className="mx-auto text-center font-extrabold text-xs text-slate-200 ">
      {!isHolder && status === 'unauthenticated'&& <div className="hover:scale-110 hover:text-white">
        <Link href="">become a test user to claim your handle.</Link>
      </div>}
      <hr className="mt-6 isolate w-screen-2xl bg-slate-300"/>
      <div className="flex p-6 items-center mx-auto content-center justify-center space-x-2">
        <div className="flex items-center">
          <FaTwitter />
          <a
            className=""
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      
        <div className="flex items-center">
            <FaInstagram />
          <a
            className=""
            href={INSTA_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${INSTA_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
