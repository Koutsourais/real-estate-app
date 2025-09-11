import TopBar from "@/components/TopBar";
import ListingsPageShell from "@/components/ListingsPageShell";

export const metadata = { title: "Ενοικιάσεις Ακινήτων" };

export default function RentalsPage({ searchParams }: { searchParams: any }) {
  return (
    <>
      <TopBar />
      <ListingsPageShell
        searchParams={searchParams}
        title="Ενοικιάσεις Ακινήτων"
        fixedAdType="Ενοικίαση"
      />
    </>
  );
}
