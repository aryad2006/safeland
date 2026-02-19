"use client";

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
            Le Cadastre Blockchain Souverain du Royaume du Maroc
          </p>
          <p className="text-base lg:text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Sécurisation foncière par NFT &bull; Escrow fiscal automatisé &bull; Succession Fridda &bull; Justice multi-sig
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-safeland-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-xl text-lg"
            >
              Accéder à la Plateforme <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition text-lg"
            >
              Découvrir
            </a>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { val: "5", label: "Smart Contracts" },
              { val: "90%", label: "Couverture Tests" },
              { val: "52", label: "Tests Unitaires" },
              { val: "100%", label: "On-Chain" },
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
              <span className="text-sm font-semibold text-safeland-600 uppercase tracking-wider">Le Problème</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-6">
                Un système foncier vulnérable à la fraude
              </h2>
              <ul className="space-y-4 text-gray-600">
                {[
                  "Falsification de titres fonciers papier",
                  "Ventes multiples du même bien immobilier",
                  "Successions bloquées et conflits familiaux",
                  "Opacité des transactions et corruption",
                  "Délais administratifs de plusieurs mois",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-sm font-semibold text-safeland-600 uppercase tracking-wider">La Solution</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-6">
                SafeLand : la confiance par la blockchain
              </h2>
              <ul className="space-y-4 text-gray-600">
                {[
                  "Titres fonciers NFT infalsifiables et traçables",
                  "Escrow atomique avec split fiscal DGI/ANCFCC automatique",
                  "Succession Fridda conforme au droit musulman (24 parts)",
                  "Justice Override multi-sig pour les litiges",
                  "Transactions instantanées et transparentes",
                ].map((item) => (
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
            <span className="text-sm font-semibold text-safeland-600 uppercase tracking-wider">Architecture</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">
              5 Smart Contracts souverains
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Une architecture modulaire UUPS upgradeable, conforme aux standards OpenZeppelin v5
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Home className="w-8 h-8" />,
                title: "SafeLandNFT",
                subtitle: "ERC-721 — Titres Fonciers",
                desc: "Chaque titre foncier est un NFT unique avec métadonnées IPFS : type, surface, géolocalisation, hash documentaire. Transferts sécurisés avec vérification multi-rôles (Agent, Notaire, Justice).",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "SafeLandRegistry",
                subtitle: "Index Central",
                desc: "Registre global indexant toutes les propriétés par ville et propriétaire. Statistiques en temps réel : transactions, grevances, fraudes prévenues, interventions judiciaires.",
                color: "from-cyan-500 to-blue-600",
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "SafeLandEscrow",
                subtitle: "Escrow Fiscal Atomique",
                desc: "Transactions immobilières atomiques avec split fiscal automatique : 4% DGI + 1% ANCFCC + 95% vendeur. Séquençage : création → signature vendeur → dépôt acheteur → validation notaire.",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "SafeLandFridda",
                subtitle: "ERC-1155 — Successions",
                desc: "Moteur de succession conforme au droit musulman avec 24 parts (fara&apos;id). Distribution automatique, gouvernance par propositions/votes des héritiers, finalisation notariale.",
                color: "from-purple-500 to-violet-600",
              },
              {
                icon: <Scale className="w-8 h-8" />,
                title: "SafeLandJustice",
                subtitle: "Multi-Sig Judiciaire",
                desc: "Interventions du Ministère de la Justice : gel judiciaire, burn &amp; remint (Justice Override), récupération sociale de clés perdues. Seuil configurable M-of-N.",
                color: "from-red-500 to-rose-600",
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Sécurité",
                subtitle: "UUPS + AccessControl + ReentrancyGuard",
                desc: "Contrats upgradeable via proxy UUPS. Contrôle d&apos;accès granulaire par rôles (Admin, Agent, Notaire, Juge, Conservateur). Protection contre la réentrance sur toutes les fonctions critiques.",
                color: "from-gray-600 to-gray-800",
              },
            ].map((mod) => (
              <div key={mod.title} className="glass rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 group">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${mod.color} text-white mb-5 group-hover:scale-110 transition-transform`}>
                  {mod.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{mod.title}</h3>
                <p className="text-sm font-medium text-safeland-600 mb-3">{mod.subtitle}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ STACK TECHNIQUE ═══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-safeland-600 uppercase tracking-wider">Technologies</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">Stack de production</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Solidity 0.8.24", cat: "Smart Contracts" },
              { name: "OpenZeppelin v5", cat: "Sécurité" },
              { name: "Hardhat", cat: "Build & Test" },
              { name: "IPFS / Pinata", cat: "Stockage décentralisé" },
              { name: "Next.js 14", cat: "Frontend" },
              { name: "Express.js", cat: "API Backend" },
              { name: "ethers.js v6", cat: "Web3" },
              { name: "Docker", cat: "Déploiement" },
            ].map((t) => (
              <div key={t.name} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-safeland-50 transition">
                <Zap className="w-6 h-6 text-safeland-600 mx-auto mb-3" />
                <div className="font-bold text-gray-900">{t.name}</div>
                <div className="text-xs text-gray-500 mt-1">{t.cat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ ACTEURS ═══════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-safeland-600 uppercase tracking-wider">Écosystème</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">Les acteurs du registre</h2>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { role: "ANCFCC", desc: "Conservation Foncière — Admin du registre" },
              { role: "Agent Foncier", desc: "Création et gestion des titres NFT" },
              { role: "Notaire", desc: "Validation des transactions et successions" },
              { role: "Juge", desc: "Gel judiciaire et Justice Override" },
              { role: "Citoyen", desc: "Propriétaire, acheteur, héritier" },
            ].map((a) => (
              <div key={a.role} className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 bg-safeland-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-safeland-700" />
                </div>
                <div className="font-bold text-gray-900 text-sm">{a.role}</div>
                <div className="text-xs text-gray-500 mt-1">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-20 bg-gradient-to-r from-safeland-700 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Prêt à sécuriser le foncier marocain ?
          </h2>
          <p className="text-lg text-white/80 mb-10">
            Connectez votre wallet MetaMask et explorez le cadastre blockchain souverain.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-safeland-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-xl text-lg"
          >
            Lancer SafeLand <ArrowRight className="w-5 h-5" />
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
              <span className="text-sm">— Cadastre Blockchain Souverain</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
              <Link href="/properties" className="hover:text-white transition">Titres</Link>
              <Link href="/escrow" className="hover:text-white transition">Escrow</Link>
              <Link href="/fridda" className="hover:text-white transition">Fridda</Link>
              <Link href="/stats" className="hover:text-white transition">Stats</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
            &copy; 2026 SafeLand Morocco — Tous droits réservés — Blockchain EVM
          </div>
        </div>
      </footer>
    </div>
  );
}
