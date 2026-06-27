export default function Toolbar() {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-wrap gap-2">
        <span className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600">
          View details
        </span>
        <span className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600">
          Edit
        </span>
        <span className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600">
          Delete
        </span>
      </div>
      <span className="text-sm text-gray-500">Toolbar</span>
    </section>
  );
}
