"use client";

import { X } from "lucide-react";
import type { DNSRecord } from "@/lib/types";

type DeleteDnsRecordModalProps = {
  records: DNSRecord[];
  open: boolean;
  deleting: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteDnsRecordModal({
  records,
  open,
  deleting,
  error,
  onClose,
  onConfirm,
}: DeleteDnsRecordModalProps) {
  if (!open || records.length === 0) {
    return null;
  }

  const isSingle = records.length === 1;
  const record = records[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1218]/80 p-6"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dns-record-title"
        className="w-full max-w-[640px] rounded-lg border border-aws-nav-border-strong/80 bg-aws-main-elevated shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-6 pb-2 pt-6">
          <h2
            id="delete-dns-record-title"
            className="pr-8 text-[15px] font-bold leading-snug text-aws-main-text"
          >
            {isSingle
              ? `Delete record ${record.name}?`
              : `Delete ${records.length} records?`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="absolute right-5 top-5 text-aws-main-text transition-colors hover:text-aws-nav-text disabled:opacity-60"
            aria-label="Close"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-4">
          <p className="text-body leading-relaxed text-aws-nav-text-body">
            {isSingle
              ? `Delete the ${record.type} record permanently? This action cannot be undone.`
              : `Delete ${records.length} records permanently? This action cannot be undone.`}
          </p>

          {error && (
            <p className="mt-4 text-ui text-red-400" role="alert">
              {error}
            </p>
          )}

          <div className="mt-8 flex items-center justify-end gap-5">
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="text-ui text-aws-link hover:underline disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="inline-flex h-8 min-w-[72px] items-center justify-center rounded-full bg-aws-orange px-5 text-ui font-semibold text-aws-nav transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
