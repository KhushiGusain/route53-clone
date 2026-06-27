import Link from "next/link";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

type AppLayoutProps = {
  children: ReactNode;
  breadcrumbZone?: { id: number; name: string };
  breadcrumbTail?: string;
  showSidebar?: boolean;
};

export default function AppLayout({
  children,
  breadcrumbZone,
  breadcrumbTail,
  showSidebar = true,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-aws-nav">
      <TopNav />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1.5 border-b border-aws-main-border/40 bg-aws-sidebar px-6 py-2 text-ui text-aws-nav-text-muted">
            <span className="cursor-pointer transition-colors hover:text-aws-link hover:underline">
              Route 53
            </span>
            <span>›</span>
            {breadcrumbTail || breadcrumbZone ? (
              <>
                <Link
                  href="/hosted-zones"
                  className="transition-colors hover:text-aws-link hover:underline"
                >
                  Hosted zones
                </Link>
                {breadcrumbZone && (
                  <>
                    <span>›</span>
                    <Link
                      href={`/hosted-zones/${breadcrumbZone.id}`}
                      className="transition-colors hover:text-aws-link hover:underline"
                    >
                      {breadcrumbZone.name}
                    </Link>
                  </>
                )}
                {breadcrumbTail && (
                  <>
                    <span>›</span>
                    <span className="text-aws-nav-text">{breadcrumbTail}</span>
                  </>
                )}
              </>
            ) : (
              <span className="text-aws-nav-text">Hosted zones</span>
            )}
          </div>
          <main className="flex min-h-0 flex-1 flex-col bg-aws-main px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
