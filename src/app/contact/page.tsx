// src/app/contact/page.tsx
export const dynamic = "force-dynamic";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Επικοινωνία | Real Estate",
  description: "Επικοινωνήστε μαζί μας για πωλήσεις ή ενοικιάσεις ακινήτων.",
};

export default function ContactPage() {
  return <ContactForm />;
}
