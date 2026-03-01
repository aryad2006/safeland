"use client";

import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n";
import {
    BarChart3,
    Building2,
    FileText,
    Home,
    Lock,
    Scale,
    Shield,
    Users,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { account, isConnected, role } = useWallet();
  const { t } = useI18n();

  const cards = [
    {
      title: t("properties.title"),
      description: t("dashboard.cards.properties"),
      icon: <Home className="w-8 h-8" />,
      href: "/properties",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: t("escrow.title"),
      description: t("dashboard.cards.escrow"),
      icon: <FileText className="w-8 h-8" />,
      href: "/escrow",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: t("fridda.title"),
      description: t("dashboard.cards.fridda"),
      icon: <Users className="w-8 h-8" />,
      href: "/fridda",
      color: "from-purple-500 to-violet-600",
    },
    {
      title: t("justice.title"),
      description: t("dashboard.cards.justice"),
      icon: <Scale className="w-8 h-8" />,
      href: "/justice",
      color: "from-red-500 to-rose-600",
    },
    {
      title: t("stats.title"),
      description: t("dashboard.cards.stats"),
      icon: <BarChart3 className="w-8 h-8" />,
      href: "/stats",
      color: "from-amber-500 to-orange-600",
    },
    ...(role === "admin" ? [{
      title: t("timelock.title"),
      description: t("dashboard.cards.timelock"),
      icon: <Lock className="w-8 h-8" />,
      href: "/timelock",
      color: "from-slate-500 to-slate-700",
    }] : []),
    ...(role === "bank" || role === "admin" ? [{
      title: t("bank.title"),
      description: t("dashboard.cards.bank"),
      icon: <Building2 className="w-8 h-8" />,
      href: "/bank",
      color: "from-blue-600 to-blue-800",
    }] : []),
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
          {t("dashboard.subtitle")}
        </p>
        {!isConnected && (
          <p className="mt-4 text-sm text-yellow-700 bg-yellow-50 inline-block px-4 py-2 rounded-lg">
            {t("dashboard.connectPrompt")}
          </p>
        )}
        {isConnected && (
          <p className="mt-4 text-sm text-safeland-700 bg-safeland-50 inline-block px-4 py-2 rounded-lg">
            {t("dashboard.connected")} {account.slice(0, 6)}...{account.slice(-4)}
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
        <h3 className="text-lg font-semibold mb-4">{t("dashboard.architecture")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center text-sm">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="font-bold text-safeland-700">SafeLandNFT</div>
            <div className="text-gray-500">{t("dashboard.contracts.nft")}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-bold text-blue-700">Registry</div>
            <div className="text-gray-500">{t("dashboard.contracts.registry")}</div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="font-bold text-indigo-700">Escrow</div>
            <div className="text-gray-500">{t("dashboard.contracts.escrow")}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="font-bold text-purple-700">Fridda</div>
            <div className="text-gray-500">{t("dashboard.contracts.fridda")}</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="font-bold text-red-700">Justice</div>
            <div className="text-gray-500">{t("dashboard.contracts.justice")}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="font-bold text-slate-700">Timelock</div>
            <div className="text-gray-500">{t("dashboard.contracts.timelock")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
