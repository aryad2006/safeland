"use client";

import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";
import { useMemo } from "react";

import SafeLandEscrowArtifact from "@/contracts/SafeLandEscrow.json";
import SafeLandFriddaArtifact from "@/contracts/SafeLandFridda.json";
import SafeLandJusticeArtifact from "@/contracts/SafeLandJustice.json";
import SafeLandNFTArtifact from "@/contracts/SafeLandNFT.json";
import SafeLandRegistryArtifact from "@/contracts/SafeLandRegistry.json";
import SafeLandTimelockArtifact from "@/contracts/SafeLandTimelock.json";

// Adresses des contrats : priorité env vars > artefact compilé
const addr = (envVar, artifact) =>
  process.env[envVar] || artifact.address || undefined;

/**
 * Hook fournissant les instances de contrats connectées au signer (écriture)
 * ou au provider (lecture seule).
 */
export function useContracts() {
  const { provider, signer } = useWallet();

  const contracts = useMemo(() => {
    if (!provider) return null;

    // Pour les lectures, on utilise le provider ; pour les écritures, le signer
    const signerOrProvider = signer || provider;

    const makeContract = (envKey, artifact) => {
      const address = addr(envKey, artifact);
      if (!address) return null;
      return new ethers.Contract(address, artifact.abi, signerOrProvider);
    };

    return {
      nft:      makeContract("NEXT_PUBLIC_NFT_ADDRESS",      SafeLandNFTArtifact),
      registry: makeContract("NEXT_PUBLIC_REGISTRY_ADDRESS", SafeLandRegistryArtifact),
      escrow:   makeContract("NEXT_PUBLIC_ESCROW_ADDRESS",   SafeLandEscrowArtifact),
      fridda:   makeContract("NEXT_PUBLIC_FRIDDA_ADDRESS",   SafeLandFriddaArtifact),
      justice:  makeContract("NEXT_PUBLIC_JUSTICE_ADDRESS",  SafeLandJusticeArtifact),
      timelock: makeContract("NEXT_PUBLIC_TIMELOCK_ADDRESS", SafeLandTimelockArtifact),
    };
  }, [provider, signer]);

  return contracts;
}

/**
 * Helpers pour formater les données de la blockchain
 */
export function formatPropertyType(typeIndex) {
  const types = ["Résidentiel", "Commercial", "Agricole", "Industriel"];
  return types[typeIndex] || "Inconnu";
}

export function formatPropertyStatus(statusIndex) {
  const statuses = ["Actif", "Gelé", "Contentieux", "Succession"];
  return statuses[statusIndex] || "Inconnu";
}

export function formatDealStatus(statusIndex) {
  const statuses = ["Créé", "Vendeur a signé", "Acheteur a financé", "Notaire a signé", "Complété", "Annulé"];
  return statuses[statusIndex] || "Inconnu";
}

export function formatSuccessionStatus(statusIndex) {
  const statuses = ["Ouvert", "Distribué", "Finalisé"];
  return statuses[statusIndex] || "Inconnu";
}

export const DEAL_STATUS_COLORS = {
  0: "bg-gray-100 text-gray-700",    // Created
  1: "bg-yellow-100 text-yellow-700", // SellerSigned
  2: "bg-blue-100 text-blue-700",     // BuyerFunded
  3: "bg-indigo-100 text-indigo-700", // NotarySigned
  4: "bg-green-100 text-green-700",   // Completed
  5: "bg-red-100 text-red-700",       // Cancelled
};
