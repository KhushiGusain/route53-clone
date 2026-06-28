"use client";

import Link from "next/link";
import Pagination from "@/components/hosted-zones/Pagination";
import SearchBar, {
  type HostedZoneFilter,
} from "@/components/hosted-zones/SearchBar";
import type { DNSRecord } from "@/lib/types";

const secondaryClass =
  "inline-flex h-7 items-center rounded-full cursor-pointer border border-aws-accent bg-transparent px-3 text-ui font-normal text-aws-link transition-colors hover:bg-aws-accent/10 disabled:cursor-not-allowed disabled:border-aws-main-border disabled:text-aws-main-text-muted disabled:opacity-60";

type RecordsToolbarProps = {
  hostedZoneId: number;
  records: DNSRecord[];
  recordCount: number;
  filter: HostedZoneFilter;
  onFilterChange: (filter: HostedZoneFilter) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  deleteEnabled: boolean;
  deleteDisabledTitle?: string;
  deleting?: boolean;
  onDeleteClick: () => void;
};

export default function RecordsToolbar({
  hostedZoneId,
  records,
  recordCount,
  filter,
  onFilterChange,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  deleteEnabled,
  deleteDisabledTitle,
  deleting = false,
  onDeleteClick,
}: RecordsToolbarProps) {
  const deleteDisabled = !deleteEnabled || deleting;

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-body font-bold text-aws-main-text">
            Records ({recordCount}){" "}
            <span className="font-normal text-aws-link">Info</span>
          </h2>
          <p className="mt-1.5 text-ui leading-snug text-aws-main-text-secondary">
            Automatic mode is the current search behavior optimized for best filter
            results.
          </p>
        </div>

        <div
          className="flex shrink-0 flex-nowrap items-center gap-1.5"
          role="toolbar"
          aria-label="Records actions"
        >
          <button
            type="button"
            className={secondaryClass}
            disabled={deleteDisabled}
            title={deleteDisabled ? deleteDisabledTitle : undefined}
            onClick={onDeleteClick}
          >
            Delete record
          </button>
          <button type="button" className={secondaryClass}>
            Import zone file
          </button>
          <Link
            href={`/hosted-zones/${hostedZoneId}/records/create`}
            className="ml-1 inline-flex h-7 shrink-0 items-center rounded bg-aws-orange px-3 text-ui font-semibold text-aws-nav transition-opacity hover:opacity-90"
          >
            Create record
          </Link>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <SearchBar
          records={records}
          filter={filter}
          onFilterChange={onFilterChange}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </section>
  );
}
