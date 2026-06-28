import Link from "next/link";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

const contentPaddingX = "px-8";

type AppLayoutProps = {
  children: ReactNode;
  pageBreadcrumb?: string;
  breadcrumbZone?: { id: number; name: string };
  breadcrumbTail?: string;
  showSidebar?: boolean;
};

export default function AppLayout({
  children,
  pageBreadcrumb = "Hosted zones",
  breadcrumbZone,
  breadcrumbTail,
  showSidebar = true,
}: AppLayoutProps) {
  const isHostedZoneSection =
    pageBreadcrumb === "Hosted zones" && (breadcrumbZone !== undefined || breadcrumbTail !== undefined);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-aws-nav">
      <TopNav />
      <div className="flex min-h-0 flex-1">
        {showSidebar && <Sidebar />}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-aws-main">
            <nav
              aria-label="Breadcrumb"
              className={`flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 ${contentPaddingX} pb-2 pt-4 text-table leading-4 text-aws-main-text-muted`}
            >
              <span className="cursor-pointer transition-colors hover:text-aws-link hover:underline">
                Route 53
              </span>
              <span className="select-none" aria-hidden="true">
                ›
              </span>
              {isHostedZoneSection ? (
                <>
                  <Link
                    href="/hosted-zones"
                    className="transition-colors hover:text-aws-link hover:underline"
                  >
                    Hosted zones
                  </Link>
                  {breadcrumbZone && (
                    <>
                      <span className="select-none" aria-hidden="true">
                        ›
                      </span>
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
                      <span className="select-none" aria-hidden="true">
                        ›
                      </span>
                      <span className="text-aws-main-text-secondary">
                        {breadcrumbTail}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="text-aws-main-text-secondary">{pageBreadcrumb}</span>
              )}
            </nav>
            <div className={`flex flex-1 flex-col pb-6 pt-1 ${contentPaddingX}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
