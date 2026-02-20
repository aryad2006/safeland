"use client";

import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function StatsPage() {
  const { apiCall } = useWallet();
  const { t } = useI18n();
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
        { label: t("dashboard.totalProperties"), value: stats.totalProperties || "0", color: "bg-green-50 text-green-700" },
        { label: t("dashboard.totalTransactions"), value: stats.totalTransactions || "0", color: "bg-blue-50 text-blue-700" },
        { label: t("dashboard.fraudPrevented"), value: stats.fraudPrevented || "0", color: "bg-yellow-50 text-yellow-700" },
        { label: t("dashboard.justiceOverrides"), value: stats.justiceOverrides || "0", color: "bg-red-50 text-red-700" },
      ]
    : [];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="w-8 h-8 text-amber-600" />
        <h1 className="text-2xl font-bold">{t("stats.registryTitle")}</h1>
      </div>

      {!stats && (
        <div className="glass rounded-xl p-8 text-center text-gray-500">
          <p>{t("stats.noStats")}</p>
          <p className="text-sm mt-2">{t("stats.noStatsHint")}</p>
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
            <h2 className="text-lg font-semibold mb-4">{t("stats.architectureTitle")}</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>{t("stats.consensusLabel")} :</strong> {t("stats.consensus")}</p>
              <p><strong>{t("stats.networkLabel")} :</strong> {t("stats.network")}</p>
              <p><strong>{t("stats.contractsLabel")} :</strong> {t("stats.contractsInfo")}</p>
              <p><strong>{t("stats.complianceLabel")} :</strong> {t("stats.compliance")}</p>
              <p><strong>{t("stats.slaLabel")} :</strong> {t("stats.sla")}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
