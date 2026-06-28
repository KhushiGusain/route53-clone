"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { DNSRecord } from "@/lib/types";

const labelClass = "text-ui font-bold text-aws-main-text-secondary";
const valueClass = "mt-1 text-body text-aws-main-text break-all";
const inputClass =
  "w-full rounded border border-aws-main-border/70 bg-aws-main px-3 py-2 text-body text-aws-main-text placeholder:text-aws-main-text-muted focus:border-aws-accent focus:outline-none focus:ring-1 focus:ring-aws-accent/30";

const editBtnClass =
  "inline-flex h-7 w-full items-center justify-center rounded-full border border-aws-accent bg-transparent px-3 text-ui font-normal text-aws-link transition-colors hover:bg-aws-main-elevated";

type SidebarMode = "view" | "edit";

export type RecordEditDraft = {
  value: string;
  ttl: string;
  routingPolicy: string;
};

type RecordDetailsPanelProps = {
  record: DNSRecord;
  onClose: () => void;
  onSave: (recordId: number, draft: RecordEditDraft) => Promise<void>;
};

export type RecordFormErrors = {
  value?: string;
  ttl?: string;
};

function validateDraft(draft: RecordEditDraft): RecordFormErrors {
  const errors: RecordFormErrors = {};

  if (!draft.value.trim()) {
    errors.value = "Value is required.";
  }

  const ttl = Number(draft.ttl);
  if (!draft.ttl.trim() || Number.isNaN(ttl) || ttl < 1) {
    errors.ttl = "TTL is required and must be a positive number.";
  }

  return errors;
}

function hasValidationErrors(errors: RecordFormErrors) {
  return Object.keys(errors).length > 0;
}

function createDraftFromRecord(record: DNSRecord): RecordEditDraft {
  return {
    value: record.value,
    ttl: String(record.ttl),
    routingPolicy: "simple",
  };
}

function PanelShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden border-l border-aws-main-border/70 bg-aws-main shadow-xl">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-aws-main-border/50 px-4 py-3">
        <h3 className="text-body font-bold text-aws-main-text">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-aws-main-text-secondary transition-colors hover:bg-aws-main-elevated hover:text-aws-main-text"
          aria-label="Close panel"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </aside>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <p className={valueClass}>{value}</p>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <p className={`${valueClass} text-aws-main-text-secondary`}>{value}</p>
    </div>
  );
}

function RecordDetailsView({
  record,
  onClose,
  onEdit,
}: {
  record: DNSRecord;
  onClose: () => void;
  onEdit: () => void;
}) {
  const valueLines = record.value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <PanelShell title="Record details" onClose={onClose}>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-5">
          <button type="button" onClick={onEdit} className={editBtnClass}>
            Edit record
          </button>

          <DetailField label="Record name" value={record.name} />
          <DetailField label="Record type" value={record.type} />

          <div>
            <p className={labelClass}>Value</p>
            <div className="mt-1 space-y-1">
              {valueLines.length > 0 ? (
                valueLines.map((line, index) => (
                  <p key={`${line}-${index}`} className={valueClass}>
                    {line}
                  </p>
                ))
              ) : (
                <p className={valueClass}>-</p>
              )}
            </div>
          </div>

          <DetailField label="Alias" value="No" />
          <DetailField label="TTL (seconds)" value={String(record.ttl)} />
          <DetailField label="Routing policy" value="Simple" />
        </div>
      </div>
    </PanelShell>
  );
}

