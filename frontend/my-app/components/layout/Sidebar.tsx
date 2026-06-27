const navItems = [
  "Dashboard",
  "Hosted zones",
  "Health checks",
  "Profiles",
];

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-gray-50 md:block">
      <nav className="p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Route 53
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item}>
              <span
                className={`block rounded px-3 py-2 text-sm ${
                  item === "Hosted zones"
                    ? "bg-blue-100 font-medium text-blue-800"
                    : "text-gray-700"
                }`}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
