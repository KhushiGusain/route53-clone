"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { HostedZone } from "@/lib/types";

const actionBtnClass =
  "inline-flex h-7 shrink-0 items-center rounded-full cursor-pointer border border-aws-accent bg-transparent px-3 text-ui font-normal text-aws-link transition-colors hover:bg-aws-accent/10";

const labelClass = "text-ui font-bold text-aws-main-text-secondary";
const valueClass = "mt-1 text-body text-aws-main-text";

function typeLabel(type: HostedZone["type"]) {
  return type === "Public" ? "Public hosted zone" : "Private hosted zone";
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <p className={valueClass}>{value}</p>
    </div>
  );
}

type HostedZoneDetailsPanelProps = {
  zone: HostedZone;
  recordCount: number;
};

export default function HostedZoneDetailsPanel({
  zone,
  recordCount,
}: HostedZoneDetailsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="rounded border border-aws-main-border/70 bg-aws-main-elevated/30">
      <div className="flex flex-col gap-3 border-b border-aws-main-border/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="flex min-w-0 items-center gap-2 text-left"
          aria-expanded={expanded}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-aws-main-text" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-aws-main-text" />
          )}
          <span className="text-body font-bold text-aws-main-text">
            Hosted zone details
          </span>
        </button>

        <Link href={`/hosted-zones/${zone.id}/edit`} className={actionBtnClass}>
          Edit hosted zone
        </Link>
      </div>

      {expanded && (
        <div className="grid gap-6 px-4 py-5 md:grid-cols-3">
          <div className="space-y-5">
            <DetailField label="Hosted zone name" value={zone.name} />
            <DetailField label="Hosted zone ID" value={zone.hosted_zone_id} />
            <DetailField label="Description" value={zone.description ?? "-"} />
          </div>

          <div className="space-y-5 md:border-l md:border-aws-main-border/50 md:pl-6">
            <DetailField label="Query log" value="-" />
            <DetailField label="Type" value={typeLabel(zone.type)} />
            <DetailField label="Record count" value={String(recordCount)} />
          </div>

          <div className="space-y-5 md:border-l md:border-aws-main-border/50 md:pl-6">
            <DetailField label="Name servers" value="-" />
          </div>
        </div>
      )}
    </section>
  );
}
