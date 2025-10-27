"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  useBalance,
  useConnectUI,
  useIsConnected,
  useWallet as useFuelWallet,
} from "@fuels/react";

// Define wallet context type
interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  connect: () => void;
  disconnect: () => void;
  isLoading: boolean;
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Custom hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

// Provider component
interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useFuelWallet();
  
  // Get base asset ID safely
  const [baseAssetId, setBaseAssetId] = React.useState<string | undefined>();
  
  React.useEffect(() => {
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

  // Derived state
  const address = wallet?.address.toAddress() || null;
  const balanceString = balance?.toString() || null;

  const value: WalletContextType = {
    isConnected,
    address,
    balance: balanceString,
    connect,
    disconnect: () => {
      // @fuels/react handles disconnect internally
      console.log("Disconnect handled by @fuels/react");
    },
    isLoading: isConnecting,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}