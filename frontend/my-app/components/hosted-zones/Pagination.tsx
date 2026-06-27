import { ChevronLeft, ChevronRight, Settings2 } from "lucide-react";

const pageBtn =
  "inline-flex h-7 w-7 items-center justify-center rounded border border-aws-main-border/70 bg-transparent text-aws-main-text-secondary transition-colors hover:bg-aws-main-elevated disabled:cursor-not-allowed disabled:opacity-40";

export default function Pagination() {
  return (
    <section className="flex shrink-0 items-center gap-1.5">
      <div className="flex items-center">
        <button type="button" className={pageBtn} disabled aria-label="Previous page">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="inline-flex h-7 min-w-7 items-center justify-center border-y border-aws-accent bg-aws-accent px-2 text-ui font-medium text-white">
          1
        </span>
        <button type="button" className={pageBtn} disabled aria-label="Next page">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        type="button"
        className="inline-flex h-7 w-7 items-center justify-center rounded border border-aws-main-border/70 bg-transparent text-aws-main-text-secondary transition-colors hover:bg-aws-main-elevated"
        aria-label="Table preferences"
      >
        <Settings2 className="h-3.5 w-3.5" />
      </button>
    </section>
  );
}
