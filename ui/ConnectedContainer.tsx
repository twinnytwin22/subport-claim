'use client'
import { ConnectWeb3 } from "./Connect";

export const ConnectContainer = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full mx-auto place-items-center">
            <div className=" flex mx-auto items-center">
                <h1 className="text-4xl text-center md:text-left md:text-5xl lg:text-7xl font-extrabold items-center leading-32">digital collectibles for fans, from artists they listen to.</h1>
            </div>
      <div className="mx-auto w-full max-w-md p-8 relative isolate -mt-8">
        <p className="text-xl font-extrabold text-center p-4 tracking-wide">claim your handle.</p>

        <img className="mb-3 rounded-2xl" src="/subport_xyz.svg" />
        <ConnectWeb3 />
      </div></div>
    );
  };