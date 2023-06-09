"use client";
import { useState, useRef, useEffect } from "react";
import { BsShare, BsTwitter } from "react-icons/bs";
import { TwitterShareButton } from "next-share";
import Link from "next/link";

type ShareCardProps = {
  onClose: () => void;
  url: string
  title?: string
  image?: string
  link?: string
};

const ShareCard = ({ onClose, url, title, image, link }: ShareCardProps) => {
  const lensShare =
    `https://lenster.xyz/?text=Check%20this%20out!&url=${url}&via=djtwinnytwin&hashtags=thecrib,cribmusic`;

  const handleClick = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLElement)) return;

    if (!event.target.closest("#shareCard")) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div className="absolute -ml-40" id="shareCard">
      <div className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <Link href={lensShare}>
          <button className="flex justify-around text-center w-full px-4 py-2 dark:text-white bg-gray-50 hover:bg-gray-200 border-b border-gray-200 rounded-t-lg cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-800 dark:border-gray-600">
            <div className="nr-3">Share on Lens</div><img className="w-4 " src="/images/lens_white.png"></img>
          </button>
        </Link>
        <div className="w-48">
          <TwitterShareButton
            url={url}
           
            title={`I just claimed my handle from @subport at claim.subport.xyz. I'm in! Check it out. ${link} `}
            hashtags={['subport,buildspace']}
          >
            <div className="flex justify-around text-center w-48 px-4 py-2 dark:text-white bg-gray-50 hover:bg-gray-200 border-b border-gray-200 rounded-t-lg cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-800 dark:border-gray-600">
              <p className="mr-3">Share on Twitter</p><BsTwitter />
            </div>
          </TwitterShareButton>
        </div>
      </div>
    </div>
  );
};

export const ShareButton = ({ url, title, image, link}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const shareButtonRef = useRef(null);

  const handleShareButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="" ref={shareButtonRef}>
      <button onClick={handleShareButtonClick} className="text-white flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Share <div className="pl-2"><BsShare/></div>

      </button>
      {isOpen && <ShareCard url={url} title={title} onClose={handleClose} image={image} link={link}/>}
    </div>
  );
};
