"use client";

import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n";
import { AlertTriangle, ArrowRight, Eye, Gavel, Scale, Shield } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ACTION_TYPES_KEYS = ["justice.freezeTitle", "justice.remiseTitle", "justice.recoveryTitle"];
const ACTION_COLORS = {
  0: "bg-blue-100 text-blue-700",
  1: "bg-red-100 text-red-700",
  2: "bg-purple-100 text-purple-700",
};

export default function JusticePage() {
  const { isConnected, role, apiCall } = useWallet();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  // Lookup action
  const [lookupId, setLookupId] = useState("");
  const [action, setAction] = useState(null);
  const [totalActions, setTotalActions] = useState(null);

  // Proposer une action
  const [showPropose, setShowPropose] = useState(false);
  const [form, setForm] = useState({
    tokenId: "", newOwner: "", judgmentHash: "", newUri: "", actionType: "0",
  });

  // Récupération sociale
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryForm, setRecoveryForm] = useState({ tokenId: "", newWallet: "" });

  async function handleLookup(e) {
    e.preventDefault();
    if (lookupId === "") return;
    setLoading(true);
    try {
      const data = await apiCall(`/justice/actions/${lookupId}`);
      setTotalActions(data.totalActions ?? totalActions);
      setAction({
        actionId: lookupId,
        tokenId: data.tokenId,
        proposer: data.proposer,
        newOwner: data.newOwner,
        judgmentHash: data.judgmentHash,
        newUri: data.newUri,
        actionType: data.actionType,
        actionTypeLabel: t(ACTION_TYPES_KEYS[data.actionType] || "justice.freezeTitle"),
        signatureCount: data.signatureCount,
        executed: data.executed,
        createdAt: data.createdAt,
      });
    } catch (err) {
      toast.error(err.message);
      setAction(null);
    } finally { setLoading(false); }
  }

  async function handlePropose(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiCall("/justice/actions", {
        method: "POST",
        body: JSON.stringify({
          tokenId: form.tokenId,
          newOwner: form.newOwner || "0x0000000000000000000000000000000000000000",
          judgmentHash: form.judgmentHash,
          newUri: form.newUri || "",
          actionType: parseInt(form.actionType),
        }),
      });
      toast.success(data.message || t("common.txSuccess"));
      setShowPropose(false);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  async function handleSign(actionId) {
    setLoading(true);
    try {
      const data = await apiCall(`/justice/actions/${actionId}/sign`, { method: "POST" });
      toast.success(data.message || t("common.txSuccess"));
      handleLookup({ preventDefault: () => {} });
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  async function handleExecute(actionId) {
    setLoading(true);
    try {
      const data = await apiCall(`/justice/actions/${actionId}/execute`, { method: "POST" });
      toast.success(data.message || t("common.txSuccess"));
      handleLookup({ preventDefault: () => {} });
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  async function handleRecovery(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiCall("/justice/recovery", {
        method: "POST",
        body: JSON.stringify({
          tokenId: recoveryForm.tokenId,
          newWallet: recoveryForm.newWallet,
        }),
      });
      toast.success(data.message || t("common.txSuccess"));
      setShowRecovery(false);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-red-600" />
          <h1 className="text-2xl font-bold">{t("justice.title")}</h1>
          {totalActions !== null && <span className="text-sm text-gray-500">({totalActions} {t("justice.actionsCount")})</span>}
        </div>
        <div className="flex gap-2">
          {isConnected && ["justice", "admin"].includes(role) && (
            <button onClick={() => setShowPropose(!showPropose)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
              <Gavel className="w-4 h-4" /> {t("justice.proposeActionBtn")}
            </button>
          )}
          {isConnected && (
            <button onClick={() => setShowRecovery(!showRecovery)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
              <Shield className="w-4 h-4" /> {t("justice.recoveryBtn")}
            </button>
          )}
        </div>
      </div>

      {/* Info Module */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" /> {t("justice.multiSigTitle")}
        </h2>
        <p className="text-sm text-gray-600 mb-4">{t("justice.multiSigDesc")}</p>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-700">{t("justice.freezeTitle")}</div>
            <div className="text-gray-500">{t("justice.freezeDesc")}</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-700">{t("justice.remiseTitle")}</div>
            <div className="text-gray-500">{t("justice.remiseDesc")}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-700">{t("justice.recoveryTitle")}</div>
            <div className="text-gray-500">{t("justice.recoveryDesc")}</div>
          </div>
        </div>
      </div>

      {/* Lookup Action */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-red-600" /> {t("justice.lookupTitle")}
        </h2>
        <form onSubmit={handleLookup} className="flex gap-3">
          <input type="number" min="0" value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder={t("justice.lookupPlaceholder")} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
          <button type="submit" disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">{t("justice.consultBtn")}</button>
        </form>

        {action && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">{t("justice.actionNumber")} #{action.actionId}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${ACTION_COLORS[action.actionType] || "bg-gray-100"}`}>
                {action.actionTypeLabel}
              </span>
              {action.executed && <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{t("justice.executedBadge")}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">{t("justice.tokenIdLabel")}</span> #{action.tokenId}</div>
              <div><span className="text-gray-500">{t("justice.proposerLabel")}</span> <span className="font-mono text-xs">{action.proposer}</span></div>
              <div><span className="text-gray-500">{t("justice.newOwnerLabel")}</span> <span className="font-mono text-xs">{action.newOwner}</span></div>
              <div><span className="text-gray-500">{t("justice.signaturesLabel")}</span> <strong>{action.signatureCount}/2</strong></div>
              <div><span className="text-gray-500">{t("justice.createdAtLabel")}</span> {action.createdAt}</div>
            </div>

            {/* Progress bar signatures */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>{t("justice.signaturesCollected")}</span>
                <span className="font-bold">{action.signatureCount}/2</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${action.signatureCount >= 2 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${Math.min(action.signatureCount / 2 * 100, 100)}%` }} />
              </div>
            </div>

            {/* Actions */}
            {isConnected && !action.executed && (
              <div className="flex gap-3 flex-wrap">
                {["justice", "admin"].includes(role) && (
                  <button onClick={() => handleSign(action.actionId)} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 text-sm">
                    <Gavel className="w-4 h-4" /> {t("justice.signAction")}
                  </button>
                )}
                {action.signatureCount >= 2 && ["justice", "admin"].includes(role) && (
                  <button onClick={() => handleExecute(action.actionId)} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm">
                    <ArrowRight className="w-4 h-4" /> {t("justice.executeAction")}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Propose Form */}
      {showPropose && (
        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{t("justice.proposeTitle")}</h2>
          <form onSubmit={handlePropose} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder={t("justice.tokenIdPlaceholder")} value={form.tokenId} onChange={(e) => setForm({...form, tokenId: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <select value={form.actionType} onChange={(e) => setForm({...form, actionType: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="0">{t("justice.freezeOption")}</option>
              <option value="1">{t("justice.burnRemintOption")}</option>
              <option value="2">{t("justice.socialRecoveryOption")}</option>
            </select>
            <input placeholder={t("justice.newOwnerPlaceholder")} value={form.newOwner} onChange={(e) => setForm({...form, newOwner: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input placeholder={t("justice.judgmentHashPlaceholder")} value={form.judgmentHash} onChange={(e) => setForm({...form, judgmentHash: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input placeholder={t("justice.newUriPlaceholder")} value={form.newUri} onChange={(e) => setForm({...form, newUri: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2" />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium">
                <Gavel className="w-4 h-4" /> {t("justice.proposeSubmit")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recovery Form */}
      {showRecovery && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{t("justice.recoveryFormTitle")}</h2>
          <p className="text-sm text-gray-600 mb-4">{t("justice.recoveryFormDesc")}</p>
          <form onSubmit={handleRecovery} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder={t("justice.tokenIdPlaceholder")} value={recoveryForm.tokenId} onChange={(e) => setRecoveryForm({...recoveryForm, tokenId: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input required placeholder={t("justice.newWalletPlaceholder")} value={recoveryForm.newWallet} onChange={(e) => setRecoveryForm({...recoveryForm, newWallet: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium">
                <Shield className="w-4 h-4" /> {t("justice.requestRecovery")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
