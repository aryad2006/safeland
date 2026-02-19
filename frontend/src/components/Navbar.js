"use client";

import { useWallet } from "@/context/WalletContext";
import { Menu, Shield, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/properties", label: "Titres" },
  { href: "/escrow", label: "Escrow" },
  { href: "/fridda", label: "Fridda" },
  { href: "/justice", label: "Justice" },
  { href: "/stats", label: "Stats" },
];

export default function Navbar() {
  const { account, role, isConnected, connect, disconnect } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-safeland-600" />
            <span className="text-xl font-bold">
              Safe<span className="text-safeland-600">Land</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-safeland-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet */}
          <div className="hidden md:flex items-center gap-3">
            {isConnected ? (
              <>
                {role && <span className="badge badge-green">{role}</span>}
                <span className="text-sm text-gray-500">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button
                  onClick={disconnect}
                  className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                >
                  Déconnecter
                </button>
              </>
            ) : (
              <button
                onClick={connect}
                className="px-4 py-2 text-sm bg-safeland-600 text-white rounded-lg hover:bg-safeland-700 transition font-medium"
              >
                Connecter Wallet
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white py-4 px-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-gray-700 hover:text-safeland-600"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100">
            {isConnected ? (
              <button
                onClick={() => {
                  disconnect();
                  setMobileOpen(false);
                }}
                className="w-full px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg"
              >
                Déconnecter ({account.slice(0, 6)}...)
              </button>
            ) : (
              <button
                onClick={() => {
                  connect();
                  setMobileOpen(false);
                }}
                className="w-full px-4 py-2 text-sm bg-safeland-600 text-white rounded-lg font-medium"
              >
                Connecter Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
