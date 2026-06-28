"use client";

import { useState } from "react";
import type { RecordType } from "@/lib/types";

export type RecordFormData = {
  id: number;
  recordName: string;
  alias: boolean;
  recordType: RecordType;
  value: string;
  ttl: string;
};

export type RecordFormErrors = {
  recordType?: string;
  value?: string;
  ttl?: string;
};

const recordTypes: RecordType[] = ["A", "CNAME", "MX", "TXT"];

const inputClass =
  "w-full rounded border border-aws-main-border/70 bg-aws-main px-3 py-2 text-body text-aws-main-text placeholder:text-aws-main-text-muted focus:border-aws-accent focus:outline-none focus:ring-1 focus:ring-aws-accent/30";

type RecordFormProps = {
  index: number;
  record: RecordFormData;
  zoneName: string;
  showDelete: boolean;
  errors?: RecordFormErrors;
  onChange: (updates: Partial<Omit<RecordFormData, "id">>) => void;
  onDelete: () => void;
};

function InfoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-ui font-bold text-aws-main-text">
      {children}{" "}
      <span className="font-normal text-aws-link">Info</span>
    </span>
  );
}

export function createEmptyRecord(id: number): RecordFormData {
  return {
    id,
    recordName: "",
    alias: false,
    recordType: "A",
    value: "",
    ttl: "300",
  };
}

export default function RecordForm({
  index,
  record,
  zoneName,
  showDelete,
  errors = {},
  onChange,
  onDelete,
}: RecordFormProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded border border-aws-main-border/70 bg-aws-main">
      <div className="flex items-center justify-between border-b border-aws-main-border/50 px-4 py-2.5">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-2 text-ui font-bold text-aws-main-text"
          aria-expanded={expanded}
        >
          <span
            className={`inline-block text-aws-main-text-secondary transition-transform ${
              expanded ? "rotate-0" : "-rotate-90"
            }`}
          >
            ▼
          </span>
          Record {index + 1}
        </button>
        {showDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-7 items-center rounded border border-aws-main-border bg-transparent px-3 text-ui font-normal text-aws-main-text transition-colors hover:bg-aws-main-elevated"
          >
            Delete
          </button>
        )}
      </div>

      {expanded && (
        <div className="space-y-6 p-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label htmlFor={`record-name-${record.id}`} className="block">
                  <InfoLabel>Record name</InfoLabel>
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    id={`record-name-${record.id}`}
                    type="text"
                    value={record.recordName}
                    onChange={(e) => onChange({ recordName: e.target.value })}
                    placeholder="subdomain"
                    className={`${inputClass} flex-1`}
                  />
                  <span className="shrink-0 text-body text-aws-main-text">
                    {zoneName}
                  </span>
                </div>
                <p className="mt-1 text-ui text-aws-main-text-secondary">
                  Keep blank to create a record for the root domain.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={record.alias}
                  aria-label="Alias"
                  onClick={() => onChange({ alias: !record.alias })}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                    record.alias ? "bg-aws-accent" : "bg-aws-main-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      record.alias ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
                <span className="text-ui text-aws-main-text">Alias</span>
              </div>
            </div>

            <div>
              <label htmlFor={`record-type-${record.id}`} className="block">
                <InfoLabel>Record type</InfoLabel>
              </label>
              <select
                id={`record-type-${record.id}`}
                value={record.recordType}
                onChange={(e) =>
                  onChange({ recordType: e.target.value as RecordType })
                }
                className={`${inputClass} mt-2`}
                aria-invalid={Boolean(errors.recordType)}
              >
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.recordType && (
                <p className="mt-1 text-ui text-red-400" role="alert">
                  {errors.recordType}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor={`record-value-${record.id}`} className="block">
              <InfoLabel>Value</InfoLabel>
            </label>
            <textarea
              id={`record-value-${record.id}`}
              value={record.value}
              onChange={(e) => onChange({ value: e.target.value })}
              rows={4}
              placeholder="Enter record value"
              className={`${inputClass} mt-2`}
              aria-invalid={Boolean(errors.value)}
            />
            {errors.value ? (
              <p className="mt-1 text-ui text-red-400" role="alert">
                {errors.value}
              </p>
            ) : (
              <p className="mt-1 text-ui text-aws-main-text-secondary">
                Enter multiple values on separate lines.
              </p>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label htmlFor={`record-ttl-${record.id}`} className="block">
                <InfoLabel>TTL (seconds)</InfoLabel>
              </label>
              <input
                id={`record-ttl-${record.id}`}
                type="number"
                min={1}
                value={record.ttl}
                onChange={(e) => onChange({ ttl: e.target.value })}
                className={`${inputClass} mt-2`}
                aria-invalid={Boolean(errors.ttl)}
              />
              {errors.ttl ? (
                <p className="mt-1 text-ui text-red-400" role="alert">
                  {errors.ttl}
                </p>
              ) : (
                <p className="mt-1 text-ui text-aws-main-text-secondary">
                  Recommended values: 60 to 172800 (two days)
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`routing-policy-${record.id}`} className="block">
                <InfoLabel>Routing policy</InfoLabel>
              </label>
              <select
                id={`routing-policy-${record.id}`}
                value="simple"
                disabled
                className={`${inputClass} mt-2 cursor-not-allowed opacity-70`}
              >
                <option value="simple">Simple routing</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
