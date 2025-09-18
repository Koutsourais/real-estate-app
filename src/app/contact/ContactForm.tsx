// // src/app/contact/ContactForm.tsx
// "use client";

// import { useState } from "react";

// export default function ContactForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");
//   const [sent, setSent] = useState<null | "ok" | "error">(null);
//   const [submitting, setSubmitting] = useState(false);

//   // CONFIG: άλλαξε το email παραλήπτη εδώ
//   const to = "info@koutsourais.com";

//   // απλό honeypot για bots (αν συμπληρωθεί, δεν στέλνουμε)
//   const [hp, setHp] = useState("");

//   const subject = `Επικοινωνία από ${name || "επισκέπτη"}`;
//   const body =
//     `Όνομα: ${name}\n` +
//     `Email: ${email}\n` +
//     (phone ? `Τηλέφωνο: ${phone}\n` : "") +
//     `\nΜήνυμα:\n${message}\n`;

//   const mailtoHref = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
//     subject
//   )}&body=${encodeURIComponent(body)}`;

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!name || !email || !message || hp) {
//       setSent("error");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       // προς το παρόν χρησιμοποιούμε mailto (λειτουργεί άμεσα χωρίς backend)
//       window.location.href = mailtoHref;
//       setSent("ok");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <main className="container-safe">
//       <h1 className="text-2xl font-semibold mb-4">Επικοινωνία</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Φόρμα */}
//         <section className="lg:col-span-2 bg-white border rounded-2xl p-6">
//           <form onSubmit={onSubmit} className="space-y-4" noValidate>
//             {/* Honeypot (κρυφό πεδίο) */}
//             <div className="hidden">
//               <label>
//                 Μην συμπληρώνεις αυτό το πεδίο
//                 <input value={hp} onChange={(e) => setHp(e.target.value)} />
//               </label>
//             </div>

//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                 Όνομα
//               </label>
//               <input
//                 id="name"
//                 className="input w-full"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Το ονοματεπώνυμό σας"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   className="input w-full"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@example.com"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                   Τηλέφωνο (προαιρετικό)
//                 </label>
//                 <input
//                   id="phone"
//                   type="tel"
//                   className="input w-full"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   placeholder="+30 69..."
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
//                 Μήνυμα
//               </label>
//               <textarea
//                 id="message"
//                 className="input w-full min-h-[140px]"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Πείτε μας πώς μπορούμε να βοηθήσουμε"
//                 required
//               />
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
//               >
//                 {submitting ? "Αποστολή..." : "Αποστολή"}
//               </button>

//               <a
//                 href={mailtoHref}
//                 className="text-sm text-blue-600 underline"
//                 onClick={() => setSent("ok")}
//               >
//                 ή άνοιξε τον email client
//               </a>
//             </div>

//             {sent === "ok" && (
//               <p className="text-sm text-green-700 mt-1">
//                 Σας ευχαριστούμε! Ανοίξαμε τον email client σας με τα στοιχεία.
//               </p>
//             )}
//             {sent === "error" && (
//               <p className="text-sm text-red-600 mt-1">
//                 Συμπληρώστε τουλάχιστον Όνομα, Email και Μήνυμα.
//               </p>
//             )}
//           </form>
//         </section>

//         {/* Sidebar πληροφοριών */}
//         <aside className="lg:col-span-1 space-y-3">
//           <div className="bg-white border rounded-2xl p-4">
//             <h2 className="font-semibold mb-2">Στοιχεία Επικοινωνίας</h2>
//             <p className="text-sm text-gray-700">
//               Email:{" "}
//               <a className="text-blue-600 underline" href={`mailto:${to}`}>
//                 {to}
//               </a>
//             </p>
//             {/* Πρόσθεσε διεύθυνση, ώρες, social, χάρτη κ.λπ. */}
//           </div>
//         </aside>
//       </div>
//     </main>
//   );
// }
