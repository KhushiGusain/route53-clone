"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Hosted zones", href: "/hosted-zones" },
  { label: "Health checks", href: "/health-checks" },
  { label: "Profiles", href: "/profiles" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/hosted-zones") {
    return pathname.startsWith("/hosted-zones");
  }
  return pathname === href;
}

function NavLink({
  label,
  href,
  active,
  mobile = false,
}: {
  label: string;
  href: string;
  active: boolean;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <Link
        href={href}
        className={`shrink-0 rounded-full px-3 py-1.5 text-ui transition-colors ${
          active
            ? "bg-aws-accent/20 font-semibold text-aws-link"
            : "text-aws-nav-text-body hover:bg-aws-sidebar-hover hover:text-aws-nav-text"
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`relative block py-1.5 pl-3 pr-2 text-ui leading-5 transition-colors ${
        active
          ? "font-semibold text-aws-link before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-aws-link"
          : "text-aws-nav-text-body hover:bg-aws-sidebar-hover hover:text-aws-nav-text"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-aws-main-border/40 bg-aws-sidebar px-4 py-2 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            label={item.label}
            href={item.href}
            active={isActive(pathname, item.href)}
            mobile
          />
        ))}
      </nav>

      <aside className="hidden w-52 shrink-0 flex-col bg-aws-sidebar md:flex">
        <div className="px-4 pb-1 pt-4">
          <h2 className="text-lg font-bold tracking-tight text-aws-nav-text">
            Route 53
          </h2>
        </div>
        <nav className="flex-1 px-2 pb-6 pt-1">
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  label={item.label}
                  href={item.href}
                  active={isActive(pathname, item.href)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
