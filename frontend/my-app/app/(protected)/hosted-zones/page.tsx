import AppLayout from "@/components/layout/AppLayout";
import HostedZonesTable from "@/components/hosted-zones/HostedZonesTable";
import PageHeader from "@/components/hosted-zones/PageHeader";
import Pagination from "@/components/hosted-zones/Pagination";
import SearchBar from "@/components/hosted-zones/SearchBar";

export default function HostedZonesPage() {
  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-5">
        <PageHeader />

        <div className="flex items-center gap-4">
          <SearchBar />
          <Pagination />
        </div>

        <HostedZonesTable />
      </div>
    </AppLayout>
  );
}
