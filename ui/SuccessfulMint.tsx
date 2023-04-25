import Link from "next/link";
export const onSuccessfulMint = ({data, NFT, metadata, setLoading, osLink}:any) => {
    if (!data || !NFT) {
      setLoading(true);
    }

    return (
      <>
        <div className="bg-zinc-900 border-zinc-700 border shadow-zinc-800 shadow-lg rounded-lg max-w-md w-full mx-auto p-8">
          <h1 className="mx-auto text-4xl font-extrabold text-center">
            You're in as a {metadata.role}!
          </h1>{" "}
          <div className="content-center mx-auto">
            <div className="w-full flex justify-center mx-auto content-center p-5">
              <img
                className="rounded-2xl"
                src="https://nft-cdn.alchemy.com/matic-mumbai/64837567fcfb9d621c447acba4149ee0"
              ></img>{" "}
            </div>
            <div className="flex justify-around p-4">
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Share
              </button>
              <Link href={osLink}>
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  View
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };