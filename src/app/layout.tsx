// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { FiltersProvider } from "@/context/FiltersContext"; // ⬅️ σημαντικό: provider για τα φίλτρα

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Real Estate App",
  description: "Headless WordPress + Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        {/* HEADER: sticky πάνω */}
        <header className="sticky top-0 z-50 bg-gray-900 text-white border-b border-black/10">
          <nav className="container mx-auto flex justify-between items-center h-16 px-4">
            <h1 className="text-xl font-bold tracking-tight">Real Estate</h1>
            <ul className="flex space-x-6 text-sm">
              <li><Link href="/" className="hover:opacity-80">Αρχική</Link></li>
              <li><Link href="/" className="hover:opacity-80">Ακίνητα</Link></li>
              <li><Link href="/contact" className="hover:opacity-80">Επικοινωνία</Link></li>
            </ul>
          </nav>
        </header>

        {/* Ο provider τυλίγει ΟΛΗ την εφαρμογή για να δουλεύουν useFilters(), setFilters, clearFilters */}
        <FiltersProvider>
          {/* container + μικρό padding επάνω/πλάι */}
          <main className="container mx-auto px-4 py-4">
            {children}
          </main>
        </FiltersProvider>
      </body>
    </html>
  );
}
