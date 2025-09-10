export const dynamic = "force-static";

export default function UnderConstructionPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">🚧 Under Construction</h1>
        <p className="opacity-80">Επιστρέψτε σύντομα. Γίνεται εργασία αναβάθμισης.</p>
        <p className="text-xs mt-6 opacity-60">
          This page is temporarily hidden from the public.
        </p>
      </div>
    </main>
  );
}
