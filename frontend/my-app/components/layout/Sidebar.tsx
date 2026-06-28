"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Hosted zones", href: "/hosted-zones" },
  { label: "Health checks", href: "/health-checks" },
  { label: "Profiles", href: "/profiles" },
] as const;

function NavLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative block py-1.5 pl-4 pr-3 text-ui leading-5 transition-colors ${
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
    <aside className="hidden w-64 shrink-0 flex-col bg-aws-sidebar md:flex">
      <div className="px-5 pb-1 pt-4">
        <h2 className="text-ui font-bold tracking-tight text-aws-nav-text">
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
                active={
                  item.href === "/hosted-zones"
                    ? pathname.startsWith("/hosted-zones")
                    : pathname === item.href
                }
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
