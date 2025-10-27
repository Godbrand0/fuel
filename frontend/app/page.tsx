import Image from "next/image";
import { WalletConnector } from "../src/components/ui/WalletConnector";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            NFT Contract Dashboard
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Connect your wallet to interact with NFT contracts on the Fuel network.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row w-full">
          <div className="w-full sm:w-1/2">
            <WalletConnector />
          </div>
          
          <div className="w-full sm:w-1/2 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Contract Features</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <h3 className="font-medium mb-2">Factory Contract</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Track and manage NFT deployments
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                  <li>• Register new deployments</li>
                  <li>• View deployment history</li>
                  <li>• Get deployment statistics</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <h3 className="font-medium mb-2">Collection NFT</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Create unique NFTs with individual metadata
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                  <li>• Mint unique tokens</li>
                  <li>• Set metadata per token</li>
                  <li>• Transfer ownership</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <h3 className="font-medium mb-2">Single Edition NFT</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Mint multiple copies of the same NFT design
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                  <li>• Mint multiple copies</li>
                  <li>• Set shared metadata</li>
                  <li>• Transfer ownership</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
