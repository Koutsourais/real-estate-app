import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Providers from "./providers"; 

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* HEADER: sticky πάνω */}
        <header className="sticky top-0 z-50 bg-gray-900 text-white border-b border-black/10">
          <nav className="container mx-auto flex justify-between items-center h-16 px-4">
            <h1 className="text-xl font-bold">Real Estate</h1>
            <ul className="flex space-x-6">
              <li><Link href="/">Αρχική</Link></li>
              <li><Link href="/properties">Ακίνητα</Link></li>
              <li><Link href="/contact">Επικοινωνία</Link></li>
            </ul>
          </nav>
        </header>

        {/* Προσοχή: padding-top για να μην κρύβεται το περιεχόμενο κάτω από το header */}
         <Providers>
          <main className="container mx-auto px-4 pt-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
