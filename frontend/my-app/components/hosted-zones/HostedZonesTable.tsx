const columns = [
  "Hosted zone name",
  "Type",
  "Created by",
  "Record count",
  "Description",
  "Hosted zone ID",
] as const;

const staticRow = {
  name: "example.com",
  type: "Public",
  createdBy: "Route 53",
  recordCount: "2",
  description: "-",
  hostedZoneId: "Z1234567890ABC",
};

const th =
  "border-b border-aws-main-border/50 bg-aws-main-elevated px-3 py-2 text-left text-ui font-medium text-aws-main-text-secondary";
const td =
  "border-b border-aws-main-border/30 px-3 py-2 text-ui text-aws-main-text";

export default function HostedZonesTable() {
  return (
    <section className="flex-1 overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr>
            <th className={`${th} w-10`} scope="col" />
            {columns.map((col) => (
              <th key={col} className={th} scope="col">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="transition-colors hover:bg-aws-main-elevated/40">
            <td className={`${td} align-middle`}>
              <input
                type="radio"
                name="hosted-zone"
                className="h-3.5 w-3.5 accent-aws-accent"
                readOnly
              />
            </td>
            <td className={td}>
              <button
                type="button"
                className="text-ui text-aws-link transition-colors hover:underline"
              >
                {staticRow.name}
              </button>
            </td>
            <td className={td}>{staticRow.type}</td>
            <td className={td}>{staticRow.createdBy}</td>
            <td className={td}>{staticRow.recordCount}</td>
            <td className={td}>{staticRow.description}</td>
            <td className={`${td} font-mono text-aws-main-text-muted`}>
              {staticRow.hostedZoneId}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
