// src/components/home/HomeCTA.tsx
import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="container-safe my-16">
      <div className="rounded-2xl border bg-gradient-to-r from-emerald-50 to-blue-50 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Θέλεις εκτίμηση ή αναζήτηση κατά παραγγελία;</h3>
          <p className="text-sm text-gray-600 mt-1">Μιλάμε για τις ανάγκες σου και προτείνουμε λύσεις.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/contact" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Επικοινωνία
          </Link>
          <Link href="/sales" className="px-5 py-2.5 rounded-lg border hover:bg-white transition">
            Αναζήτηση ακινήτων
          </Link>
        </div>
      </div>
    </section>
  );
}
