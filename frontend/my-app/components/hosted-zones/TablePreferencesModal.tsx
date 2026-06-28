"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const COLUMN_OPTIONS = [
  { id: "name", label: "Hosted zone name", defaultOn: true },
  { id: "type", label: "Type", defaultOn: true },
  { id: "acceleratedRecovery", label: "Accelerated recovery", defaultOn: false },
  { id: "createdBy", label: "Created by", defaultOn: true },
  { id: "recordCount", label: "Record count", defaultOn: true },
  { id: "description", label: "Description", defaultOn: true },
  { id: "hostedZoneId", label: "Hosted zone ID", defaultOn: true },
] as const;

const SEARCH_MODES = [
  {
    value: "automatic",
    label: "Automatic",
    description:
      "The service chooses a filter mode based on the total number of items.",
  },
  {
    value: "full",
    label: "Full",
    description:
      "All search filters are available, but search performance might be slower.",
  },
  {
    value: "fast",
    label: "Fast",
    description:
      "Some advanced searches may not be available, but search performance will be faster.",
  },
] as const;

type TablePreferencesModalProps = {
  open: boolean;
  pageSize: number;
  onClose: () => void;
  onConfirm: (pageSize: number) => void;
};

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? "bg-aws-accent" : "bg-aws-main-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function TablePreferencesModal({
  open,
  pageSize,
  onClose,
  onConfirm,
}: TablePreferencesModalProps) {
  const [draftPageSize, setDraftPageSize] = useState(pageSize);
  const [wrapLines, setWrapLines] = useState(false);
  const [searchMode, setSearchMode] =
    useState<(typeof SEARCH_MODES)[number]["value"]>("automatic");
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        COLUMN_OPTIONS.map((column) => [column.id, column.defaultOn])
      )
  );

  useEffect(() => {
    if (open) {
      setDraftPageSize(pageSize);
      setWrapLines(false);
      setSearchMode("automatic");
      setVisibleColumns(
        Object.fromEntries(
          COLUMN_OPTIONS.map((column) => [column.id, column.defaultOn])
        )
      );
    }
  }, [open, pageSize]);

  if (!open) {
    return null;
  }

  function toggleColumn(id: string) {
    setVisibleColumns((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  function handleConfirm() {
    onConfirm(draftPageSize);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1218]/80 p-4 sm:p-6"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="table-preferences-title"
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-aws-nav-border-strong/80 bg-aws-main shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-aws-main-border/70 px-6 py-4">
          <h2
            id="table-preferences-title"
            className="text-body font-bold text-aws-main-text"
          >
            Preferences
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-aws-main-text transition-colors hover:text-aws-nav-text"
            aria-label="Close"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-2">
          <div className="space-y-6 px-6 py-5">
            <fieldset>
              <legend className="text-ui font-bold text-aws-main-text">
                Page size
              </legend>
              <div className="mt-3 space-y-2.5">
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2.5 text-ui text-aws-main-text"
                  >
                    <input
                      type="radio"
                      name="pageSize"
                      checked={draftPageSize === option}
                      onChange={() => setDraftPageSize(option)}
                      className="h-3.5 w-3.5 accent-aws-accent"
                    />
                    {option} items
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={wrapLines}
                  onChange={(e) => setWrapLines(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 accent-aws-accent"
                />
                <span>
                  <span className="block text-ui font-bold text-aws-main-text">
                    Wrap lines
                  </span>
                  <span className="mt-0.5 block text-ui text-aws-main-text-secondary">
                    Check to see all the text and wrap the lines.
                  </span>
                </span>
              </label>
            </div>

            <fieldset>
              <legend className="text-ui font-bold text-aws-main-text">
                Search mode
              </legend>
              <div className="mt-3 space-y-3">
                {SEARCH_MODES.map((mode) => (
                  <label
                    key={mode.value}
                    className="flex cursor-pointer items-start gap-2.5"
                  >
                    <input
                      type="radio"
                      name="searchMode"
                      checked={searchMode === mode.value}
                      onChange={() => setSearchMode(mode.value)}
                      className="mt-0.5 h-3.5 w-3.5 accent-aws-accent"
                    />
                    <span>
                      <span className="block text-ui text-aws-main-text">
                        {mode.label}
                      </span>
                      <span className="mt-0.5 block text-ui text-aws-main-text-secondary">
                        {mode.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="border-t border-aws-main-border/70 px-6 py-5 md:border-l md:border-t-0">
            <h3 className="text-ui font-bold text-aws-main-text">
              Select visible columns
            </h3>
            <p className="mt-1 text-ui text-aws-main-text-secondary">Properties</p>

            <ul className="mt-4 space-y-3">
              {COLUMN_OPTIONS.map((column) => (
                <li
                  key={column.id}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-ui text-aws-main-text">{column.label}</span>
                  <ToggleSwitch
                    checked={visibleColumns[column.id] ?? false}
                    onChange={() => toggleColumn(column.id)}
                    label={column.label}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-5 border-t border-aws-main-border/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="text-ui text-aws-link hover:underline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex h-8 items-center rounded-full bg-aws-orange px-5 text-ui font-semibold text-aws-nav transition-opacity hover:opacity-90"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export { PAGE_SIZE_OPTIONS };
