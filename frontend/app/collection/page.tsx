"use client";

import { useState } from "react";
import { WalletConnector } from "../../src/components/ui/WalletConnector";

export default function CollectionPage() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [baseImageUrl, setBaseImageUrl] = useState("");
  const [maxSupply, setMaxSupply] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement collection NFT creation logic
    console.log("Creating collection NFT:", {
      name,
      symbol,
      description,
      baseImageUrl,
      maxSupply,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
            Create Collection NFT
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Collection Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white sm:text-sm px-3 py-2 border"
                placeholder="Enter collection name"
                required
              />
            </div>

            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Symbol
              </label>
              <input
                type="text"
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white sm:text-sm px-3 py-2 border"
                placeholder="Enter symbol (e.g., COLNFT)"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white sm:text-sm px-3 py-2 border"
                placeholder="Describe your collection"
              />
            </div>

            <div>
              <label htmlFor="baseImageUrl" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Base Image URL
              </label>
              <input
                type="url"
                id="baseImageUrl"
                value={baseImageUrl}
                onChange={(e) => setBaseImageUrl(e.target.value)}
                className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white sm:text-sm px-3 py-2 border"
                placeholder="https://example.com/base-image.png"
              />
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                This will be used as the base image for all NFTs in the collection
              </p>
            </div>

            <div>
              <label htmlFor="maxSupply" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Max Supply
              </label>
              <input
                type="number"
                id="maxSupply"
                value={maxSupply}
                onChange={(e) => setMaxSupply(e.target.value)}
                min="1"
                className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white sm:text-sm px-3 py-2 border"
                placeholder="Maximum number of NFTs in collection"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-zinc-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Create Collection NFT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}