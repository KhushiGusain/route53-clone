"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import RecordForm, {
  createEmptyRecord,
  type RecordFormData,
} from "@/components/hosted-zones/RecordForm";
import type { HostedZone } from "@/lib/types";

export default function CreateRecordPage() {
  const params = useParams();
  const zoneId = Number(params.id);

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [records, setRecords] = useState<RecordFormData[]>(() => [
    createEmptyRecord(1),
  ]);
  const [nextRecordId, setNextRecordId] = useState(2);

  useEffect(() => {
    async function fetchHostedZone() {
      setLoading(true);
      setFetchError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hosted-zones/${zoneId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load hosted zone.");
        }

        const data = (await response.json()) as HostedZone;
        setZone(data);
      } catch {
        setFetchError("Failed to load hosted zone. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchHostedZone();
  }, [zoneId]);

  function addRecord() {
    setRecords((prev) => [...prev, createEmptyRecord(nextRecordId)]);
    setNextRecordId((prev) => prev + 1);
  }

  function removeRecord(id: number) {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  }

  function updateRecord(
    id: number,
    updates: Partial<Omit<RecordFormData, "id">>
  ) {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, ...updates } : record
      )
    );
  }

  if (loading) {
    return (
      <AppLayout breadcrumbTail="Create record" showSidebar={true}>
        <p className="text-ui text-aws-main-text-secondary">Loading...</p>
      </AppLayout>
    );
  }

  if (fetchError || !zone) {
    return (
      <AppLayout breadcrumbTail="Create record" showSidebar={true}>
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
    <AppLayout
      breadcrumbZone={{ id: zone.id, name: zone.name }}
      breadcrumbTail="Create record"
      showSidebar={true}
    >
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="text-2xl font-normal text-aws-main-text">
          Create record{" "}
          <span className="text-base font-normal text-aws-link">Info</span>
        </h1>

        <div className="w-full space-y-6">
          <section className="rounded border border-aws-main-border/70 bg-aws-main-elevated/30 p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-body font-bold text-aws-main-text">
                Quick create record
              </h2>
              <button
                type="button"
                className="shrink-0 text-ui text-aws-link hover:underline"
              >
                Switch to wizard
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {records.map((record, index) => (
                <RecordForm
                  key={record.id}
                  index={index}
                  record={record}
                  zoneName={zone.name}
                  showDelete={records.length > 1}
                  onChange={(updates) => updateRecord(record.id, updates)}
                  onDelete={() => removeRecord(record.id)}
                />
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={addRecord}
                className="inline-flex h-7 items-center rounded border border-aws-accent bg-transparent px-3 text-ui font-normal text-aws-link transition-colors hover:bg-aws-main-elevated"
              >
                Add another record
              </button>
            </div>
          </section>

          <div className="flex items-center justify-end gap-4">
            <Link
              href={`/hosted-zones/${zone.id}`}
              className="text-ui text-aws-link hover:underline"
            >
              Cancel
            </Link>
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-full bg-aws-orange px-5 text-ui font-semibold text-aws-nav transition-opacity hover:opacity-90"
            >
              Create records
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
