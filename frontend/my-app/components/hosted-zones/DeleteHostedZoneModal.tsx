"use client";

import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type DeleteHostedZoneModalProps = {
  zoneName: string;
  open: boolean;
  deleting: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteHostedZoneModal({
  zoneName,
  open,
  deleting,
  error,
  onClose,
  onConfirm,
}: DeleteHostedZoneModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText === "delete";

  useEffect(() => {
    if (open) {
      setConfirmText("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canDelete && !deleting) {
      onConfirm();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1218]/80 p-6"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-hosted-zone-title"
        className="w-full max-w-[640px] rounded-lg border border-aws-nav-border-strong/80 bg-aws-main-elevated shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="relative px-6 pb-2 pt-6">
            <h2
              id="delete-hosted-zone-title"
              className="pr-8 text-[15px] font-bold leading-snug text-aws-main-text"
            >
              Delete hosted zone {zoneName}?
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
              Delete the hosted zone permanently? This action cannot be undone.
              Your domain might become unavailable on the internet.
            </p>

            <div className="my-5 border-t border-aws-main-border/60" />

            <p className="text-body leading-relaxed text-aws-nav-text-body">
              To confirm that you want to delete the hosted zone, enter{" "}
              <em>delete</em> in the field.
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete"
              disabled={deleting}
              autoFocus
              className="mt-4 w-full rounded-md border border-aws-nav-border-strong bg-aws-main px-3 py-2.5 text-body text-aws-main-text placeholder:italic placeholder:text-aws-main-text-muted focus:border-aws-accent focus:outline-none focus:ring-1 focus:ring-aws-accent/40 disabled:opacity-60"
            />

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
                type="submit"
                disabled={!canDelete || deleting}
                className={`inline-flex h-8 min-w-[72px] items-center justify-center rounded-full px-5 text-ui font-semibold transition-opacity disabled:cursor-not-allowed ${
                  canDelete && !deleting
                    ? "bg-aws-orange text-aws-nav hover:opacity-90"
                    : "bg-[#414d5c] font-normal text-aws-main-text-secondary"
                }`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
