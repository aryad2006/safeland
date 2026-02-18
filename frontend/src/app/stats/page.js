"use client";

import { useWallet } from "@/context/WalletContext";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function StatsPage() {
  const { apiCall } = useWallet();
  const [stats, setStats] = useState(null);

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

  const cards = stats
    ? [
        { label: "Total Propriétés", value: stats.totalProperties || "0", color: "bg-green-50 text-green-700" },
        { label: "Transactions", value: stats.totalTransactions || "0", color: "bg-blue-50 text-blue-700" },
        { label: "Fraudes Évitées", value: stats.fraudPrevented || "0", color: "bg-yellow-50 text-yellow-700" },
        { label: "Actions Justice", value: stats.justiceOverrides || "0", color: "bg-red-50 text-red-700" },
      ]
    : [];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="w-8 h-8 text-amber-600" />
        <h1 className="text-2xl font-bold">Statistiques du Registre</h1>
      </div>

      {!stats && (
        <div className="glass rounded-xl p-8 text-center text-gray-500">
          <p>Impossible de charger les statistiques.</p>
          <p className="text-sm mt-2">Assurez-vous que le backend et la blockchain locale sont démarrés.</p>
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {cards.map((c) => (
              <div key={c.label} className={`glass rounded-xl p-6 text-center`}>
                <div className={`text-3xl font-bold ${c.color.split(" ")[1]}`}>{c.value}</div>
                <div className="text-sm text-gray-500 mt-1">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Architecture Blockchain</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Consensus :</strong> PBFT (Practical Byzantine Fault Tolerance)</p>
              <p><strong>Réseau :</strong> Consortium Privé Souverain — hébergé au Maroc</p>
              <p><strong>Contrats :</strong> 5 smart contracts UUPS Upgradeable (ERC-721 + ERC-1155)</p>
              <p><strong>Conformité :</strong> Loi 43-20 (services de confiance), CNDP, Bank Al-Maghrib</p>
              <p><strong>SLA :</strong> 99,9% disponibilité, RPO &lt; 5 min, RTO &lt; 30 min</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
