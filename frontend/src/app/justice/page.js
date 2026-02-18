"use client";

import { useWallet } from "@/context/WalletContext";
import { useContracts } from "@/hooks/useContracts";
import { AlertTriangle, ArrowRight, Eye, Gavel, Scale, Shield } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ACTION_TYPES = ["Gel", "Remise de Titre", "Récupération Sociale"];
const ACTION_COLORS = {
  0: "bg-blue-100 text-blue-700",
  1: "bg-red-100 text-red-700",
  2: "bg-purple-100 text-purple-700",
};

export default function JusticePage() {
  const { isConnected, role, account } = useWallet();
  const contracts = useContracts();
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
      const a = await contracts.justice.getAction(lookupId);
      const total = await contracts.justice.totalActions();
      setTotalActions(Number(total));
      setAction({
        actionId: lookupId,
        tokenId: Number(a.tokenId),
        proposer: a.proposer,
        newOwner: a.newOwner,
        judgmentHash: a.judgmentHash,
        newUri: a.newUri,
        actionType: Number(a.actionType),
        actionTypeLabel: ACTION_TYPES[Number(a.actionType)] || "Inconnu",
        signatureCount: Number(a.signatureCount),
        executed: a.executed,
        createdAt: new Date(Number(a.createdAt) * 1000).toLocaleDateString("fr-FR"),
      });
    } catch (err) {
      toast.error("Action non trouvée : " + err.message);
      setAction(null);
    } finally { setLoading(false); }
  }

  async function handlePropose(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const hash = form.judgmentHash.startsWith("0x")
        ? form.judgmentHash
        : "0x" + Buffer.from(form.judgmentHash).toString("hex").padEnd(64, "0");
      const tx = await contracts.justice.proposeAction(
        form.tokenId,
        form.newOwner || "0x0000000000000000000000000000000000000000",
        hash,
        form.newUri || "",
        parseInt(form.actionType)
      );
      toast.loading("Proposition en cours...", { id: "tx" });
      await tx.wait();
      toast.success("Action judiciaire proposée !", { id: "tx" });
      setShowPropose(false);
      const total = await contracts.justice.totalActions();
      setTotalActions(Number(total));
    } catch (err) { toast.error(err.reason || err.message); }
    finally { setLoading(false); }
  }

  async function handleSign(actionId) {
    setLoading(true);
    try {
      const tx = await contracts.justice.signAction(actionId);
      toast.loading("Signature en cours...", { id: "tx" });
      await tx.wait();
      toast.success("Action signée !", { id: "tx" });
      handleLookup({ preventDefault: () => {} });
    } catch (err) { toast.error(err.reason || err.message); }
    finally { setLoading(false); }
  }

  async function handleExecute(actionId) {
    setLoading(true);
    try {
      const tx = await contracts.justice.executeAction(actionId);
      toast.loading("Exécution...", { id: "tx" });
      await tx.wait();
      toast.success("Action exécutée !", { id: "tx" });
      handleLookup({ preventDefault: () => {} });
    } catch (err) { toast.error(err.reason || err.message); }
    finally { setLoading(false); }
  }

  async function handleRecovery(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const tx = await contracts.justice.requestRecovery(recoveryForm.tokenId, recoveryForm.newWallet);
      toast.loading("Demande de récupération...", { id: "tx" });
      await tx.wait();
      toast.success("Demande de récupération sociale soumise !", { id: "tx" });
      setShowRecovery(false);
    } catch (err) { toast.error(err.reason || err.message); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-red-600" />
          <h1 className="text-2xl font-bold">Justice — Module Judiciaire</h1>
          {totalActions !== null && <span className="text-sm text-gray-500">({totalActions} action(s))</span>}
        </div>
        <div className="flex gap-2">
          {isConnected && ["justice", "admin"].includes(role) && (
            <button onClick={() => setShowPropose(!showPropose)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
              <Gavel className="w-4 h-4" /> Proposer Action
            </button>
          )}
          {isConnected && (
            <button onClick={() => setShowRecovery(!showRecovery)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
              <Shield className="w-4 h-4" /> Récupération
            </button>
          )}
        </div>
      </div>

      {/* Info Module */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" /> Fonctionnement Multi-Sig
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Le module judiciaire fonctionne en multi-signature. Chaque action requiert
          la signature de <strong>2 juges minimum</strong> avant exécution. Les actions possibles :
          gel de titre, remise forcée, et récupération sociale (perte de clé).
        </p>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-700">Gel</div>
            <div className="text-gray-500">Bloquer un titre</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-700">Remise</div>
            <div className="text-gray-500">Transfert forcé</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-700">Recovery</div>
            <div className="text-gray-500">Récupération clé</div>
          </div>
        </div>
      </div>

      {/* Lookup Action */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-red-600" /> Consulter une action (blockchain)
        </h2>
        <form onSubmit={handleLookup} className="flex gap-3">
          <input type="number" min="0" value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder="Action ID (ex: 0)" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
          <button type="submit" disabled={loading || !contracts} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Consulter</button>
        </form>

        {action && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">Action #{action.actionId}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${ACTION_COLORS[action.actionType] || "bg-gray-100"}`}>
                {action.actionTypeLabel}
              </span>
              {action.executed && <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Exécutée</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Token ID:</span> #{action.tokenId}</div>
              <div><span className="text-gray-500">Proposeur:</span> <span className="font-mono text-xs">{action.proposer}</span></div>
              <div><span className="text-gray-500">Nouveau proprio:</span> <span className="font-mono text-xs">{action.newOwner}</span></div>
              <div><span className="text-gray-500">Signatures:</span> <strong>{action.signatureCount}/2</strong></div>
              <div><span className="text-gray-500">Créé le:</span> {action.createdAt}</div>
            </div>

            {/* Progress bar signatures */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Signatures collectées</span>
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
                    <Gavel className="w-4 h-4" /> Signer l&apos;action
                  </button>
                )}
                {action.signatureCount >= 2 && ["justice", "admin"].includes(role) && (
                  <button onClick={() => handleExecute(action.actionId)} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm">
                    <ArrowRight className="w-4 h-4" /> Exécuter
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
          <h2 className="text-lg font-semibold mb-4">Proposer une action judiciaire</h2>
          <form onSubmit={handlePropose} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Token ID du titre" value={form.tokenId} onChange={(e) => setForm({...form, tokenId: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <select value={form.actionType} onChange={(e) => setForm({...form, actionType: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="0">Gel du titre</option>
              <option value="1">Remise forcée (burn/remint)</option>
              <option value="2">Récupération sociale</option>
            </select>
            <input placeholder="Nouveau propriétaire (0x..., optionnel)" value={form.newOwner} onChange={(e) => setForm({...form, newOwner: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input placeholder="Hash jugement (hex ou texte)" value={form.judgmentHash} onChange={(e) => setForm({...form, judgmentHash: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input placeholder="Nouvelle URI IPFS (optionnel)" value={form.newUri} onChange={(e) => setForm({...form, newUri: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2" />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium">
                <Gavel className="w-4 h-4" /> Proposer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recovery Form */}
      {showRecovery && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Récupération Sociale (perte de clé)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Si vous avez perdu l&apos;accès à votre wallet, soumettez une demande de récupération.
            Un juge devra valider la procédure.
          </p>
          <form onSubmit={handleRecovery} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Token ID du titre" value={recoveryForm.tokenId} onChange={(e) => setRecoveryForm({...recoveryForm, tokenId: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input required placeholder="Nouveau wallet (0x...)" value={recoveryForm.newWallet} onChange={(e) => setRecoveryForm({...recoveryForm, newWallet: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium">
                <Shield className="w-4 h-4" /> Demander la récupération
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
