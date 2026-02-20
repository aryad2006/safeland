"use client";

import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n";
import { ArrowRight, Plus, Users, Vote } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const VOTE_TYPES = ["Sell", "Rent", "Renovate"];

export default function FriddaPage() {
  const { isConnected, role, apiCall } = useWallet();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  // Lookup
  const [lookupId, setLookupId] = useState("");
  const [dossier, setDossier] = useState(null);

  // Create
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    nftTokenId: "",
    heirsRaw: "", // "addr1,addr2,addr3"
    sharesRaw: "", // "3,14,7"
    adoulCid: "",
    notaryCid: "",
  });

  // Propose
  const [showPropose, setShowPropose] = useState(false);
  const [proposeForm, setProposeForm] = useState({
    dossierId: "",
    voteType: "0",
    description: "",
    quorumBps: "5000",
    durationDays: "7",
  });

  async function handleLookup(e) {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setLoading(true);
    try {
      const data = await apiCall(`/fridda/${lookupId}`);
      setDossier(data);
    } catch (err) {
      toast.error(err.message);
      setDossier(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const heirs = form.heirsRaw.split(",").map((h) => h.trim());
      const shares = form.sharesRaw.split(",").map((s) => parseInt(s.trim()));

      const data = await apiCall("/fridda", {
        method: "POST",
        body: JSON.stringify({
          nftTokenId: form.nftTokenId,
          heirs,
          shares,
          adoulCid: form.adoulCid,
          notaryCid: form.notaryCid,
        }),
      });
      toast.success(`${t("fridda.toastDossierCreated")}${data.dossierId}`);
      setShowCreate(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDistribute(dossierId) {
    setLoading(true);
    try {
      const data = await apiCall(`/fridda/${dossierId}/distribute`, { method: "POST" });
      toast.success(data.message);
      const updated = await apiCall(`/fridda/${dossierId}`);
      setDossier(updated);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalize(dossierId) {
    setLoading(true);
    try {
      const data = await apiCall(`/fridda/${dossierId}/finalize`, { method: "POST" });
      toast.success(data.message);
      const updated = await apiCall(`/fridda/${dossierId}`);
      setDossier(updated);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePropose(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiCall(`/fridda/${proposeForm.dossierId}/propose`, {
        method: "POST",
        body: JSON.stringify({
          voteType: parseInt(proposeForm.voteType),
          description: proposeForm.description,
          quorumBps: parseInt(proposeForm.quorumBps),
          durationDays: parseInt(proposeForm.durationDays),
        }),
      });
      toast.success(`${t("fridda.toastProposalCreated")}${data.proposalId}`);
      setShowPropose(false);
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
          <Users className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold">{t("fridda.title")}</h1>
        </div>
        <div className="flex gap-2">
          {isConnected && ["notary", "justice", "admin"].includes(role) && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> {t("fridda.newSuccession")}
            </button>
          )}
          {isConnected && (
            <button
              onClick={() => setShowPropose(!showPropose)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
            >
              <Vote className="w-4 h-4" /> {t("fridda.proposeBtn")}
            </button>
          )}
        </div>
      </div>

      {/* Info Fridda */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">{t("fridda.systemTitle")}</h2>
        <p className="text-sm text-gray-600 mb-4">{t("fridda.systemDesc")}</p>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-700">24</div>
            <div className="text-gray-500">{t("fridda.totalPartsLabel")}</div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="text-xl font-bold text-indigo-700">ERC-1155</div>
            <div className="text-gray-500">{t("fridda.standardToken")}</div>
          </div>
          <div className="p-3 bg-violet-50 rounded-lg">
            <div className="text-xl font-bold text-violet-700">50%+</div>
            <div className="text-gray-500">{t("fridda.defaultQuorum")}</div>
          </div>
        </div>
      </div>

      {/* Lookup */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t("fridda.lookupTitle")}</h2>
        <form onSubmit={handleLookup} className="flex gap-3">
          <input
            type="text"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder={t("fridda.lookupPlaceholder")}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
            {t("fridda.consultBtn")}
          </button>
        </form>

        {dossier && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">{t("fridda.dossierNumber")} #{dossier.dossierId}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">{t("fridda.nftToken")}</span> #{dossier.nftTokenId}</div>
              <div><span className="text-gray-500">{t("fridda.totalPartsLabel")}:</span> {dossier.totalShares}</div>
              <div>
                <span className="text-gray-500">{t("fridda.distributed")}</span>{" "}
                <span className={`badge ${dossier.distributed ? "badge-green" : "badge-yellow"}`}>
                  {dossier.distributed ? t("fridda.yes") : t("fridda.no")}
                </span>
              </div>
              <div>
                <span className="text-gray-500">{t("fridda.finalized")}:</span>{" "}
                <span className={`badge ${dossier.finalized ? "badge-green" : "badge-yellow"}`}>
                  {dossier.finalized ? t("fridda.yes") : t("fridda.no")}
                </span>
              </div>
            </div>

            {/* Héritiers */}
            <div>
              <h4 className="font-medium mb-2">{t("fridda.heirsTitle")}</h4>
              <div className="space-y-1">
                {dossier.heirs.map((heir, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 text-sm">
                    <span className="font-mono text-gray-600">{heir.slice(0, 10)}...{heir.slice(-6)}</span>
                    <span className="font-bold text-purple-700">{dossier.shares[i]}/24 {t("fridda.parts")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {isConnected && !dossier.finalized && ["notary", "admin"].includes(role) && (
              <div className="flex gap-3">
                {!dossier.distributed && (
                  <button onClick={() => handleDistribute(dossier.dossierId)} disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium">
                    {t("fridda.distributeParts")}
                  </button>
                )}
                {dossier.distributed && (
                  <button onClick={() => handleFinalize(dossier.dossierId)} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium">
                    {t("fridda.finalizeSuccession")}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{t("fridda.openTitle")}</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4">
            <input required placeholder={t("fridda.nftPlaceholder")} value={form.nftTokenId} onChange={(e) => setForm({ ...form, nftTokenId: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input required placeholder={t("fridda.heirsPlaceholder")} value={form.heirsRaw} onChange={(e) => setForm({ ...form, heirsRaw: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input required placeholder={t("fridda.sharesPlaceholder")} value={form.sharesRaw} onChange={(e) => setForm({ ...form, sharesRaw: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input placeholder={t("fridda.adoulPlaceholder")} value={form.adoulCid} onChange={(e) => setForm({ ...form, adoulCid: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input placeholder={t("fridda.notaryPlaceholder")} value={form.notaryCid} onChange={(e) => setForm({ ...form, notaryCid: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium">
                <ArrowRight className="w-4 h-4" /> {t("fridda.openDossier")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Propose Form */}
      {showPropose && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{t("fridda.governanceTitle")}</h2>
          <form onSubmit={handlePropose} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder={t("fridda.dossierIdPlaceholder")} value={proposeForm.dossierId} onChange={(e) => setProposeForm({ ...proposeForm, dossierId: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <select value={proposeForm.voteType} onChange={(e) => setProposeForm({ ...proposeForm, voteType: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="0">{t("fridda.sell")}</option>
              <option value="1">{t("fridda.rent")}</option>
              <option value="2">{t("fridda.renovate")}</option>
            </select>
            <input required placeholder={t("fridda.descriptionPlaceholder")} value={proposeForm.description} onChange={(e) => setProposeForm({ ...proposeForm, description: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2" />
            <input placeholder={t("fridda.quorumPlaceholder")} value={proposeForm.quorumBps} onChange={(e) => setProposeForm({ ...proposeForm, quorumBps: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input placeholder={t("fridda.durationPlaceholder")} value={proposeForm.durationDays} onChange={(e) => setProposeForm({ ...proposeForm, durationDays: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
                <Vote className="w-4 h-4" /> {t("fridda.submitProposal")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
