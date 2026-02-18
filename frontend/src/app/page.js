"use client";

import { useWallet } from "@/context/WalletContext";
import {
    BarChart3,
    FileText,
    Home,
    Scale,
    Shield,
    Users,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { account, isConnected } = useWallet();

  const cards = [
    {
      title: "Titres Fonciers",
      description: "Consulter, créer et transférer des titres NFT",
      icon: <Home className="w-8 h-8" />,
      href: "/properties",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Escrow",
      description: "Gérer les transactions sécurisées avec split fiscal",
      icon: <FileText className="w-8 h-8" />,
      href: "/escrow",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Fridda — Successions",
      description: "Dossiers de succession et gouvernance héritiers",
      icon: <Users className="w-8 h-8" />,
      href: "/fridda",
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Justice",
      description: "Actions judiciaires, gel et récupération sociale",
      icon: <Scale className="w-8 h-8" />,
      href: "/justice",
      color: "from-red-500 to-rose-600",
    },
    {
      title: "Statistiques",
      description: "Tableau de bord global du registre foncier",
      icon: <BarChart3 className="w-8 h-8" />,
      href: "/stats",
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Shield className="w-16 h-16 text-safeland-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Safe<span className="text-safeland-600">Land</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Cadastre Blockchain Souverain du Royaume du Maroc — Sécurisation
          foncière par NFT, escrow fiscal et succession Fridda
        </p>
        {!isConnected && (
          <p className="mt-4 text-sm text-yellow-700 bg-yellow-50 inline-block px-4 py-2 rounded-lg">
            Connectez votre wallet MetaMask pour accéder aux fonctionnalités
          </p>
        )}
        {isConnected && (
          <p className="mt-4 text-sm text-safeland-700 bg-safeland-50 inline-block px-4 py-2 rounded-lg">
            Connecté : {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className="glass rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
              <div
                className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.color} text-white mb-4 group-hover:scale-110 transition-transform`}
              >
                {card.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Architecture Info */}
      <div className="mt-12 glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Architecture SafeLand</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="font-bold text-safeland-700">SafeLandNFT</div>
            <div className="text-gray-500">ERC-721 Titres</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-bold text-blue-700">Registry</div>
            <div className="text-gray-500">Index Central</div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="font-bold text-indigo-700">Escrow</div>
            <div className="text-gray-500">Split Fiscal</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="font-bold text-purple-700">Fridda</div>
            <div className="text-gray-500">ERC-1155 Succession</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="font-bold text-red-700">Justice</div>
            <div className="text-gray-500">Multi-Sig</div>
          </div>
        </div>
      </div>
    </div>
  );
}
