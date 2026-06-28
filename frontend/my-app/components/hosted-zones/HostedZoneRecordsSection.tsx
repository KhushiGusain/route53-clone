"use client";

import { useEffect, useState } from "react";
import DnsRecordsTable from "./DnsRecordsTable";
import { paginateItems } from "./Pagination";
import RecordsToolbar from "./RecordsToolbar";
import {
  filterDnsRecords,
  type HostedZoneFilter,
} from "@/components/hosted-zones/SearchBar";
import type { DNSRecord } from "@/lib/types";

const dummyTabs = [
  { id: "accelerated-recovery", label: "Accelerated recovery" },
  { id: "dnssec-signing", label: "DNSSEC signing" },
  { id: "hosted-zone-tags", label: "Hosted zone tags (0)" },
] as const;

type TabId = "records" | (typeof dummyTabs)[number]["id"];

type HostedZoneRecordsSectionProps = {
  hostedZoneId: number;
  records: DNSRecord[];
  loading: boolean;
  error: string;
  selectedRecordIds: number[];
  onToggleRecord: (recordId: number) => void;
  deleteEnabled: boolean;
  deleteDisabledTitle?: string;
  deletingRecord?: boolean;
  onDeleteRecordClick: () => void;
};

export default function HostedZoneRecordsSection({
  hostedZoneId,
  records,
  loading,
  error,
  selectedRecordIds,
  onToggleRecord,
  deleteEnabled,
  deleteDisabledTitle,
  deletingRecord = false,
  onDeleteRecordClick,
}: HostedZoneRecordsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("records");
  const [filter, setFilter] = useState<HostedZoneFilter>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredRecords = filterDnsRecords(records, filter);
  const { items: paginatedRecords, totalPages, currentPage: safePage } =
    paginateItems(filteredRecords, currentPage, pageSize);

  function handleFilterChange(nextFilter: HostedZoneFilter) {
    setFilter(nextFilter);
    setCurrentPage(1);
  }

  function handlePageSizeChange(nextPageSize: number) {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  }

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

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
              records={records}
              recordCount={records.length}
              filter={filter}
              onFilterChange={handleFilterChange}
              currentPage={safePage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              deleteEnabled={deleteEnabled}
              deleteDisabledTitle={deleteDisabledTitle}
              deleting={deletingRecord}
              onDeleteClick={onDeleteRecordClick}
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

            {!error && !loading && records.length > 0 && filteredRecords.length === 0 && (
              <p className="text-ui text-aws-main-text-secondary">
                No DNS records found.
              </p>
            )}

            {!error && (loading || filteredRecords.length > 0) && (
              <div className="overflow-hidden rounded border border-aws-main-border/50">
                <DnsRecordsTable
                  records={paginatedRecords}
                  loading={loading}
                  selectedRecordIds={selectedRecordIds}
                  onToggleRecord={onToggleRecord}
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-ui text-aws-main-text-secondary">Coming soon</p>
        )}
      </div>
    </section>
  );
}
