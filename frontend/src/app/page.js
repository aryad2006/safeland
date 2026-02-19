"use client";

import { useI18n } from "@/i18n";
import {
    ArrowRight,
    CheckCircle2,
    FileText,
    Globe,
    Home,
    Lock,
    Scale,
    Shield,
    Users,
    Zap
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen -m-8">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-safeland-700 via-safeland-600 to-emerald-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-36 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Shield className="w-14 h-14" />
            </div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
            Safe<span className="text-emerald-200">Land</span>
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-4 font-light">
            {t("hero.tagline")}
          </p>
          <p className="text-base lg:text-lg text-white/70 max-w-2xl mx-auto mb-10">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-safeland-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-xl text-lg"
            >
              {t("hero.cta")} <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition text-lg"
            >
              {t("hero.discover")}
            </a>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { val: "5", label: t("hero.stats.contracts") },
              { val: "90%", label: t("hero.stats.coverage") },
              { val: "96", label: t("hero.stats.tests") },
              { val: "100%", label: t("hero.stats.onchain") },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold">{s.val}</div>
                <div className="text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PROBLÈME / SOLUTION ═══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-safeland-600 uppercase tracking-wider">{t("problem.label")}</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-6">
                {t("problem.title")}
              </h2>
              <ul className="space-y-4 text-gray-600">
                {t("problem.items").map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-sm font-semibold text-safeland-600 uppercase tracking-wider">{t("solution.label")}</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-6">
                {t("solution.title")}
              </h2>
              <ul className="space-y-4 text-gray-600">
                {t("solution.items").map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-safeland-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 5 MODULES ═══════════════════ */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-safeland-600 uppercase tracking-wider">{t("features.label")}</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">
              {t("features.title")}
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Home className="w-8 h-8" />,
                key: "nft",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                key: "registry",
                color: "from-cyan-500 to-blue-600",
              },
              {
                icon: <FileText className="w-8 h-8" />,
                key: "escrow",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: <Users className="w-8 h-8" />,
                key: "fridda",
                color: "from-purple-500 to-violet-600",
              },
              {
                icon: <Scale className="w-8 h-8" />,
                key: "justice",
                color: "from-red-500 to-rose-600",
              },
              {
                icon: <Lock className="w-8 h-8" />,
                key: "security",
                color: "from-gray-600 to-gray-800",
              },
            ].map((mod) => (
              <div key={mod.key} className="glass rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 group">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${mod.color} text-white mb-5 group-hover:scale-110 transition-transform`}>
                  {mod.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t(`features.modules.${mod.key}.title`)}</h3>
                <p className="text-sm font-medium text-safeland-600 mb-3">{t(`features.modules.${mod.key}.subtitle`)}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{t(`features.modules.${mod.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ STACK TECHNIQUE ═══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-safeland-600 uppercase tracking-wider">{t("tech.label")}</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">{t("tech.title")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Solidity 0.8.24", key: "solidity" },
              { name: "OpenZeppelin v5", key: "openzeppelin" },
              { name: "Hardhat", key: "hardhat" },
              { name: "IPFS / Pinata", key: "ipfs" },
              { name: "Next.js 14", key: "nextjs" },
              { name: "Express.js", key: "express" },
              { name: "ethers.js v6", key: "ethers" },
              { name: "Docker", key: "docker" },
            ].map((item) => (
              <div key={item.name} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-safeland-50 transition">
                <Zap className="w-6 h-6 text-safeland-600 mx-auto mb-3" />
                <div className="font-bold text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-500 mt-1">{t(`tech.items.${item.key}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ ACTEURS ═══════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-safeland-600 uppercase tracking-wider">{t("actors.label")}</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">{t("actors.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {["ancfcc", "agent", "notary", "judge", "citizen"].map((key) => (
              <div key={key} className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 bg-safeland-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-safeland-700" />
                </div>
                <div className="font-bold text-gray-900 text-sm">{t(`actors.roles.${key}.name`)}</div>
                <div className="text-xs text-gray-500 mt-1">{t(`actors.roles.${key}.desc`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-20 bg-gradient-to-r from-safeland-700 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-lg text-white/80 mb-10">
            {t("cta.subtitle")}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-safeland-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-xl text-lg"
          >
            {t("cta.button")} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-safeland-500" />
              <span className="text-white font-bold">SafeLand</span>
              <span className="text-sm">— {t("footer.tagline")}</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/dashboard" className="hover:text-white transition">{t("nav.dashboard")}</Link>
              <Link href="/properties" className="hover:text-white transition">{t("nav.properties")}</Link>
              <Link href="/escrow" className="hover:text-white transition">{t("nav.escrow")}</Link>
              <Link href="/fridda" className="hover:text-white transition">{t("nav.fridda")}</Link>
              <Link href="/stats" className="hover:text-white transition">{t("nav.stats")}</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
            {t("footer.copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
}
