"use client";

import { useCallback, useEffect, useState } from "react";
import type { HostedZone } from "@/lib/types";
import AppLayout from "@/components/layout/AppLayout";
import DeleteHostedZoneModal from "@/components/hosted-zones/DeleteHostedZoneModal";
import HostedZonesTable from "@/components/hosted-zones/HostedZonesTable";
import PageHeader from "@/components/hosted-zones/PageHeader";
import Pagination from "@/components/hosted-zones/Pagination";
import SearchBar from "@/components/hosted-zones/SearchBar";

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const selectedZone =
    selectedZoneId !== null
      ? zones.find((zone) => zone.id === selectedZoneId) ?? null
      : null;

  const fetchHostedZones = useCallback(async () => {
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
      setSelectedZoneId((current) =>
        current !== null && data.some((zone) => zone.id === current)
          ? current
          : null
      );
    } catch {
      setError("Failed to load hosted zones. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHostedZones();
  }, [fetchHostedZones]);

  function handleDeleteClick() {
    if (selectedZone) {
      setDeleteError("");
      setDeleteModalOpen(true);
    }
  }

  function handleCloseDeleteModal() {
    if (!deleting) {
      setDeleteModalOpen(false);
      setDeleteError("");
    }
  }

  async function handleConfirmDelete() {
    if (selectedZoneId === null) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hosted-zones/${selectedZoneId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete hosted zone.");
      }

      setDeleteModalOpen(false);
      setSelectedZoneId(null);
      await fetchHostedZones();
    } catch {
      setDeleteError("Failed to delete hosted zone. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-5">
        <PageHeader
          zoneCount={zones.length}
          selectedZoneId={selectedZoneId}
          onDeleteClick={handleDeleteClick}
        />

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

        {!loading && !error && (
          <HostedZonesTable
            zones={zones}
            selectedZoneId={selectedZoneId}
            onSelectZone={setSelectedZoneId}
          />
        )}
      </div>

      {selectedZone && (
        <DeleteHostedZoneModal
          zoneName={selectedZone.name}
          open={deleteModalOpen}
          deleting={deleting}
          error={deleteError}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </AppLayout>
  );
}
