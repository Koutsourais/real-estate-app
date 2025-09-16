// src/components/HomeServices.tsx
export default function HomeServices() {
  return (
    <section className="my-12">
      <div className="container-safe">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Αγορά ακινήτου */}
          <article className="bg-white border rounded-2xl p-6">
            <header className="flex items-center gap-3 mb-4">
              <HouseIcon className="h-6 w-6 text-emerald-700" />
              <h2 className="text-xl font-semibold">Αγορά ακινήτου</h2>
            </header>

            <ul className="space-y-4 text-[15px] leading-6">
              <li>Νομικός έλεγχος</li>
              <li>Έκθεση εκτίμησης ακινήτου</li>
              <li>Έκθεση αξιολόγησης ακινήτου πλειστηριασμού</li>
            </ul>
          </article>

          {/* Πώληση ακινήτου */}
          <article className="rounded-2xl p-6 border bg-emerald-50">
            <header className="flex items-center gap-3 mb-4">
              <KeyIcon className="h-6 w-6 text-emerald-700" />
              <h2 className="text-xl font-semibold">Πώληση ακινήτου</h2>
            </header>

            <ul className="space-y-4 text-[15px] leading-6">
              
              <li>Νομικός έλεγχος</li>
              <li>Έκθεση εκτίμησης ακινήτου</li>
              <li>Σύσταση φακέλου ακινήτου</li>
              <li>Υπηρεσία επαγγελματικής φωτογράφησης</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

function HouseIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function KeyIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.5 12.5 21 21M15.5 15.5l2-2M18 18l2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
