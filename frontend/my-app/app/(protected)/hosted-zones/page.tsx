import AppLayout from "@/components/layout/AppLayout";
import HostedZonesTable from "@/components/hosted-zones/HostedZonesTable";
import PageHeader from "@/components/hosted-zones/PageHeader";
import Pagination from "@/components/hosted-zones/Pagination";
import SearchBar from "@/components/hosted-zones/SearchBar";
import Toolbar from "@/components/hosted-zones/Toolbar";

export default function HostedZonesPage() {
  return (
    <AppLayout>
      <PageHeader />
      <Toolbar />
      <SearchBar />
      <HostedZonesTable />
      <Pagination />
    </AppLayout>
  );
}
