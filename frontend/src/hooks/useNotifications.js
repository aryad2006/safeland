"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook React pour les notifications temps réel SafeLand via WebSocket.
 *
 * Stable vis-à-vis des re-renders : passer un tableau inline (ex: ["all"])
 * ne déclenche PAS de reconnexion.  Les channels sont synchronisés via ref
 * et un re-subscribe est envoyé si les channels changent pendant la connexion.
 *
 * @param {string[]} channels - Canaux à écouter (ex: ["nft", "escrow", "fraud.alert"])
 * @param {object} options - { url, maxNotifications, onNotification }
 * @returns {{ notifications, connected, subscribe, unsubscribe, clear }}
 */
export function useNotifications(channels = ["all"], options = {}) {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws",
    maxNotifications = 50,
    onNotification = null,
  } = options;

  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  // Keep a ref to current channels so `connect` doesn't need them as a dep.
  // This prevents an inline-array caller from triggering infinite reconnects.
  const channelsRef = useRef(channels);
  // Sync the ref on every render (synchronous, safe before effects run)
  channelsRef.current = channels;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("🔔 WebSocket connecté");

      // S'abonner aux canaux courants
      if (channelsRef.current.length > 0) {
        ws.send(JSON.stringify({ action: "subscribe", channels: channelsRef.current }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "notification") {
          const notification = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            channel: msg.channel,
            ...msg.data,
            receivedAt: new Date(msg.timestamp),
          };

          setNotifications((prev) => {
            const updated = [notification, ...prev];
            return updated.slice(0, maxNotifications);
          });

          if (onNotification) {
            onNotification(notification);
          }
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("🔌 WebSocket déconnecté, reconnexion dans 5s...");
      reconnectTimer.current = setTimeout(connect, 5000);
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, maxNotifications, onNotification]);
  // NOTE: `channels` is intentionally excluded — we read it via channelsRef so
  // callers can safely pass inline arrays without causing reconnects.

  useEffect(() => {
    connect();

    return () => {
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // When channels change while already connected, re-subscribe without reconnecting
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && channels.length > 0) {
      wsRef.current.send(JSON.stringify({ action: "subscribe", channels }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels.join(",")]);

  const subscribe = useCallback((newChannels) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: "subscribe", channels: newChannels })
      );
    }
  }, []);

  const unsubscribe = useCallback((removeChannels) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: "unsubscribe", channels: removeChannels })
      );
    }
  }, []);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    connected,
    subscribe,
    unsubscribe,
    clear,
  };
}
