export default function PageHeader() {
  return (
    <section className="border-b border-gray-200 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Hosted zones</h1>
        <div className="flex flex-wrap gap-2">
          <span className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600">
            Actions
          </span>
          <span className="rounded bg-orange-500 px-3 py-1.5 text-sm text-white">
            Create hosted zone
          </span>
        </div>
      </div>
    </section>
  );
}
