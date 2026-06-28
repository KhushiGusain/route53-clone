"use client";

import { useEffect, useState } from "react";
import DnsRecordsTable from "./DnsRecordsTable";
import RecordsToolbar from "./RecordsToolbar";
import type { DNSRecord } from "@/lib/types";

const dummyTabs = [
  { id: "accelerated-recovery", label: "Accelerated recovery" },
  { id: "dnssec-signing", label: "DNSSEC signing" },
  { id: "hosted-zone-tags", label: "Hosted zone tags (0)" },
] as const;

type TabId = "records" | (typeof dummyTabs)[number]["id"];

type HostedZoneRecordsSectionProps = {
  hostedZoneId: number;
};

export default function HostedZoneRecordsSection({
  hostedZoneId,
}: HostedZoneRecordsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("records");
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecords() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hosted-zones/${hostedZoneId}/records`
        );

        if (!response.ok) {
          throw new Error("Failed to load DNS records.");
        }

        const data = (await response.json()) as DNSRecord[];
        setRecords(data);
      } catch {
        setError("Failed to load DNS records. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, [hostedZoneId]);

  const tabs = [
    { id: "records" as const, label: `Records (${records.length})` },
    ...dummyTabs,
  ];

  return (
    <section className="rounded border border-aws-main-border/70 bg-aws-main-elevated/20">
      <div className="flex flex-wrap border-b border-aws-main-border/50">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-r border-aws-main-border/50 px-4 py-2.5 text-ui transition-colors last:border-r-0 ${
                isActive
                  ? "-mb-px border-b-2 border-b-aws-accent font-bold text-aws-main-text"
                  : "text-aws-main-text-secondary hover:bg-aws-main-elevated/40 hover:text-aws-main-text"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-4">
        {activeTab === "records" ? (
          <div className="space-y-4">
            <RecordsToolbar
              hostedZoneId={hostedZoneId}
              recordCount={records.length}
              selectedRecordId={null}
            />

            {error && (
              <p className="text-ui text-red-400" role="alert">
                {error}
              </p>
            )}

            {!error && !loading && records.length === 0 && (
              <p className="text-ui text-aws-main-text-secondary">
                No DNS records found.
              </p>
            )}

            {!error && (loading || records.length > 0) && (
              <DnsRecordsTable records={records} loading={loading} />
            )}
          </div>
        ) : (
          <p className="text-ui text-aws-main-text-secondary">Coming soon</p>
        )}
      </div>
    </section>
  );
}
