"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FuelProvider } from "@fuels/react";
import { defaultConnectors } from "@fuels/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "../src/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create QueryClient inside component to avoid SSR issues
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <FuelProvider
            fuelConfig={{
              connectors: defaultConnectors({
                devMode: true,
              }),
            }}
            networks={[
              {
                chainId: 0, // Ignition testnet chain ID
                url: "https://testnet.fuel.network/v1/graphql",
              },
            ]}
          >
            <Navbar />
            <main>{children}</main>
          </FuelProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
