"use client";

import Link from "next/link";
import { useState } from "react";
import Pagination from "@/components/hosted-zones/Pagination";
import SearchBar, {
  type HostedZoneFilter,
} from "@/components/hosted-zones/SearchBar";

const secondaryClass =
  "inline-flex h-7 items-center rounded border border-aws-main-border bg-transparent px-3 text-ui font-normal text-aws-main-text transition-colors hover:bg-aws-main-elevated disabled:cursor-not-allowed disabled:text-aws-main-text-muted disabled:opacity-60";

type RecordsToolbarProps = {
  hostedZoneId: number;
  recordCount: number;
  deleteEnabled: boolean;
  deleteDisabledTitle?: string;
  deleting?: boolean;
  onDeleteClick: () => void;
};

export default function RecordsToolbar({
  hostedZoneId,
  recordCount,
  deleteEnabled,
  deleteDisabledTitle,
  deleting = false,
  onDeleteClick,
}: RecordsToolbarProps) {
  const [filter, setFilter] = useState<HostedZoneFilter>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
        <SearchBar zones={[]} filter={filter} onFilterChange={setFilter} />
        <Pagination
          currentPage={currentPage}
          totalPages={1}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setCurrentPage(1);
          }}
        />
      </div>
    </section>
  );
}
