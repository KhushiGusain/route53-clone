import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-aws-nav">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1.5 border-b border-aws-main-border/40 bg-aws-sidebar px-6 py-2 text-ui text-aws-nav-text-muted">
            <span className="cursor-pointer transition-colors hover:text-aws-link hover:underline">
              Route 53
            </span>
            <span>›</span>
            <span className="text-aws-nav-text">Hosted zones</span>
          </div>
          <main className="flex min-h-0 flex-1 flex-col bg-aws-main px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
