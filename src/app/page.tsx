'use client'
import Image from "next/image";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";

export default function Home() {
  const address = useActiveAccount()?.address;;

  const onClick = async () => {
    const res = await fetch("/api/claimNFT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ useActiveAccount: address }),
    });

    if (res.ok) {
      alert("NFT claimed!");
    } else {
      const errorText = await res.text();
      alert(`Failed to claim NFT: ${errorText}`);
    }
  };

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />

        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Example App",
              url: "https://example.com",
            }}
          />
          {address && (
            <button style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={onClick}>
              Claim NFT
            </button>
          )}
        </div>

        {/* <ThirdwebResources /> */}
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb Engine
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-blue-500"> Next.js </span>
      </h1>

      <p className="text-zinc-300 text-base">
        Read the{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{" "}
        file to get started.
      </p>
    </header>
  );
}
