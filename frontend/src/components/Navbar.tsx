"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletConnector } from "./ui/WalletConnector";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Product Name */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-black dark:text-white">
              Fuel NFT Studio
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                    : "text-zinc-700 hover:bg-zinc-700 hover:text-white dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                href="/single-edition"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/single-edition"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                    : "text-zinc-700 hover:bg-zinc-700 hover:text-white dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
                }`}
              >
                Single Edition
              </Link>
              <Link
                href="/collection"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/collection"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                    : "text-zinc-700 hover:bg-zinc-700 hover:text-white dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
                }`}
              >
                Collection
              </Link>
            </div>
          </div>

          {/* Wallet Connector */}
          <div className="flex items-center">
            <WalletConnector />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                : "text-zinc-700 hover:bg-zinc-700 hover:text-white dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/single-edition"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/single-edition"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                : "text-zinc-700 hover:bg-zinc-700 hover:text-white dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
            }`}
          >
            Single Edition
          </Link>
          <Link
            href="/collection"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/collection"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                : "text-zinc-700 hover:bg-zinc-700 hover:text-white dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
            }`}
          >
            Collection
          </Link>
        </div>
      </div>
    </nav>
  );
}