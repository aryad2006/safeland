"use client";

import { SUPPORTED_LOCALES, useI18n } from "@/i18n";
import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LOCALE_LABELS = {
  fr: { label: "Français", flag: "🇲🇦" },
  en: { label: "English", flag: "🇬🇧" },
  ar: { label: "العربية", flag: "🇲🇦" },
};

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Fermer le menu si clic extérieur
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:text-safeland-700 hover:bg-gray-100 rounded-lg transition"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{LOCALE_LABELS[locale].flag}</span>
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          {SUPPORTED_LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition
                ${locale === loc
                  ? "bg-safeland-50 text-safeland-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <span>{LOCALE_LABELS[loc].flag}</span>
              <span>{LOCALE_LABELS[loc].label}</span>
              {locale === loc && (
                <span className="ms-auto text-safeland-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
