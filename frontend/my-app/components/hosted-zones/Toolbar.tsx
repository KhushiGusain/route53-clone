"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

const secondaryClass =
  "inline-flex h-7 items-center rounded border border-aws-main-border bg-transparent px-3 text-ui font-normal text-aws-main-text transition-colors hover:bg-aws-main-elevated disabled:cursor-not-allowed disabled:text-aws-main-text-muted disabled:opacity-60";

type ToolbarProps = {
  selectedZoneId: number | null;
  refreshing: boolean;
  onRefresh: () => void;
  onDeleteClick: () => void;
};

export default function Toolbar({
  selectedZoneId,
  refreshing,
  onRefresh,
  onDeleteClick,
}: ToolbarProps) {
  const router = useRouter();
  const disabled = selectedZoneId === null;

  return (
    <div
      className="mt-0.5 flex flex-wrap items-center gap-1.5"
      role="toolbar"
      aria-label="Hosted zones actions"
    >
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-aws-main-border bg-transparent text-aws-link transition-colors hover:bg-aws-main-elevated disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Refresh"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
      </button>

      <button
        type="button"
        className={secondaryClass}
        disabled={disabled}
        onClick={() => router.push(`/hosted-zones/${selectedZoneId}`)}
      >
        View details
      </button>

      <button
        type="button"
        className={secondaryClass}
        disabled={disabled}
        onClick={() => router.push(`/hosted-zones/${selectedZoneId}/edit`)}
      >
        Edit
      </button>

      <button
        type="button"
        className={secondaryClass}
        disabled={disabled}
        onClick={onDeleteClick}
      >
        Delete
      </button>

      <Link
        href="/hosted-zones/create"
        className="ml-1 inline-flex h-7 shrink-0 items-center rounded bg-aws-orange px-3 text-ui font-semibold text-aws-nav transition-opacity hover:opacity-90"
      >
        Create hosted zone
      </Link>
    </div>
  );
}
