// src/components/home/HomeHero.tsx
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="container-safe py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-emerald-700 text-xs font-medium bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
             
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight">
              Βρίσκουμε το σωστό ακίνητο —<br className="hidden md:block" />
              ή τον σωστό αγοραστή.
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl">
              Ευέλικτη πλατφόρμα αγοραπωλησιών με φίλτρα και χάρτη. <br></br>Ξεκίνα την αναζήτηση ή ζήτα εκτίμηση.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/sales" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                Αγορές Ακινήτων
              </Link>
              <Link href="/rentals" className="px-5 py-2.5 rounded-lg border hover:bg-gray-50 transition">
                Ενοικιάσεις Ακινήτων
              </Link>
              <Link href="/contact" className="px-5 py-2.5 rounded-lg border hover:bg-gray-50 transition">
                Επικοινωνία
              </Link>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><Check /> Νομικός & τεχνικός έλεγχος</li>
              <li className="flex items-center gap-2"><Check /> Εκτίμηση αξίας</li>
              <li className="flex items-center gap-2"><Check /> Επαγγελματική φωτογράφιση</li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border bg-white p-3 shadow-sm">
              <div className="aspect-[4/3] w-full rounded-xl bg-[url('/hero.jpg')] bg-cover bg-center" />
              {/* Αν δεν έχεις εικόνα, βάλε ένα απλό placeholder */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
}
function Dot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />;
}
