"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import DeleteHostedZoneModal from "@/components/hosted-zones/DeleteHostedZoneModal";
import HostedZoneDetailsContent from "@/components/hosted-zones/HostedZoneDetailsContent";
import api from "@/lib/api";
import type { HostedZone } from "@/lib/types";

export default function HostedZoneDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const zoneId = params.id as string;

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const recordsCreated = searchParams.get("recordsCreated");
    if (!recordsCreated) {
      return;
    }

    const count = Number(recordsCreated);
    if (!Number.isNaN(count) && count > 0) {
      setSuccessMessage(
        `Successfully created ${count} record${count === 1 ? "" : "s"}.`,
      );
    }

    router.replace(`/hosted-zones/${zoneId}`);
  }, [router, searchParams, zoneId]);

  useEffect(() => {
    async function fetchHostedZone() {
      setLoading(true);
      setFetchError("");

      try {
        const data = await api.getHostedZone(zoneId);
        setZone(data);
      } catch {
        setFetchError("Failed to load hosted zone. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchHostedZone();
  }, [zoneId]);

  function handleDeleteClick() {
    setDeleteError("");
    setDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    if (!deleting) {
      setDeleteModalOpen(false);
      setDeleteError("");
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    setDeleteError("");

    try {
      await api.deleteHostedZone(zoneId);

      setDeleteModalOpen(false);
      router.push("/hosted-zones");
    } catch {
      setDeleteError("Failed to delete hosted zone. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <p className="text-ui text-aws-main-text-secondary">Loading...</p>
      </AppLayout>
    );
  }

  if (fetchError || !zone) {
    return (
      <AppLayout>
        <p className="text-ui text-red-400" role="alert">
          {fetchError || "Hosted zone not found."}
        </p>
        <Link
          href="/hosted-zones"
          className="mt-4 inline-block text-ui text-aws-link hover:underline"
        >
          Back to hosted zones
        </Link>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbZone={{ id: zone.id, name: zone.name }}>
      <HostedZoneDetailsContent
        zone={zone}
        successMessage={successMessage}
        onDeleteClick={handleDeleteClick}
      />

      <DeleteHostedZoneModal
        zoneName={zone.name}
        open={deleteModalOpen}
        deleting={deleting}
        error={deleteError}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </AppLayout>
  );
}
