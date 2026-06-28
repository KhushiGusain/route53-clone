"use client";

import { useCallback, useEffect, useState } from "react";
import type { HostedZone } from "@/lib/types";
import AppLayout from "@/components/layout/AppLayout";
import DeleteHostedZoneModal from "@/components/hosted-zones/DeleteHostedZoneModal";
import HostedZonesTable from "@/components/hosted-zones/HostedZonesTable";
import PageHeader from "@/components/hosted-zones/PageHeader";
import Pagination, { paginateItems } from "@/components/hosted-zones/Pagination";
import SearchBar, {
  filterHostedZones,
  type HostedZoneFilter,
} from "@/components/hosted-zones/SearchBar";

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [filter, setFilter] = useState<HostedZoneFilter>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredZones = filterHostedZones(zones, filter);
  const { items: paginatedZones, totalPages, currentPage: safePage } =
    paginateItems(filteredZones, currentPage, pageSize);

  const selectedZone =
    selectedZoneId !== null
      ? zones.find((zone) => zone.id === selectedZoneId) ?? null
      : null;

  const fetchHostedZones = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
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
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchHostedZones(false);
  }, [fetchHostedZones]);

  function handleRefresh() {
    fetchHostedZones(true);
  }

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  useEffect(() => {
    if (
      selectedZoneId !== null &&
      !paginatedZones.some((zone) => zone.id === selectedZoneId)
    ) {
      setSelectedZoneId(null);
    }
  }, [paginatedZones, selectedZoneId]);

  function handleFilterChange(nextFilter: HostedZoneFilter) {
    setFilter(nextFilter);
    setCurrentPage(1);
  }

  function handlePageSizeChange(nextPageSize: number) {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  }

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
      await fetchHostedZones(true);
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
          filteredCount={filteredZones.length}
          totalCount={zones.length}
          hasActiveFilter={filter !== null}
          selectedZoneId={selectedZoneId}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onDeleteClick={handleDeleteClick}
        />

        <div className="flex items-start gap-4">
          <SearchBar
            zones={zones}
            filter={filter}
            onFilterChange={handleFilterChange}
          />
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

        {error && (
          <p className="text-ui text-red-400" role="alert">
            {error}
          </p>
        )}

        <HostedZonesTable
          zones={paginatedZones}
          selectedZoneId={selectedZoneId}
          loading={loading || refreshing}
          onSelectZone={setSelectedZoneId}
        />
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
