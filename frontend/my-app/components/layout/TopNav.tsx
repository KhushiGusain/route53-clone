import type { ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  Grid3x3,
  Hexagon,
  Search,
  Settings,
  Terminal,
} from "lucide-react";

function NavDivider() {
  return (
    <span
      className="mx-1.5 h-6 w-px shrink-0 bg-aws-nav-border/80"
      aria-hidden="true"
    />
  );
}

function AwsLogo() {
  return (
    <div className="flex shrink-0 flex-col items-start px-3 py-1.5">
      <span className="text-[1.125rem] font-bold lowercase leading-tight text-white">
        aws
      </span>
      <svg
        className="mt-0.5 h-[6px] w-[2.25rem]"
        viewBox="0 0 34 6"
        fill="none"
        aria-hidden="true"
      >
        <path
          fill="#FF9900"
          d="M1.2 5c7.2-3.2 15.6-3.2 22.8 0 2.4-1 4.8-1.6 7.2-2.2-4.2-2.2-9.6-3.4-15.6-3.4S5.4 0 1.2 2.2c2.4.6 4.8 1.2 7.2 2.2z"
        />
      </svg>
    </div>
  );
}

function IconButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="rounded p-1.5 text-aws-nav-text-body transition-colors hover:bg-aws-sidebar-hover"
      aria-label={label}
    >
      {children}
    </button>
  );
}

export default function TopNav() {
  return (
    <header className="flex h-12 shrink-0 items-center border-b border-aws-nav-border/60 bg-aws-nav">
      <div className="flex shrink-0 items-center">
        <AwsLogo />
        <NavDivider />
        <IconButton label="All services">
          <Grid3x3 className="h-4 w-4" strokeWidth={1.75} />
        </IconButton>
      </div>

      <div className="flex min-w-0 flex-1 justify-center px-3 lg:px-6">
        <div className="flex w-full max-w-[44rem] items-center rounded border border-aws-nav-border-strong/70 bg-[#0f1419] shadow-inner">
          <Search
            className="ml-2.5 h-3.5 w-3.5 shrink-0 text-aws-nav-text-muted"
            strokeWidth={2}
          />
          <input
            type="text"
            readOnly
            placeholder="Search"
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-ui italic text-aws-nav-text placeholder:italic placeholder:text-aws-nav-text-muted focus:outline-none"
          />
          <span className="hidden shrink-0 pr-2 text-[0.6875rem] text-aws-nav-text-muted sm:inline">
            [Alt+S]
          </span>
          <button
            type="button"
            className="mr-1.5 rounded p-1 text-aws-nav-text-muted transition-colors hover:bg-aws-sidebar-hover hover:text-aws-nav-text-body"
            aria-label="Search with Q"
          >
            <Hexagon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="flex shrink-0 items-center pr-2">
        <IconButton label="CloudShell">
          <Terminal className="h-4 w-4" strokeWidth={1.75} />
        </IconButton>
        <NavDivider />
        <IconButton label="Notifications">
          <Bell className="h-4 w-4" strokeWidth={1.75} />
        </IconButton>
        <NavDivider />
        <IconButton label="Help">
          <CircleHelp className="h-4 w-4" strokeWidth={1.75} />
        </IconButton>
        <NavDivider />
        <IconButton label="Settings">
          <Settings className="h-4 w-4" strokeWidth={1.75} />
        </IconButton>
        <NavDivider />
        <button
          type="button"
          className="flex items-center gap-1 rounded px-2 py-1.5 text-ui text-aws-nav-text-body transition-colors hover:bg-aws-sidebar-hover"
        >
          <span className="hidden max-w-24 truncate lg:inline">Global</span>
          <ChevronDown className="h-3.5 w-3.5 text-aws-nav-text-muted" />
        </button>
        <NavDivider />
        <button
          type="button"
          className="flex max-w-[11rem] items-center gap-1 rounded px-2 py-1.5 text-ui text-aws-nav-text-body transition-colors hover:bg-aws-sidebar-hover"
        >
          <span className="truncate">
            <span className="hidden xl:inline">User </span>
            <span className="hidden text-aws-nav-text-muted lg:inline">
              (123456789012)
            </span>
            <span className="lg:hidden">User</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-aws-nav-text-muted" />
        </button>
      </div>
    </header>
  );
}
