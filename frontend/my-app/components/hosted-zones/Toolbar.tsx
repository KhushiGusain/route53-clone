import Link from "next/link";
import { RefreshCw } from "lucide-react";

const secondaryClass =
  "inline-flex h-7 items-center rounded border border-aws-main-border bg-transparent px-3 text-ui font-normal text-aws-main-text transition-colors hover:bg-aws-main-elevated disabled:cursor-not-allowed disabled:text-aws-main-text-muted disabled:opacity-60";

export default function Toolbar() {
  return (
    <div
      className="mt-0.5 flex shrink-0 flex-nowrap items-center gap-1.5"
      role="toolbar"
      aria-label="Hosted zones actions"
    >
      <button
        type="button"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-aws-main-border bg-transparent text-aws-link transition-colors hover:bg-aws-main-elevated"
        aria-label="Refresh"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>

      <button type="button" className={secondaryClass} disabled>
        View details
      </button>
      <button type="button" className={secondaryClass} disabled>
        Edit
      </button>
      <button type="button" className={secondaryClass} disabled>
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
