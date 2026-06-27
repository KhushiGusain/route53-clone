const columns = [
  "Hosted zone name",
  "Type",
  "Created by",
  "Record count",
  "Description",
  "Hosted zone ID",
];

export default function HostedZonesTable() {
  return (
    <section className="flex-1 overflow-x-auto px-4 sm:px-6">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="w-10 py-3 pr-4" />
            {columns.map((column) => (
              <th
                key={column}
                className="py-3 pr-4 font-medium text-gray-700"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-4 pr-4" />
            {columns.map((column) => (
              <td key={column} className="py-4 pr-4 text-gray-400">
                —
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
}
