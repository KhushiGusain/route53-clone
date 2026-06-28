"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DeleteDnsRecordModal from "@/components/hosted-zones/DeleteDnsRecordModal";
import HostedZoneDetailsHeader from "@/components/hosted-zones/HostedZoneDetailsHeader";
import HostedZoneDetailsPanel from "@/components/hosted-zones/HostedZoneDetailsPanel";
import HostedZoneRecordsSection from "@/components/hosted-zones/HostedZoneRecordsSection";
import RecordDetailsPanel, {
  type RecordEditDraft,
} from "@/components/hosted-zones/RecordDetailsPanel";
import ResizableSidebar from "@/components/hosted-zones/ResizableSidebar";
import api from "@/lib/api";
import {
  canDeleteSelectedRecords,
  getSelectedRecords,
  getSidebarRecord,
  hasSystemGeneratedSelectedRecords,
} from "@/lib/dns-records";
import type { DNSRecord, HostedZone } from "@/lib/types";

type HostedZoneDetailsContentProps = {
  zone: HostedZone;
  successMessage?: string;
  onDeleteClick: () => void;
};

export default function HostedZoneDetailsContent({
  zone,
  successMessage,
  onDeleteClick,
}: HostedZoneDetailsContentProps) {
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecordIds, setSelectedRecordIds] = useState<number[]>([]);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const sidebarRecord = useMemo(
    () => getSidebarRecord(records, selectedRecordIds),
    [records, selectedRecordIds]
  );

  const selectedRecords = useMemo(
    () => getSelectedRecords(records, selectedRecordIds),
    [records, selectedRecordIds]
  );

  const fetchRecords = useCallback(
    async (options?: { clearSelection?: boolean }) => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hosted-zones/${zone.id}/records`
        );

        if (!response.ok) {
          throw new Error("Failed to load DNS records.");
        }

        const data = (await response.json()) as DNSRecord[];
        setRecords(data);

        if (options?.clearSelection !== false) {
          setSelectedRecordIds([]);
        }
      } catch {
        setError("Failed to load DNS records. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [zone.id]
  );

  const deleteDisabledTitle = hasSystemGeneratedSelectedRecords(
    records,
    selectedRecordIds
  )
    ? "System-generated records cannot be deleted."
    : undefined;

  function toggleRecordSelection(recordId: number) {
    setSelectedRecordIds((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId]
    );
  }

  async function handleSaveRecord(recordId: number, draft: RecordEditDraft) {
    const ttl = Number(draft.ttl);

    await api.updateDnsRecord(zone.id, recordId, {
      value: draft.value.trim(),
      ttl,
    });

    await fetchRecords({ clearSelection: false });
    setUpdateSuccessMessage("Record updated successfully.");
  }

  function handleDeleteRecordClick() {
    if (!canDeleteSelectedRecords(records, selectedRecordIds)) {
      return;
    }

    setDeleteError("");
    setDeleteErrorMessage("");
    setDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    if (!deletingRecord) {
      setDeleteModalOpen(false);
      setDeleteError("");
    }
  }

  async function handleConfirmDeleteRecord() {
    if (selectedRecordIds.length === 0) {
      return;
    }

    setDeletingRecord(true);
    setDeleteError("");
    setDeleteErrorMessage("");

    try {
      await Promise.all(
        selectedRecordIds.map((recordId) =>
          api.deleteDnsRecord(zone.id, recordId)
        )
      );
      setDeleteModalOpen(false);
      setSelectedRecordIds([]);
      await fetchRecords({ clearSelection: false });
      setDeleteSuccessMessage("Records deleted successfully.");
    } catch {
      const message = "Failed to delete one or more records. Please try again.";
      setDeleteError(message);
      setDeleteErrorMessage(message);
    } finally {
      setDeletingRecord(false);
    }
  }

  const actionSuccessMessage =
    deleteSuccessMessage || updateSuccessMessage || "";

  useEffect(() => {
    if (!actionSuccessMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDeleteSuccessMessage("");
      setUpdateSuccessMessage("");
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [actionSuccessMessage]);

  useEffect(() => {
    if (!deleteErrorMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDeleteErrorMessage("");
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [deleteErrorMessage]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const displaySuccessMessage =
    deleteSuccessMessage || updateSuccessMessage || successMessage || "";

  return (
    <div className="flex flex-col gap-5">
      {displaySuccessMessage && (
        <p
          className="rounded border border-green-700/50 bg-green-950/40 px-4 py-3 text-ui text-green-400"
          role="status"
        >
          {displaySuccessMessage}
        </p>
      )}

      {deleteErrorMessage && (
        <p className="text-ui text-red-400" role="alert">
          {deleteErrorMessage}
        </p>
      )}

      <div className="flex items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <HostedZoneDetailsHeader zone={zone} onDeleteClick={onDeleteClick} />
          <HostedZoneDetailsPanel zone={zone} recordCount={records.length} />
          <HostedZoneRecordsSection
            hostedZoneId={zone.id}
            records={records}
            loading={loading}
            error={error}
            selectedRecordIds={selectedRecordIds}
            onToggleRecord={toggleRecordSelection}
            deleteEnabled={canDeleteSelectedRecords(records, selectedRecordIds)}
            deleteDisabledTitle={deleteDisabledTitle}
            deletingRecord={deletingRecord}
            onDeleteRecordClick={handleDeleteRecordClick}
          />
        </div>

        {sidebarRecord && (
          <ResizableSidebar>
            <RecordDetailsPanel
              record={sidebarRecord}
              onClose={() => setSelectedRecordIds([])}
              onSave={handleSaveRecord}
            />
          </ResizableSidebar>
        )}
      </div>

      <DeleteDnsRecordModal
        records={selectedRecords}
        open={deleteModalOpen}
        deleting={deletingRecord}
        error={deleteError}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteRecord}
      />
    </div>
  );
}
