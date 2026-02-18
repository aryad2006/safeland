"use client";

import { useWallet } from "@/context/WalletContext";
import { ArrowRight, Home, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PropertiesPage() {
  const { isConnected, role, apiCall } = useWallet();
  const [stats, setStats] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Formulaire de création
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    to: "",
    titreFoncier: "",
    surface: "",
    propertyType: "residential",
    city: "",
    gpsCoords: "",
    documentHash: "",
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await apiCall("/properties");
      setStats(data);
    } catch {
      // Backend indisponible
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchCity.trim()) return;
    setLoading(true);
    try {
      const data = await apiCall(`/properties?city=${encodeURIComponent(searchCity)}`);
      setSearchResults(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiCall("/properties", {
        method: "POST",
        body: JSON.stringify({ ...form, surface: parseInt(form.surface) }),
      });
      toast.success(`Titre créé — Token #${data.tokenId}`);
      setShowCreate(false);
      setForm({ to: "", titreFoncier: "", surface: "", propertyType: "residential", city: "", gpsCoords: "", documentHash: "" });
      loadStats();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Home className="w-8 h-8 text-safeland-600" />
          <h1 className="text-2xl font-bold">Titres Fonciers</h1>
        </div>
        {isConnected && ["agent", "notary", "admin"].includes(role) && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 bg-safeland-600 text-white rounded-lg hover:bg-safeland-700 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nouveau Titre
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Propriétés", value: stats.totalProperties },
            { label: "Transactions", value: stats.totalTransactions },
            { label: "Fraudes Évitées", value: stats.fraudPrevented },
            { label: "Actions Justice", value: stats.justiceOverrides },
          ].map((s) => (
            <div key={s.label} className="glass rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-safeland-700">{s.value || "0"}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recherche */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Rechercher par ville</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Ex: Casablanca, Rabat, Marrakech..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safeland-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-safeland-600 text-white rounded-lg hover:bg-safeland-700 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            Rechercher
          </button>
        </form>
        {searchResults && (
          <div className="mt-4 text-sm">
            <p className="text-gray-600">
              {searchResults.count} titre(s) trouvé(s) à {searchCity}
            </p>
            {searchResults.tokenIds?.map((id) => (
              <span key={id} className="inline-block mr-2 mt-1 badge badge-green">
                Token #{id}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire de création */}
      {showCreate && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Créer un titre foncier</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Adresse du propriétaire (0x...)"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              required
              placeholder="N° Titre Foncier (ex: TF-12345/C)"
              value={form.titreFoncier}
              onChange={(e) => setForm({ ...form, titreFoncier: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              required
              type="number"
              placeholder="Surface (m²)"
              value={form.surface}
              onChange={(e) => setForm({ ...form, surface: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={form.propertyType}
              onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="residential">Résidentiel</option>
              <option value="commercial">Commercial</option>
              <option value="agricultural">Agricole</option>
              <option value="industrial">Industriel</option>
            </select>
            <input
              required
              placeholder="Ville"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              required
              placeholder="Coordonnées GPS (lat,lng)"
              value={form.gpsCoords}
              onChange={(e) => setForm({ ...form, gpsCoords: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              required
              placeholder="Hash document IPFS (QmXxx...)"
              value={form.documentHash}
              onChange={(e) => setForm({ ...form, documentHash: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2"
            />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-safeland-600 text-white rounded-lg hover:bg-safeland-700 disabled:opacity-50 font-medium"
              >
                <ArrowRight className="w-4 h-4" />
                Créer le Titre NFT
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
