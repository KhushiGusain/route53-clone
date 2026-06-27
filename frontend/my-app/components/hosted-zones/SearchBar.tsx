import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <section className="min-w-0 flex-1">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-aws-main-text-muted" />
        <input
          type="text"
          placeholder="Filter records by property or value"
          className="w-full rounded border border-aws-main-border/70 bg-aws-main-elevated py-1.5 pl-9 pr-4 text-ui text-aws-main-text placeholder:text-aws-main-text-muted focus:border-aws-accent focus:outline-none focus:ring-1 focus:ring-aws-accent/30"
          readOnly
        />
      </div>
    </section>
  );
}
