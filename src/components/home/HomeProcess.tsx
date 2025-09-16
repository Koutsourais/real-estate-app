// src/components/home/HomeProcess.tsx
export default function HomeProcess() {
  const steps = [
    { t: "Συζήτηση", d: "Καταγράφουμε ανάγκες και προϋπολογισμό." },
    { t: "Έρευνα", d: "Αναζήτηση και προεπιλογή ακινήτων." },
    { t: "Επίσκεψη", d: "Ραντεβού και αξιολόγηση στο χώρο." },
    { t: "Έλεγχος", d: "Νομικός/τεχνικός έλεγχος & διαπραγμάτευση." },
    { t: "Ολοκλήρωση", d: "Συμβόλαιο και παράδοση φακέλου." },
  ];
  return (
    <section className="container-safe my-12">
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">Πώς δουλεύουμε</h2>
        <ol className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <li key={s.t} className="p-4 rounded-xl border bg-gray-50">
              <div className="text-xs text-gray-500">Βήμα {i + 1}</div>
              <div className="font-medium">{s.t}</div>
              <p className="text-sm text-gray-600 mt-1">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
