// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="container-safe py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand / About */}
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-emerald-700" />
            <span className="text-lg font-semibold">Properland</span>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Headless real-estate πλατφόρμα με WordPress + Next.js. Βρίσκουμε
            το σωστό ακίνητο — ή τον σωστό αγοραστή.
          </p>
        </div>

        {/* Γρήγορα Links */}
        <div>
          <h3 className="font-semibold mb-3">Πλοήγηση</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:underline" href="/">Αρχική</Link></li>
            <li><Link className="hover:underline" href="/sales">Πωλήσεις Ακινήτων</Link></li>
            <li><Link className="hover:underline" href="/rentals">Ενοικιάσεις Ακινήτων</Link></li>
            <li><Link className="hover:underline" href="/contact">Επικοινωνία</Link></li>
          </ul>
        </div>

        {/* Υπηρεσίες */}
        <div>
          <h3 className="font-semibold mb-3">Υπηρεσίες</h3>
          <ul className="space-y-2 text-sm">
            <li>Νομικός έλεγχος</li>
            <li>Έκθεση εκτίμησης</li>
            <li>Σύσταση φακέλου</li>
            <li>Φωτογράφιση ακινήτου</li>
          </ul>
        </div>

        {/* Επικοινωνία / Social */}
        <div>
          <h3 className="font-semibold mb-3">Επικοινωνία</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: <a className="text-blue-600 hover:underline" href="mailto:info@koutsourais.com">info@koutsourais.com</a></li>
            {/* αν θέλεις, πρόσθεσε τηλέφωνο/διεύθυνση */}
          </ul>

          <div className="flex gap-3 mt-4">
            <a aria-label="Instagram" className="inline-flex p-2 rounded-md border hover:bg-gray-50" href="#" rel="noopener">
              <Instagram className="h-4 w-4" />
            </a>
            <a aria-label="Facebook" className="inline-flex p-2 rounded-md border hover:bg-gray-50" href="#" rel="noopener">
              <Facebook className="h-4 w-4" />
            </a>
            <a aria-label="LinkedIn" className="inline-flex p-2 rounded-md border hover:bg-gray-50" href="#" rel="noopener">
              <LinkedIn className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container-safe py-4 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {year} Properland. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link className="hover:underline" href="/terms">Όροι χρήσης</Link>
            <Link className="hover:underline" href="/privacy">Πολιτική απορρήτου</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Logo({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M6.5 10.5V20h11v-9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function Instagram({ className="" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>
  );
}
function Facebook({ className="" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M14 8h2.5V5.5H14A3.5 3.5 0 0 0 10.5 9V11H8v2.5h2.5V21H13V13.5h2.6L16 11h-3V9a1 1 0 0 1 1-1Z" fill="currentColor"/>
    </svg>
  );
}
function LinkedIn({ className="" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M6.5 9.5H4V20h2.5V9.5ZM5.2 4a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm4.3 5.5H7.5V20H10V14.4c0-2.7 3.4-2.9 3.4 0V20H16v-6.6c0-4.7-5.2-4.5-6.5-2.6V9.5Z" fill="currentColor"/>
    </svg>
  );
}
