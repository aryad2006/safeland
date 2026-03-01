"use client";
import { AlertTriangle, Bell, Info, X } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";

const SEVERITY_CONFIG = {
  critical: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 border-red-200" },
  high: { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50 border-orange-200" },
  default: { icon: Info, color: "text-blue-500", bg: "bg-blue-50 border-blue-200" },
};

function formatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function getLabel(notification) {
  const labels = {
    PropertyCreated: "Nouvelle propriété créée",
    PropertyTransferred: "Propriété transférée",
    PropertyFrozenByJustice: "🚨 Propriété gelée par la justice",
    PropertyBurned: "🔥 Titre détruit",
    DealCreated: "Nouveau deal escrow",
    DealCompleted: "✅ Deal complété",
    DealCancelled: "❌ Deal annulé",
    SuccessionOpened: "📂 Succession ouverte",
    SuccessionFinalized: "✅ Succession finalisée",
    ActionProposed: "⚖️ Action judiciaire proposée",
    ActionExecuted: "⚖️ Action judiciaire exécutée",
    FraudPrevented: "🚨 Tentative de fraude détectée",
    VoteCast: "🗳️ Vote enregistré",
    ProposalExecuted: "📋 Proposition exécutée",    // Timelock
    OperationScheduled: "⏱️ Opération Timelock planifiée",
    OperationExecuted: "✅ Opération Timelock exécutée",
    OperationCancelled: "⛔ Opération Timelock annulée",
    MinDelayChange: "⚠️ Délai minimum modifié",  };
  return labels[notification.event] || notification.event;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, connected, clear } = useNotifications(["all"]);

  const unread = notifications.length;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className={`w-5 h-5 ${connected ? "text-gray-700" : "text-gray-400"}`} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
        {!connected && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[480px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={clear}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Tout effacer
                </button>
              )}
              <button onClick={() => setOpen(false)}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="overflow-y-auto max-h-[400px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune notification</p>
                <p className="text-xs mt-1">
                  {connected ? "En écoute des événements…" : "WebSocket déconnecté"}
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const severity = SEVERITY_CONFIG[n.severity] || SEVERITY_CONFIG.default;
                const Icon = severity.icon;
                return (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${severity.bg}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${severity.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {getLabel(n)}
                        </p>
                        {n.tokenId && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Token #{n.tokenId}
                            {n.txType && ` • ${n.txType}`}
                          </p>
                        )}
                        {n.dealId && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Deal #{n.dealId}
                            {n.price && ` • ${n.price} ETH`}
                          </p>
                        )}
                        {n.operationId && (
                          <p className="text-xs text-gray-500 mt-0.5 font-mono">
                            op: {n.operationId.slice(0, 14)}…
                            {n.description && ` • ${n.description}`}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {n.channel} • {formatTime(n.receivedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
