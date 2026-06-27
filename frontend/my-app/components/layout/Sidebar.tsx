function NavLink({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`relative block py-1.5 pl-4 pr-3 text-ui leading-5 transition-colors ${
        active
          ? "font-semibold text-aws-link before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-aws-link"
          : "text-aws-nav-text-body hover:bg-aws-sidebar-hover hover:text-aws-nav-text"
      }`}
    >
      {label}
    </span>
  );
}

const navItems = [
  { label: "Dashboard" },
  { label: "Hosted zones", active: true },
  { label: "Health checks" },
  { label: "Profiles" },
];

export default function Sidebar() {
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
              <NavLink {...item} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
