export const dynamic = "force-dynamic";
import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import ListingsPageShell from "@/components/ListingsPageShell";

export const metadata = { title: "Αγορά Ακινήτου" };

export default function SalesPage({ searchParams }: { searchParams: any }) {
  return (
    <>
      <Suspense fallback={null}>
        <TopBar />
      </Suspense> {/* εμφανίζεται κάτω από το header του layout */}
      <ListingsPageShell
        searchParams={searchParams}
        title="Αγορά Ακινήτου"
        fixedAdType="Πώληση"
      />
    </>
  );
}
