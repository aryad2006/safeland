"use client";

import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
  PlayCircle,
  PlusCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNotifications } from "@/hooks/useNotifications";

const STATUS_COLORS = {
  Pending:   "badge-yellow",
  Executed:  "badge-green",
  Cancelled: "badge-red",
};

const STATUS_ICONS = {
  Pending:   <Clock className="w-4 h-4 inline mr-1" />,
  Executed:  <CheckCircle className="w-4 h-4 inline mr-1" />,
  Cancelled: <XCircle className="w-4 h-4 inline mr-1" />,
};

export default function TimelockPage() {
  const { isConnected, role, apiCall } = useWallet();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState(null);

  // Lookup
  const [lookupId, setLookupId] = useState("");
  const [operation, setOperation] = useState(null);

  // Schedule form
  const [showSchedule, setShowSchedule] = useState(false);
  const [form, setForm] = useState({
    target: "", value: "0", data: "0x", salt: "", delay: "86400", description: "",
  });

  const isAdmin = role === "admin";

  // Auto-refresh when Timelock events arrive via WebSocket
  const timelockChannels = useMemo(() => ["timelock.scheduled", "timelock.executed", "timelock.cancelled"], []);
  const { notifications: timelockEvents } = useNotifications(timelockChannels);

  useEffect(() => {
    if (timelockEvents.length > 0) {
      loadStats();
      // Refresh current operation if we're viewing one
      if (lookupId) {
        apiCall(`/timelock/operations/${lookupId}`)
          .then(setOperation)
          .catch(() => null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelockEvents]);

  async function loadStats() {
    try {
      const data = await apiCall("/timelock/pending");
      setStats(data);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleLookup(e) {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setLoading(true);
    try {
      const data = await apiCall(`/timelock/operations/${lookupId.trim()}`);
      setOperation(data);
    } catch (err) {
      toast.error(err.message);
      setOperation(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSchedule(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiCall("/timelock/schedule", {
        method: "POST",
        body: JSON.stringify({ ...form, delay: parseInt(form.delay, 10) }),
      });
      toast.success(`${t("timelock.toastScheduled")} ${data.operationId?.slice(0, 10)}...`);
      setShowSchedule(false);
      setForm({ target: "", value: "0", data: "0x", salt: "", delay: "86400", description: "" });
      loadStats();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(operationId) {
    setLoading(true);
    try {
      await apiCall(`/timelock/${operationId}/cancel`, { method: "POST" });
      toast.success(t("timelock.toastCancelled"));
      setOperation((prev) => prev ? { ...prev, status: "Cancelled" } : prev);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleExecute(operationId) {
    if (!operation) return;
    setLoading(true);
    try {
      await apiCall(`/timelock/${operationId}/execute`, {
        method: "POST",
        body: JSON.stringify({
          target: operation.target,
          value: operation.value,
          data: "0x",
          salt: lookupId,
        }),
      });
      toast.success(t("timelock.toastExecuted"));
      setOperation((prev) => prev ? { ...prev, status: "Executed" } : prev);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Auto-load stats on mount
  useEffect(() => { loadStats(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Lock className="w-10 h-10 text-slate-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("timelock.title")}</h1>
            <p className="text-gray-600 mt-1">{t("timelock.subtitle")}</p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
          >
            <PlusCircle className="w-4 h-4" />
            {t("timelock.scheduleBtn")}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-700">{stats.totalOperations}</div>
            <div className="text-sm text-gray-500">{t("timelock.totalOps")}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-700">
              {Math.floor(Number(stats.minDelaySeconds) / 86400)}j
            </div>
            <div className="text-sm text-gray-500">{t("timelock.minDelay")}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-700">
              {Math.floor(Number(stats.maxDelaySeconds) / 86400)}j
            </div>
            <div className="text-sm text-gray-500">{t("timelock.maxDelay")}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-700">
              {Math.floor(Number(stats.gracePeriodSeconds) / 86400)}j
            </div>
            <div className="text-sm text-gray-500">{t("timelock.gracePeriod")}</div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="glass rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          {t("timelock.howItWorksTitle")}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{t("timelock.howItWorksDesc")}</p>
        <div className="flex flex-col sm:flex-row gap-2 text-sm">
          <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center">
            <div className="font-semibold text-slate-700">1. {t("timelock.stepSchedule")}</div>
            <div className="text-gray-500 text-xs mt-1">{t("timelock.stepScheduleDesc")}</div>
          </div>
          <div className="flex-1 bg-amber-50 rounded-lg p-3 text-center">
            <div className="font-semibold text-amber-700">2. {t("timelock.stepWait")}</div>
            <div className="text-gray-500 text-xs mt-1">{t("timelock.stepWaitDesc")}</div>
          </div>
          <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
            <div className="font-semibold text-green-700">3. {t("timelock.stepExecute")}</div>
            <div className="text-gray-500 text-xs mt-1">{t("timelock.stepExecuteDesc")}</div>
          </div>
        </div>
      </div>

      {/* Schedule Form */}
      {showSchedule && isAdmin && (
        <div className="glass rounded-xl p-6 mb-8 border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">{t("timelock.scheduleTitle")}</h2>
          <form onSubmit={handleSchedule} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="input"
                placeholder={t("timelock.targetPlaceholder")}
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
                required
              />
              <input
                type="text"
                className="input"
                placeholder={t("timelock.saltPlaceholder")}
                value={form.salt}
                onChange={(e) => setForm({ ...form, salt: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                className="input"
                placeholder="Value (ETH, défaut: 0)"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
              <input
                className="input"
                placeholder="Data (hex, défaut: 0x)"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
              />
              <input
                type="number"
                className="input"
                placeholder={t("timelock.delayPlaceholder")}
                value={form.delay}
                onChange={(e) => setForm({ ...form, delay: e.target.value })}
                min="86400"
                required
              />
            </div>
            <textarea
              className="input w-full"
              rows={2}
              placeholder={t("timelock.descPlaceholder")}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? t("common.txPending") : t("timelock.scheduleSubmit")}
              </button>
              <button
                type="button"
                onClick={() => setShowSchedule(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lookup */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t("timelock.lookupTitle")}</h2>
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            className="input flex-1"
            placeholder={t("timelock.lookupPlaceholder")}
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t("common.loading") : t("timelock.consultBtn")}
          </button>
        </form>

        {operation && (
          <div className="mt-4 bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">
                {t("timelock.opLabel")} {operation.operationId?.slice(0, 16)}...
              </span>
              <span className={`badge ${STATUS_COLORS[operation.status] || "badge-blue"}`}>
                {STATUS_ICONS[operation.status]}
                {operation.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">{t("timelock.targetLabel")} </span>
                <span className="font-mono text-xs">{operation.target}</span>
              </div>
              <div>
                <span className="text-gray-500">{t("timelock.proposerLabel")} </span>
                <span className="font-mono text-xs">{operation.proposer}</span>
              </div>
              <div>
                <span className="text-gray-500">{t("timelock.readyAtLabel")} </span>
                <span>{operation.readyAt ? new Date(operation.readyAt).toLocaleString() : "—"}</span>
              </div>
              <div>
                <span className="text-gray-500">{t("timelock.valueLabel")} </span>
                <span>{operation.value} ETH</span>
              </div>
            </div>

            {operation.description && (
              <div className="mt-2 bg-white border border-slate-200 rounded p-2 text-gray-700">
                {operation.description}
              </div>
            )}

            {operation.status === "Pending" && isAdmin && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleExecute(operation.operationId)}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                >
                  <PlayCircle className="w-4 h-4" />
                  {t("timelock.executeBtn")}
                </button>
                <button
                  onClick={() => handleCancel(operation.operationId)}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  <XCircle className="w-4 h-4" />
                  {t("timelock.cancelBtn")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auth warning */}
      {!isConnected && (
        <div className="glass rounded-xl p-6 text-center text-gray-500">
          <Lock className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>{t("common.connectWallet")}</p>
        </div>
      )}
    </div>
  );
}
