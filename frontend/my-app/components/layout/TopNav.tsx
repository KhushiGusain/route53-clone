import { Bell, ChevronDown, Search } from "lucide-react";

export default function TopNav() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-aws-nav-border/50 bg-aws-nav px-5">
      <div className="shrink-0">
        <span className="text-ui font-bold tracking-wider text-aws-nav-text">
          AWS
        </span>
      </div>

      <div className="flex min-w-0 flex-1 justify-center px-4">
        <div className="flex w-full max-w-xl items-center gap-2 rounded border border-aws-nav-border-strong/60 bg-aws-nav-panel px-3 py-1.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-aws-nav-text-muted" />
          <span className="truncate text-ui text-aws-nav-text-muted">Search</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="rounded p-1.5 text-aws-nav-text-body transition-colors hover:bg-aws-sidebar-hover"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded px-2 py-1 text-ui text-aws-nav-text-body transition-colors hover:bg-aws-sidebar-hover"
        >
          <span className="hidden max-w-28 truncate sm:inline">User</span>
          <ChevronDown className="h-3.5 w-3.5 text-aws-nav-text-muted" />
        </button>
      </div>
    </header>
  );
}
