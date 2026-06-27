export default function Pagination() {
  return (
    <section className="mt-auto flex items-center justify-end gap-2 border-t border-gray-200 px-4 py-3 sm:px-6">
      <span className="text-sm text-gray-500">Page 1 of 1</span>
      <div className="flex gap-1">
        <span className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-600">
          Prev
        </span>
        <span className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-600">
          Next
        </span>
      </div>
    </section>
  );
}
