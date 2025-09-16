import TopBar from "@/components/TopBar";
import ListingsPageShell from "@/components/ListingsPageShell";

export const metadata = { title: "Αγορά Ακινήτου" };

export default function SalesPage({ searchParams }: { searchParams: any }) {
  return (
    <>
      <TopBar /> {/* εμφανίζεται κάτω από το header του layout */}
      <ListingsPageShell
        searchParams={searchParams}
        title="Αγορά Ακινήτου"
        fixedAdType="Πώληση"
      />
    </>
  );
}
