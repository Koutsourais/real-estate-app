import TopBar from "@/components/TopBar";
import ListingsPageShell from "@/components/ListingsPageShell";

export const metadata = { title: "Πωλήσεις Ακινήτων" };

export default function SalesPage({ searchParams }: { searchParams: any }) {
  return (
    <>
      <TopBar /> {/* εμφανίζεται κάτω από το header του layout */}
      <ListingsPageShell
        searchParams={searchParams}
        title="Πωλήσεις Ακινήτων"
        fixedAdType="Πώληση"
      />
    </>
  );
}
