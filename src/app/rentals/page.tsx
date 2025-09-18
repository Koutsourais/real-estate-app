export const dynamic = "force-dynamic";
import TopBar from "@/components/TopBar";
import ListingsPageShell from "@/components/ListingsPageShell";

export const metadata = { title: "Ενοικίαση Ακινήτου" };

export default function RentalsPage({ searchParams }: { searchParams: any }) {
  return (
    <>
      <TopBar />
      <ListingsPageShell
        searchParams={searchParams}
        title="Ενοικίαση Ακινήτου"
        fixedAdType="Ενοικίαση"
      />
    </>
  );
}
