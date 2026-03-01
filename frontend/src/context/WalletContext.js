"use client";

import { ethers } from "ethers";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [chainId, setChainId] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  const isConnected = !!account;

  /**
   * Connexion MetaMask + authentification JWT via signature
   */
  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast.error("MetaMask non détecté");
      return;
    }

    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await web3Provider.send("eth_requestAccounts", []);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));

      // Auth : demander un nonce, signer, obtenir JWT
      try {
        const nonceRes = await fetch(`${API_URL}/auth/nonce`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: accounts[0] }),
        });
        const { nonce } = await nonceRes.json();

        const signature = await web3Signer.signMessage(nonce);

        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: accounts[0], signature }),
        });
        const loginData = await loginRes.json();

        if (loginData.token) {
          setToken(loginData.token);
          setRole(loginData.role);
          localStorage.setItem("safeland_token", loginData.token);
          toast.success(`Connecté en tant que ${loginData.role}`);
        }
      } catch {
        // Backend peut ne pas être démarré — on connecte quand même le wallet
        toast("Wallet connecté (backend indisponible)", { icon: "⚠️" });
      }
    } catch (err) {
      toast.error("Connexion refusée");
    }
  }, [API_URL]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("safeland_token");
    toast("Déconnecté");
  }, []);

  // Écouter les changements de compte MetaMask
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        // MetaMask strongly recommends reloading on chain change to avoid
        // stale contract instances, mismatched ABIs and ethers.js provider state.
        toast("Réseau changé — rechargement…", { icon: "🔄" });
        setTimeout(() => window.location.reload(), 1000);
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [disconnect]);

  // Restaurer le token depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("safeland_token");
    if (saved) {
      try {
        const decoded = JSON.parse(atob(saved.split(".")[1]));
        if (decoded.exp * 1000 > Date.now()) {
          setToken(saved);
          setRole(decoded.role);
          setAccount(decoded.address);
        } else {
          localStorage.removeItem("safeland_token");
        }
      } catch {
        localStorage.removeItem("safeland_token");
      }
    }
  }, []);

  /**
   * Helper : appel API authentifié
   */
  const apiCall = useCallback(
    async (endpoint, options = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erreur ${res.status}`);
      }

      return res.json();
    },
    [API_URL, token]
  );

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        signer,
        token,
        role,
        chainId,
        isConnected,
        connect,
        disconnect,
        apiCall,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet doit être utilisé dans WalletProvider");
  return ctx;
}
