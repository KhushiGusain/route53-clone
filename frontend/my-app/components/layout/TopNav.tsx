export default function TopNav() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-gray-900 px-4 text-white">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold">Route53 Clone</span>
        <div className="hidden rounded border border-gray-600 px-3 py-1 text-sm text-gray-300 sm:block">
          Search
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-300">
        <span className="hidden sm:inline">Global</span>
        <span>User</span>
      </div>
    </header>
  );
}
