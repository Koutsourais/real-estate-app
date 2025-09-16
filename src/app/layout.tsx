// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Footer from "@/components/Footer";
import HeaderNav from "@/components/HeaderNav"; // 👈 header με language dropdown

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
          <HeaderNav />
        </header>

        <Providers>
          <main className="container mx-auto px-4 py-6">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
