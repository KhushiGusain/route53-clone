"use client";

import type { HostedZone } from "@/lib/types";

const columns = [
  "Hosted zone name",
  "Type",
  "Created by",
  "Record count",
  "Description",
  "Hosted zone ID",
] as const;

const th =
  "border-b border-aws-main-border/50 bg-aws-main-elevated px-3 py-2 text-left text-ui font-medium text-aws-main-text-secondary";
const td =
  "border-b border-aws-main-border/30 px-3 py-2 text-ui text-aws-main-text";

type HostedZonesTableProps = {
  zones: HostedZone[];
  selectedZoneId: number | null;
  onSelectZone: (zoneId: number) => void;
};

export default function HostedZonesTable({
  zones,
  selectedZoneId,
  onSelectZone,
}: HostedZonesTableProps) {
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
          {zones.map((zone) => (
            <tr
              key={zone.id}
              className={`transition-colors hover:bg-aws-main-elevated/40 ${
                selectedZoneId === zone.id ? "bg-aws-main-elevated/50" : ""
              }`}
            >
              <td className={`${td} align-middle`}>
                <input
                  type="radio"
                  name="hosted-zone"
                  checked={selectedZoneId === zone.id}
                  onChange={() => onSelectZone(zone.id)}
                  className="h-3.5 w-3.5 cursor-pointer accent-aws-accent"
                  aria-label={`Select ${zone.name}`}
                />
              </td>
              <td className={td}>
                <button
                  type="button"
                  className="text-ui text-aws-link transition-colors hover:underline"
                >
                  {zone.name}
                </button>
              </td>
              <td className={td}>{zone.type}</td>
              <td className={td}>{zone.created_by}</td>
              <td className={td}>-</td>
              <td className={td}>{zone.description ?? "-"}</td>
              <td className={`${td} font-mono text-aws-main-text-muted`}>
                {zone.hosted_zone_id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
