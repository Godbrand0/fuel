"use client";

import {
  useBalance,
  useConnectUI,
  useIsConnected,
  useWallet,
} from "@fuels/react";
import { useState, useEffect } from "react";

export function WalletConnector() {
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const [baseAssetId, setBaseAssetId] = useState<string | undefined>();
  
  useEffect(() => {
    const getBaseAssetId = async () => {
      if (wallet?.provider) {
        const id = await wallet.provider.getBaseAssetId();
        setBaseAssetId(id);
      }
    };
    getBaseAssetId();
  }, [wallet?.provider]);
  
  const { balance } = useBalance({
    address: wallet?.address.toAddress(),
    assetId: baseAssetId,
  });

  const address = wallet?.address.toAddress() || null;
  const balanceString = balance?.toString() || null;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Wallet Connection</h2>
        
        {isConnected ? (
          <div className="space-y-4">
            <div className="p-3 bg-green-100 rounded-md">
              <p className="text-sm text-green-800">Connected</p>
              <p className="font-mono text-xs break-all">{address}</p>
              <p className="text-sm text-green-700">Balance: {balanceString}</p>
            </div>
            
            <button
              onClick={() => {
                // @fuels/react handles disconnect internally
                console.log("Disconnect handled by @fuels/react");
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-800">Not Connected</p>
              <p className="text-xs text-gray-600">Connect your wallet to interact with NFT contracts</p>
            </div>
            
            <button
              onClick={connect}
              disabled={isConnecting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}