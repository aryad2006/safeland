import Navbar from "@/components/Navbar";
import { WalletProvider } from "@/context/WalletContext";
import { I18nProvider } from "@/i18n";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "SafeLand — Cadastre Blockchain Maroc",
  description:
    "Plateforme de gestion foncière décentralisée pour le Royaume du Maroc",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <WalletProvider>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Toaster position="bottom-right" />
          </WalletProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
