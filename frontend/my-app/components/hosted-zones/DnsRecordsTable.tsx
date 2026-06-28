"use client";

import { Loader2 } from "lucide-react";
import type { DNSRecord } from "@/lib/types";

const columns = ["Record name", "Type", "Value", "TTL (seconds)"] as const;

const th =
  "border-b border-aws-main-border/50 bg-aws-main-elevated px-3 py-2 text-left text-ui font-medium text-aws-main-text-secondary";
const td =
  "border-b border-aws-main-border/30 px-3 py-2 text-ui text-aws-main-text";

type DnsRecordsTableProps = {
  records: DNSRecord[];
  loading?: boolean;
  selectedRecordIds: number[];
  onToggleRecord: (recordId: number) => void;
};

export default function DnsRecordsTable({
  records,
  loading = false,
  selectedRecordIds,
  onToggleRecord,
}: DnsRecordsTableProps) {
  return (
    <section className="relative overflow-x-auto">
      {loading && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-aws-main/70"
          aria-live="polite"
          aria-busy="true"
        >
          <Loader2 className="h-6 w-6 animate-spin text-aws-link" />
        </div>
      )}

      <table className="w-full min-w-[720px] border-collapse text-left">
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
          {records.map((record) => {
            const isSelected = selectedRecordIds.includes(record.id);

            return (
              <tr
                key={record.id}
                className={`transition-colors hover:bg-aws-main-elevated/40 ${
                  isSelected
                    ? "bg-aws-accent/10 ring-2 ring-inset ring-aws-accent"
                    : ""
                }`}
              >
                <td className={`${td} align-middle`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleRecord(record.id)}
                    className="h-3.5 w-3.5 accent-aws-accent"
                    aria-label={`Select ${record.name}`}
                  />
                </td>
                <td className={td}>
                  <span className="text-ui text-aws-link">{record.name}</span>
                </td>
                <td className={td}>{record.type}</td>
                <td className={`${td} max-w-md truncate`} title={record.value}>
                  {record.value}
                </td>
                <td className={td}>{record.ttl}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