function RecordEditView({
  record,
  draft,
  saving,
  saveError,
  fieldErrors,
  onClose,
  onCancel,
  onSave,
  onDraftChange,
}: {
  record: DNSRecord;
  draft: RecordEditDraft;
  saving: boolean;
  saveError: string;
  fieldErrors: RecordFormErrors;
  onClose: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDraftChange: (updates: Partial<RecordEditDraft>) => void;
}) {
  return (
    <PanelShell title="Edit record" onClose={onClose}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-5">
            <ReadOnlyField label="Record name" value={record.name} />
            <ReadOnlyField label="Record type" value={record.type} />

            <div>
              <label htmlFor={`edit-value-${record.id}`} className={labelClass}>
                Value
              </label>
              <textarea
                id={`edit-value-${record.id}`}
                value={draft.value}
                onChange={(e) => onDraftChange({ value: e.target.value })}
                rows={4}
                disabled={saving}
                aria-invalid={Boolean(fieldErrors.value)}
                className={`${inputClass} mt-2 disabled:cursor-not-allowed disabled:opacity-60`}
              />
              {fieldErrors.value ? (
                <p className="mt-1 text-ui text-red-400" role="alert">
                  {fieldErrors.value}
                </p>
              ) : (
                <p className="mt-1 text-ui text-aws-main-text-secondary">
                  Enter multiple values on separate lines.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 opacity-60">
              <button
                type="button"
                role="switch"
                aria-checked={false}
                aria-label="Alias"
                disabled
                className="relative h-5 w-9 shrink-0 cursor-not-allowed rounded-full bg-aws-main-border"
              >
                <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow" />
              </button>
              <span className="text-ui text-aws-main-text">Alias</span>
            </div>

            <div>
              <label htmlFor={`edit-ttl-${record.id}`} className={labelClass}>
                TTL (seconds)
              </label>
              <input
                id={`edit-ttl-${record.id}`}
                type="number"
                min={1}
                value={draft.ttl}
                onChange={(e) => onDraftChange({ ttl: e.target.value })}
                disabled={saving}
                aria-invalid={Boolean(fieldErrors.ttl)}
                className={`${inputClass} mt-2 disabled:cursor-not-allowed disabled:opacity-60`}
              />
              {fieldErrors.ttl && (
                <p className="mt-1 text-ui text-red-400" role="alert">
                  {fieldErrors.ttl}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`edit-routing-${record.id}`}
                className={labelClass}
              >
                Routing policy
              </label>
              <select
                id={`edit-routing-${record.id}`}
                value={draft.routingPolicy}
                onChange={(e) =>
                  onDraftChange({ routingPolicy: e.target.value })
                }
                disabled={saving}
                className={`${inputClass} mt-2 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <option value="simple">Simple routing</option>
              </select>
            </div>
          </div>

          {saveError && (
            <p className="mt-4 text-ui text-red-400" role="alert">
              {saveError}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-4 border-t border-aws-main-border/50 px-4 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="text-ui text-aws-link hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex h-8 items-center rounded-full bg-aws-orange px-5 text-ui font-semibold text-aws-nav transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </PanelShell>
  );
}

export default function RecordDetailsPanel({
  record,
  onClose,
  onSave,
}: RecordDetailsPanelProps) {
  const [mode, setMode] = useState<SidebarMode>("view");
  const [draft, setDraft] = useState<RecordEditDraft>(() =>
    createDraftFromRecord(record),
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RecordFormErrors>({});

  useEffect(() => {
    setMode("view");
    setDraft(createDraftFromRecord(record));
    setSaveError("");
    setFieldErrors({});
  }, [record]);

  function handleEdit() {
    setDraft(createDraftFromRecord(record));
    setSaveError("");
    setFieldErrors({});
    setMode("edit");
  }

  function handleCancel() {
    if (saving) {
      return;
    }

    setDraft(createDraftFromRecord(record));
    setSaveError("");
    setFieldErrors({});
    setMode("view");
  }

  async function handleSave() {
    setSaveError("");

    const errors = validateDraft(draft);
    if (hasValidationErrors(errors)) {
      setFieldErrors(errors);
      setSaveError("Please fix the errors below before saving.");
      return;
    }

    setFieldErrors({});
    setSaving(true);

    try {
      await onSave(record.id, draft);
      setMode("view");
    } catch {
      setSaveError("Failed to save record. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleDraftChange(updates: Partial<RecordEditDraft>) {
    setDraft((prev) => ({ ...prev, ...updates }));
    if (saveError) {
      setSaveError("");
    }
    if (fieldErrors.value && updates.value !== undefined) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.value;
        return next;
      });
    }
    if (fieldErrors.ttl && updates.ttl !== undefined) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.ttl;
        return next;
      });
    }
  }

  if (mode === "edit") {
    return (
      <RecordEditView
        record={record}
        draft={draft}
        saving={saving}
        saveError={saveError}
        fieldErrors={fieldErrors}
        onClose={onClose}
        onCancel={handleCancel}
        onSave={handleSave}
        onDraftChange={handleDraftChange}
      />
    );
  }

  return (
    <RecordDetailsView record={record} onClose={onClose} onEdit={handleEdit} />
  );
}
