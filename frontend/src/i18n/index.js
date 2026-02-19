"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import ar from "./locales/ar.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const translations = { fr, en, ar };

const SUPPORTED_LOCALES = ["fr", "en", "ar"];
const DEFAULT_LOCALE = "fr";
const STORAGE_KEY = "safeland-locale";

/**
 * @typedef {{ locale: string, dir: 'ltr'|'rtl', t: (key: string) => string, setLocale: (l: string) => void }} I18nContextValue
 */
const I18nContext = createContext(null);

/**
 * Accède à une valeur imbriquée via un chemin en notation pointée.
 * Ex: get(obj, "hero.tagline") → obj.hero.tagline
 */
function get(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  // Charger la locale sauvegardée au montage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LOCALES.includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  // Appliquer dir + lang sur <html>
  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((newLocale) => {
    if (SUPPORTED_LOCALES.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }, []);

  /**
   * Fonction de traduction — accède aux clés via notation pointée.
   * @param {string} key - Ex: "nav.dashboard", "hero.tagline"
   * @returns {string}
   */
  const t = useCallback(
    (key) => {
      const value = get(translations[locale], key);
      if (value === undefined) {
        // Fallback vers le français
        const fallback = get(translations[DEFAULT_LOCALE], key);
        return fallback !== undefined ? fallback : key;
      }
      return value;
    },
    [locale]
  );

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ locale, dir, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook pour accéder aux traductions.
 * @returns {I18nContextValue}
 */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

export { DEFAULT_LOCALE, SUPPORTED_LOCALES };

