"use client";

import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n";
import {
  BadgeCheck,
  Building2,
  CreditCard,
  FileSearch,
  Landmark,
  MinusCircle,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const RATING_COLORS = {
  A: "bg-green-100 text-green-800 border-green-300",
  B: "bg-emerald-100 text-emerald-800 border-emerald-300",
  C: "bg-yellow-100 text-yellow-800 border-yellow-300",
  D: "bg-orange-100 text-orange-800 border-orange-300",
  E: "bg-red-100 text-red-800 border-red-300",
};

const CREDIT_STATUS_COLORS = {
  eligible:   "badge-green",
  restricted: "badge-yellow",
  blocked:    "badge-red",
};

export default function BankPage() {
  const { isConnected, role, apiCall } = useWallet();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("score"); // score | hypotheque | mainlevee | status

  // Score
  const [scoreTokenId, setScoreTokenId] = useState("");
  const [score, setScore] = useState(null);

  // Status
  const [statusTokenId, setStatusTokenId] = useState("");
  const [titleStatus, setTitleStatus] = useState(null);

  // Hypothèque
  const [hypoForm, setHypoForm] = useState({ tokenId: "", creditor: "", amount: "", endDate: "" });

  // Mainlevée
  const [mainleveeForm, setMainleveeForm] = useState({ tokenId: "", encumbranceIndex: "" });

  const canWrite = role === "bank" || role === "admin";

  async function handleScore(e) {
    e.preventDefault();
    if (!scoreTokenId) return;
    setLoading(true);
    try {
      const data = await apiCall(`/bank/score/${scoreTokenId}`);
      setScore(data);
    } catch (err) {
      toast.error(err.message);
      setScore(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(e) {
    e.preventDefault();
    if (!statusTokenId) return;
    setLoading(true);
    try {
      const data = await apiCall(`/bank/titre/${statusTokenId}/status`);
      setTitleStatus(data);
    } catch (err) {
      toast.error(err.message);
      setTitleStatus(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleHypotheque(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        tokenId: parseInt(hypoForm.tokenId, 10),
        creditor: hypoForm.creditor,
        amount: parseFloat(hypoForm.amount),
        ...(hypoForm.endDate ? { endDate: Math.floor(new Date(hypoForm.endDate).getTime() / 1000) } : {}),
      };
      const data = await apiCall("/bank/hypotheque", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success(t("bank.toastHypotheque"));
      setHypoForm({ tokenId: "", creditor: "", amount: "", endDate: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleMainlevee(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiCall("/bank/mainlevee", {
        method: "POST",
        body: JSON.stringify({
          tokenId: parseInt(mainleveeForm.tokenId, 10),
          encumbranceIndex: parseInt(mainleveeForm.encumbranceIndex, 10),
        }),
      });
      toast.success(t("bank.toastMainlevee"));
      setMainleveeForm({ tokenId: "", encumbranceIndex: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "score",      label: t("bank.tabScore"),      icon: <TrendingUp className="w-4 h-4" /> },
    { id: "status",     label: t("bank.tabStatus"),     icon: <FileSearch className="w-4 h-4" /> },
    { id: "hypotheque", label: t("bank.tabHypotheque"), icon: <PlusCircle className="w-4 h-4" /> },
    { id: "mainlevee",  label: t("bank.tabMainlevee"),  icon: <MinusCircle className="w-4 h-4" /> },
  ];

  if (!isConnected) {
    return (
      <div className="glass rounded-xl p-12 text-center text-gray-500">
        <Landmark className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p>{t("common.connectWallet")}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Building2 className="w-10 h-10 text-blue-700" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("bank.title")}</h1>
          <p className="text-gray-600 mt-1">{t("bank.subtitle")}</p>
        </div>
      </div>

      {/* Role warning */}
      {role && role !== "bank" && role !== "admin" && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <BadgeCheck className="w-4 h-4" />
          {t("bank.roleWarning")}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Score ─────────────────────────────────────── */}
      {activeTab === "score" && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {t("bank.scoreTitle")}
          </h2>
          <form onSubmit={handleScore} className="flex gap-2 mb-4">
            <input
              className="input flex-1"
              placeholder={t("bank.tokenIdPlaceholder")}
              value={scoreTokenId}
              onChange={(e) => setScoreTokenId(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t("common.loading") : t("bank.analyzeBtn")}
            </button>
          </form>

          {score && (
            <div className="space-y-4">
              {/* Score gauge */}
              <div className="flex items-center gap-6 bg-gray-50 rounded-xl p-5">
                <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-bold text-2xl ${RATING_COLORS[score.rating] || ""}`}>
                  {score.rating}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">{t("bank.scoreLabel")}</div>
                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span className="font-semibold text-gray-700">{score.score}/100</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Title info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white border rounded-lg p-3">
                  <span className="text-gray-500">{t("bank.titreFoncier")}: </span>
                  <span className="font-medium">{score.titreFoncier}</span>
                </div>
                <div className="bg-white border rounded-lg p-3">
                  <span className="text-gray-500">{t("bank.canTransfer")}: </span>
                  <span className={score.canTransfer ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {score.canTransfer ? "✅ Oui" : "❌ Non"}
                  </span>
                </div>
              </div>

              {/* Factors */}
              {score.details?.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">{t("bank.scoringFactors")}</div>
                  <div className="space-y-1">
                    {score.details.map((d, i) => (
                      <div key={i} className="flex justify-between items-center text-sm bg-white border rounded p-2">
                        <span className="text-gray-600">{d.description}</span>
                        <span className={`font-semibold ${d.impact >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {d.impact >= 0 ? "+" : ""}{d.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Statut crédit ────────────────────────────── */}
      {activeTab === "status" && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-blue-600" />
            {t("bank.statusTitle")}
          </h2>
          <form onSubmit={handleStatus} className="flex gap-2 mb-4">
            <input
              className="input flex-1"
              placeholder={t("bank.tokenIdPlaceholder")}
              value={statusTokenId}
              onChange={(e) => setStatusTokenId(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t("common.loading") : t("bank.consultBtn")}
            </button>
          </form>

          {titleStatus && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div>
                  <div className="font-semibold text-gray-800">{titleStatus.titreFoncier}</div>
                  <div className="text-gray-500 font-mono text-xs mt-0.5">{titleStatus.owner}</div>
                </div>
                <span className={`badge ${CREDIT_STATUS_COLORS[titleStatus.creditStatus] || "badge-blue"}`}>
                  {titleStatus.creditStatus}
                </span>
              </div>

              {titleStatus.restrictions?.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="font-medium text-amber-800 mb-1">{t("bank.restrictions")}</div>
                  <ul className="space-y-1">
                    {titleStatus.restrictions.map((r, i) => (
                      <li key={i} className="text-amber-700 text-xs flex items-start gap-1">
                        <span>⚠️</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {titleStatus.activeEncumbrances?.length > 0 && (
                <div>
                  <div className="font-medium text-gray-700 mb-2">
                    {t("bank.activeCharges")} ({titleStatus.totalActiveCharges})
                  </div>
                  {titleStatus.activeEncumbrances.map((enc, i) => (
                    <div key={i} className="flex justify-between bg-white border rounded p-2 mb-1">
                      <div>
                        <span className="font-medium">{enc.type}</span>
                        <span className="text-gray-400 ml-2 text-xs font-mono">{enc.creditor?.slice(0, 8)}...</span>
                      </div>
                      <span className="text-gray-600">{enc.amount} ETH</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Hypothèque ──────────────────────────────── */}
      {activeTab === "hypotheque" && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            {t("bank.hypoTitle")}
          </h2>
          {!canWrite ? (
            <p className="text-gray-500 text-sm">{t("bank.roleWarning")}</p>
          ) : (
            <form onSubmit={handleHypotheque} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder={t("bank.tokenIdPlaceholder")}
                  value={hypoForm.tokenId}
                  onChange={(e) => setHypoForm({ ...hypoForm, tokenId: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder={t("bank.creditorPlaceholder")}
                  value={hypoForm.creditor}
                  onChange={(e) => setHypoForm({ ...hypoForm, creditor: e.target.value })}
                  required
                />
                <input
                  type="number"
                  step="0.001"
                  className="input"
                  placeholder={t("bank.amountPlaceholder")}
                  value={hypoForm.amount}
                  onChange={(e) => setHypoForm({ ...hypoForm, amount: e.target.value })}
                  required
                />
                <input
                  type="date"
                  className="input"
                  placeholder={t("bank.endDatePlaceholder")}
                  value={hypoForm.endDate}
                  onChange={(e) => setHypoForm({ ...hypoForm, endDate: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? t("common.txPending") : t("bank.hypoSubmit")}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── Tab: Mainlevée ───────────────────────────────── */}
      {activeTab === "mainlevee" && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MinusCircle className="w-5 h-5 text-blue-600" />
            {t("bank.mainleveeTitle")}
          </h2>
          {!canWrite ? (
            <p className="text-gray-500 text-sm">{t("bank.roleWarning")}</p>
          ) : (
            <form onSubmit={handleMainlevee} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder={t("bank.tokenIdPlaceholder")}
                  value={mainleveeForm.tokenId}
                  onChange={(e) => setMainleveeForm({ ...mainleveeForm, tokenId: e.target.value })}
                  required
                />
                <input
                  type="number"
                  className="input"
                  placeholder={t("bank.encumbranceIndexPlaceholder")}
                  value={mainleveeForm.encumbranceIndex}
                  onChange={(e) => setMainleveeForm({ ...mainleveeForm, encumbranceIndex: e.target.value })}
                  min="0"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">{t("bank.mainleveeHint")}</p>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? t("common.txPending") : t("bank.mainleveeSubmit")}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Info Card */}
      <div className="mt-6 glass rounded-xl p-5 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <CreditCard className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
          <p>{t("bank.infoDesc")}</p>
        </div>
      </div>
    </div>
  );
}
