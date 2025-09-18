// src/app/sell/page.tsx
export const dynamic = "force-dynamic";
//import SellStartForm from "./SellStartForm";

export const metadata = {
  title: "Πώληση Ακινήτου — Ξεκίνα | Properland",
  description:
    "Ξεκίνησε τη διαδικασία πώλησης του ακινήτου σου με νομικό έλεγχο, εκτίμηση, επαγγελματική παρουσίαση και στοχευμένη προώθηση.",
};

export default function SellPage() {
  return (
    <main className="container-safe">
      {/* HERO */}
      <section className="py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-emerald-700 text-xs font-medium bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              Πώληση Ακινήτου
            </span>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight">
              Έτοιμος/η να πουλήσεις; Ξεκίνα σωστά — από την πρώτη εκτίμηση.
            </h1>
            <p className="mt-3 text-gray-600 max-w-2xl">
              Αναλαμβάνουμε νομικό/τεχνικό έλεγχο, αξιόπιστη εκτίμηση, επαγγελματική
              φωτογράφιση και στοχευμένη προώθηση, ώστε να πετύχεις την καλύτερη τιμή
              στο σωστό χρόνο.
            </p>

            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
              <li>• Έκθεση εκτίμησης ακινήτου</li>
              <li>• Νομικός έλεγχος τίτλων</li>
              <li>• Σύσταση πλήρους φακέλου</li>
              <li>• Επαγγελματική φωτογράφιση</li>
              <li>• Προώθηση σε στοχευμένο κοινό</li>
              <li>• Διαπραγμάτευση & ολοκλήρωση</li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border bg-white p-3 shadow-sm">
              <div className="aspect-[4/3] w-full rounded-xl bg-gray-100 grid place-items-center text-gray-500">
                Εικόνα/γράφημα πώλησης
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Βήματα διαδικασίας */}
      <section className="my-10">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold mb-4">Πώς δουλεύουμε</h2>
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { t: "Συνάντηση", d: "Καταγραφή στόχων, στοιχείων ακινήτου & αγοράς." },
              { t: "Έλεγχοι", d: "Νομικός/τεχνικός έλεγχος και έγγραφα." },
              { t: "Εκτίμηση", d: "Τεκμηριωμένη εκτίμηση και στρατηγική τιμολόγηση." },
              { t: "Παρουσίαση", d: "Φωτογράφιση, αγγελία, κανάλια προώθησης." },
              { t: "Διαπραγμάτευση", d: "Ραντεβού, προσφορές, ολοκλήρωση συναλλαγής." },
            ].map((s, i) => (
              <li key={s.t} className="p-4 rounded-xl border bg-gray-50">
                <div className="text-xs text-gray-500">Βήμα {i + 1}</div>
                <div className="font-medium">{s.t}</div>
                <p className="text-sm text-gray-600 mt-1">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Φόρμα εκδήλωσης ενδιαφέροντος */}
      <section className="my-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          
        </div>
        <aside className="space-y-3">
          <div className="bg-white border rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Γιατί μαζί μας;</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Διαφανής διαδικασία & συμβουλευτική</li>
              <li>• Πρόσβαση σε δίκτυο αγοραστών</li>
              <li>• Βελτιστοποίηση τιμής & χρόνου</li>
            </ul>
          </div>
          <div className="bg-white border rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Επικοινωνία</h3>
            <p className="text-sm text-gray-700">
              Email:{" "}
              <a className="text-blue-600 underline" href="mailto:info@koutsourais.com">
                info@koutsourais.com
              </a>
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
