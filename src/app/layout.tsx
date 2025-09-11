// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Real Estate App",
  description: "Headless WordPress + Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-gray-50 text-gray-900`}>
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-brand text-white shadow">
          <nav className="container mx-auto flex justify-between items-center h-16 px-4">
            <h1 className="text-xl font-bold">Real Estate</h1>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:underline">Αρχική</Link></li>
              <li><Link href="/sales" className="hover:underline">Πωλήσεις Ακινήτων</Link></li>
              <li><Link href="/contact" className="hover:underline">Επικοινωνία</Link></li>
            </ul>
          </nav>
        </header>

        <Providers>
          <main className="container mx-auto px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
