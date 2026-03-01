"use client";

import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n";
import { ArrowRight, CheckCircle, DollarSign, FileText, Plus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNotifications } from "@/hooks/useNotifications";

const STATUS_COLORS = {
  Created: "badge-blue",
  SellerSigned: "badge-yellow",
  BuyerFunded: "badge-yellow",
  NotarySigned: "badge-blue",
  Completed: "badge-green",
  Cancelled: "badge-red",
};

export default function EscrowPage() {
  const { isConnected, role, apiCall } = useWallet();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  // Lookup
  const [lookupId, setLookupId] = useState("");
  const [deal, setDeal] = useState(null);
  const [fees, setFees] = useState(null);

  // Create
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ tokenId: "", seller: "", buyer: "", price: "" });

  // Auto-refresh current deal when on-chain events arrive
  const { notifications: dealEvents } = useNotifications(["deal.created", "deal.completed", "deal.cancelled", "escrow"]);
  useEffect(() => {
    if (dealEvents.length > 0 && lookupId) {
      apiCall(`/escrow/${lookupId}`)
        .then(setDeal)
        .catch(() => null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealEvents]);

  async function handleLookup(e) {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setLoading(true);
    try {
      const [dealData, feeData] = await Promise.all([
        apiCall(`/escrow/${lookupId}`),
        apiCall(`/escrow/${lookupId}/fees`),
      ]);
      setDeal(dealData);
      setFees(feeData);
    } catch (err) {
      toast.error(err.message);
      setDeal(null);
      setFees(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiCall("/escrow", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success(`${t("escrow.toastDealCreated")}${data.dealId}`);
      setShowCreate(false);
      setForm({ tokenId: "", seller: "", buyer: "", price: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(dealId, action, label) {
    setLoading(true);
    try {
      const data = await apiCall(`/escrow/${dealId}/${action}`, { method: "POST" });
      toast.success(data.message);
      // Refresh
      const updated = await apiCall(`/escrow/${dealId}`);
      setDeal(updated);
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
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">{t("escrow.title")}</h1>
        </div>
        {isConnected && ["notary", "admin"].includes(role) && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            {t("escrow.newDeal")}
          </button>
        )}
      </div>

      {/* Info Split Fiscal */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          {t("escrow.fiscalAuto")}
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">4%</div>
            <div className="text-sm text-gray-500">{t("escrow.dgiLabel")}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">1%</div>
            <div className="text-sm text-gray-500">{t("escrow.ancfccLabel")}</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-700">95%</div>
            <div className="text-sm text-gray-500">{t("escrow.sellerLabel")}</div>
          </div>
        </div>
      </div>

      {/* Lookup */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t("escrow.lookupTitle")}</h2>
        <form onSubmit={handleLookup} className="flex gap-3">
          <input
            type="text"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder={t("escrow.lookupPlaceholder")}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {t("escrow.consultBtn")}
          </button>
        </form>

        {deal && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">Deal #{deal.dealId}</h3>
              <span className={`badge ${STATUS_COLORS[deal.status] || "badge-blue"}`}>{deal.status}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">{t("escrow.tokenId")}:</span> {deal.tokenId}</div>
              <div><span className="text-gray-500">{t("escrow.price")}:</span> {deal.price} ETH</div>
              <div><span className="text-gray-500">{t("escrow.seller")}:</span> {deal.seller}</div>
              <div><span className="text-gray-500">{t("escrow.buyer")}:</span> {deal.buyer}</div>
              <div><span className="text-gray-500">{t("escrow.notary")}:</span> {deal.notary}</div>
              <div><span className="text-gray-500">{t("escrow.createdAt")}</span> {new Date(deal.createdAt).toLocaleDateString("fr-FR")}</div>
            </div>

            {fees && (
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <h4 className="font-medium mb-2">{t("escrow.fiscalDetail")}</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>{t("escrow.dgiFeeLabel")}: <strong>{fees.dgiFee} ETH</strong></div>
                  <div>{t("escrow.ancfccFeeLabel")}: <strong>{fees.ancfccFee} ETH</strong></div>
                  <div>{t("escrow.sellerAmountLabel")}: <strong>{fees.sellerAmount} ETH</strong></div>
                </div>
              </div>
            )}

            {/* Actions */}
            {isConnected && deal.status !== "Completed" && deal.status !== "Cancelled" && (
              <div className="flex gap-3 flex-wrap">
                {deal.status === "Created" && (
                  <button onClick={() => handleAction(deal.dealId, "seller-sign")} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 text-sm">
                    <CheckCircle className="w-4 h-4" /> {t("escrow.signSeller")}
                  </button>
                )}
                {deal.status === "SellerSigned" && (
                  <button onClick={() => handleAction(deal.dealId, "buyer-deposit")} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm">
                    <DollarSign className="w-4 h-4" /> {t("escrow.depositFunds")}
                  </button>
                )}
                {deal.status === "BuyerFunded" && ["notary", "admin"].includes(role) && (
                  <button onClick={() => handleAction(deal.dealId, "notary-complete")} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">
                    <ArrowRight className="w-4 h-4" /> {t("escrow.finalize")}
                  </button>
                )}
                {["notary", "admin"].includes(role) && (
                  <button onClick={() => handleAction(deal.dealId, "cancel")} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 text-sm">
                    <XCircle className="w-4 h-4" /> {t("common.cancel")}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{t("escrow.createTitle")}</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder={t("escrow.tokenIdPlaceholder")} value={form.tokenId} onChange={(e) => setForm({ ...form, tokenId: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input required placeholder={t("escrow.pricePlaceholder")} type="number" step="0.001" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input required placeholder={t("escrow.sellerPlaceholder")} value={form.seller} onChange={(e) => setForm({ ...form, seller: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input required placeholder={t("escrow.buyerPlaceholder")} value={form.buyer} onChange={(e) => setForm({ ...form, buyer: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
                <ArrowRight className="w-4 h-4" /> {t("escrow.createDealBtn")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
