// src/components/home/HomeStats.tsx
export default function HomeStats() {
  const items = [
    { k: "500+", v: "Ακίνητα" },
    { k: "120+", v: "Περιοχές" },
    { k: "15",  v: "Χρόνια εμπειρίας" },
  ];
  return (
    <section className="bg-white border-y">
      <div className="container-safe py-8 grid grid-cols-3 gap-6 text-center">
        {items.map((it) => (
          <div key={it.v} className="py-2">
            <div className="text-2xl font-semibold text-gray-900">{it.k}</div>
            <div className="text-xs text-gray-600">{it.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
