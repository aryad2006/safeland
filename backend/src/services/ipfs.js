const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

/**
 * Service IPFS via Pinata (ou compatible)
 * Utilisé pour l'upload des documents fonciers :
 *   - Actes notariés
 *   - Plans cadastraux
 *   - Attestations Adouls
 *   - Photos de biens
 */

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET = process.env.PINATA_API_SECRET;
const PINATA_BASE = "https://api.pinata.cloud";
const IPFS_GATEWAY = process.env.IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs";

/**
 * Upload un fichier vers IPFS via Pinata
 * @param {Buffer|ReadableStream} fileData - Données du fichier
 * @param {string} fileName - Nom du fichier
 * @param {object} metadata - Métadonnées additionnelles (tokenId, type, etc.)
 * @returns {{ cid: string, url: string, size: number }}
 */
async function uploadFile(fileData, fileName, metadata = {}) {
  if (!PINATA_API_KEY || !PINATA_SECRET) {
    throw new Error("PINATA_API_KEY et PINATA_API_SECRET requis dans .env");
  }

  const form = new FormData();
  form.append("file", fileData, { filename: fileName });

  const pinataMetadata = JSON.stringify({
    name: `safeland-${fileName}`,
    keyvalues: {
      project: "safeland",
      ...metadata,
    },
  });
  form.append("pinataMetadata", pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 1,
    wrapWithDirectory: false,
  });
  form.append("pinataOptions", pinataOptions);

  const response = await axios.post(`${PINATA_BASE}/pinning/pinFileToIPFS`, form, {
    maxBodyLength: Infinity,
    headers: {
      ...form.getHeaders(),
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET,
    },
  });

  const { IpfsHash, PinSize } = response.data;

  return {
    cid: IpfsHash,
    url: `${IPFS_GATEWAY}/${IpfsHash}`,
    size: PinSize,
  };
}

/**
 * Upload un JSON (métadonnées NFT) vers IPFS
 * @param {object} jsonData - Objet JSON à uploader
 * @param {string} name - Nom du document
 * @returns {{ cid: string, url: string }}
 */
async function uploadJSON(jsonData, name = "metadata") {
  if (!PINATA_API_KEY || !PINATA_SECRET) {
    throw new Error("PINATA_API_KEY et PINATA_API_SECRET requis dans .env");
  }

  const response = await axios.post(
    `${PINATA_BASE}/pinning/pinJSONToIPFS`,
    {
      pinataContent: jsonData,
      pinataMetadata: {
        name: `safeland-${name}`,
        keyvalues: { project: "safeland" },
      },
      pinataOptions: { cidVersion: 1 },
    },
    {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET,
      },
    }
  );

  const { IpfsHash } = response.data;

  return {
    cid: IpfsHash,
    url: `${IPFS_GATEWAY}/${IpfsHash}`,
  };
}

/**
 * Récupère un fichier depuis IPFS
 * @param {string} cid - Content Identifier
 * @returns {Buffer}
 */
async function getFile(cid) {
  const response = await axios.get(`${IPFS_GATEWAY}/${cid}`, {
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
}

/**
 * Vérifie le statut d'un pin
 * @param {string} cid
 * @returns {{ pinned: boolean, name: string, size: number }}
 */
async function getPinStatus(cid) {
  if (!PINATA_API_KEY || !PINATA_SECRET) {
    throw new Error("PINATA_API_KEY et PINATA_API_SECRET requis");
  }

  try {
    const response = await axios.get(`${PINATA_BASE}/data/pinList?hashContains=${cid}`, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET,
      },
    });

    const pin = response.data.rows[0];
    if (!pin) return { pinned: false };

    return {
      pinned: true,
      name: pin.metadata?.name || "",
      size: pin.size,
    };
  } catch {
    return { pinned: false };
  }
}

module.exports = {
  uploadFile,
  uploadJSON,
  getFile,
  getPinStatus,
  IPFS_GATEWAY,
};
