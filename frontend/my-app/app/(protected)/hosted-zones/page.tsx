"use client";

import { useEffect, useState } from "react";
import type { HostedZone } from "@/lib/types";
import AppLayout from "@/components/layout/AppLayout";
import HostedZonesTable from "@/components/hosted-zones/HostedZonesTable";
import PageHeader from "@/components/hosted-zones/PageHeader";
import Pagination from "@/components/hosted-zones/Pagination";
import SearchBar from "@/components/hosted-zones/SearchBar";

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHostedZones() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hosted-zones`
        );

        if (!response.ok) {
          throw new Error("Failed to load hosted zones.");
        }

        const data = (await response.json()) as HostedZone[];
        setZones(data);
      } catch {
        setError("Failed to load hosted zones. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchHostedZones();
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-5">
        <PageHeader zoneCount={zones.length} />

        <div className="flex items-center gap-4">
          <SearchBar />
          <Pagination />
        </div>

        {loading && (
          <p className="text-ui text-aws-main-text-secondary">Loading...</p>
        )}

        {error && (
          <p className="text-ui text-red-400" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && <HostedZonesTable zones={zones} />}
      </div>
    </AppLayout>
  );
}
