// src/app/sell/SellStartForm.tsx
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window { grecaptcha: any }
}

export default function SellStartForm() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "error">(null);
  const [error, setError] = useState<string | null>(null);

  // πεδία
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");

  // honeypot
  const [hp, setHp] = useState("");

  useEffect(() => setError(null), [ownerName, email, phone, address, type, area, notes]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!ownerName || !email || !address) {
      setStatus("error");
      setError("Συμπληρώστε τουλάχιστον Όνομα, Email και Διεύθυνση.");
      return;
    }
    if (hp) {
      setStatus("error");
      setError("Αποτυχία επικύρωσης.");
      return;
    }

    const token = window.grecaptcha?.getResponse();
    if (!token) {
      setError("Παρακαλώ επιβεβαιώστε το reCAPTCHA.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: ownerName,
        email,
        phone,
        message:
          `Αίτημα πώλησης ακινήτου\n\n` +
          `Διεύθυνση: ${address}\n` +
          `Τύπος: ${type}\n` +
          `Εμβαδόν: ${area} m²\n` +
          (notes ? `Σημειώσεις: ${notes}\n` : ""),
        token,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Αποτυχία αποστολής.");

      setStatus("ok");
      setOwnerName(""); setEmail(""); setPhone(""); setAddress("");
      setType(""); setArea(""); setNotes("");
      window.grecaptcha?.reset();
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Αποτυχία αποστολής.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white border rounded-2xl p-6">
      <Script src="https://www.google.com/recaptcha/api.js" async defer />
      <h2 className="text-xl font-semibold mb-4">Ξεκίνα την πώληση</h2>
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        {/* Honeypot */}
        <div className="hidden">
          <label>Μην συμπληρώνεις:
            <input value={hp} onChange={(e) => setHp(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ονοματεπώνυμο</label>
            <input className="input w-full" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Π.χ. Γιώργος Παπαδόπουλος" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input w-full" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τηλέφωνο (προαιρετικό)</label>
            <input type="tel" className="input w-full" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+30 69..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τύπος ακινήτου</label>
            <select className="select w-full" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">— Επιλέξτε —</option>
              <option value="Διαμέρισμα">Διαμέρισμα</option>
              <option value="Μονοκατοικία">Μονοκατοικία</option>
              <option value="Μεζονέτα">Μεζονέτα</option>
              <option value="Οικόπεδο">Οικόπεδο</option>
              <option value="Επαγγελματικός">Επαγγελματικός χώρος</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Διεύθυνση/Περιοχή</label>
          <input className="input w-full" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Οδός, Αριθμός, Περιοχή" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Εμβαδόν (m²)</label>
            <input inputMode="numeric" className="input w-full" value={area} onChange={(e) => setArea(e.target.value.replace(/[^\d]/g, ""))} placeholder="π.χ. 85" />
          </div>
          <div />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Σημειώσεις (προαιρετικό)</label>
          <textarea className="input w-full min-h-[120px]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Χρήσιμες πληροφορίες για την πώληση" />
        </div>

        {/* reCAPTCHA checkbox
        <div className="g-recaptcha" data-sitekey={siteKey} /> */}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {submitting ? "Αποστολή..." : "Αποστολή"}
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        {status === "ok" && (
          <p className="text-sm text-green-700 mt-1">
            Ευχαριστούμε! Θα επικοινωνήσουμε σύντομα μαζί σας.
          </p>
        )}
      </form>
    </div>
  );
}
