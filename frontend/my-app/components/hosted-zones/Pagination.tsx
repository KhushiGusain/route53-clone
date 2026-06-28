"use client";

import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useState } from "react";
import TablePreferencesModal from "./TablePreferencesModal";

const pageBtn =
  "inline-flex h-7 w-7 items-center justify-center rounded border border-aws-main-border/70 bg-transparent text-aws-main-text-secondary transition-colors hover:bg-aws-main-elevated disabled:cursor-not-allowed disabled:opacity-40";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  function handleConfirmPreferences(nextPageSize: number) {
    onPageSizeChange(nextPageSize);
    setPreferencesOpen(false);
  }

  return (
    <>
      <section className="flex shrink-0 items-center gap-1.5">
        <div className="flex items-center">
          <button
            type="button"
            className={pageBtn}
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="inline-flex h-7 min-w-7 items-center justify-center border-y border-aws-accent bg-aws-accent px-2 text-ui font-medium text-white">
            {currentPage}
          </span>
          <button
            type="button"
            className={pageBtn}
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setPreferencesOpen(true)}
          className="inline-flex h-7 w-7 items-center justify-center rounded border border-aws-main-border/70 bg-transparent text-aws-main-text-secondary transition-colors hover:bg-aws-main-elevated"
          aria-label="Table preferences"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>
      </section>

      <TablePreferencesModal
        open={preferencesOpen}
        pageSize={pageSize}
        onClose={() => setPreferencesOpen(false)}
        onConfirm={handleConfirmPreferences}
      />
    </>
  );
}

export function paginateItems<T>(
  items: T[],
  currentPage: number,
  pageSize: number
) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    totalPages,
    currentPage: safePage,
  };
}
