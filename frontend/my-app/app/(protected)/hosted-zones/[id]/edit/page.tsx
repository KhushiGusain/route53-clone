"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import type { HostedZone } from "@/lib/types";

const readOnlyValueClass = "mt-1 text-body text-aws-main-text";

function typeLabel(type: HostedZone["type"]) {
  return type === "Public" ? "Public hosted zone" : "Private hosted zone";
}

export default function EditHostedZonePage() {
  const router = useRouter();
  const params = useParams();
  const zoneId = params.id as string;

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [description, setDescription] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchHostedZone() {
      setLoading(true);
      setFetchError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hosted-zones/${zoneId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load hosted zone.");
        }

        const data = (await response.json()) as HostedZone;
        setZone(data);
        setDescription(data.description ?? "");
      } catch {
        setFetchError("Failed to load hosted zone. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchHostedZone();
  }, [zoneId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hosted-zones/${zoneId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: description.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update hosted zone.");
      }

      router.push("/hosted-zones");
    } catch {
      setSubmitError("Failed to update hosted zone. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppLayout breadcrumbTail="Edit">
        <p className="text-ui text-aws-main-text-secondary">Loading...</p>
      </AppLayout>
    );
  }

  if (fetchError || !zone) {
    return (
      <AppLayout breadcrumbTail="Edit">
        <p className="text-ui text-red-400" role="alert">
          {fetchError || "Hosted zone not found."}
        </p>
        <Link
          href="/hosted-zones"
          className="mt-4 inline-block text-ui text-aws-link hover:underline"
        >
          Back to hosted zones
        </Link>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      breadcrumbZone={{ id: zone.id, name: zone.name }}
      breadcrumbTail="Edit"
    >
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="text-2xl font-normal text-aws-main-text">
          Edit {zone.name}
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <section className="rounded border border-aws-main-border/70 bg-aws-main-elevated/30 p-6">
            <h2 className="text-body font-bold text-aws-main-text">
              Edit hosted zone
            </h2>
            <p className="mt-1 text-ui text-aws-main-text-secondary">
              A hosted zone is a container that holds information about how you want
              to route traffic for a domain, such as example.com, and its subdomains.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-ui font-bold text-aws-main-text">Domain name</p>
                <p className={readOnlyValueClass}>{zone.name}</p>
              </div>

              <div>
                <p className="text-ui font-bold text-aws-main-text">
                  Hosted zone ID
                </p>
                <p className={`${readOnlyValueClass} font-mono`}>
                  {zone.hosted_zone_id}
                </p>
              </div>

              <div>
                <p className="text-ui font-bold text-aws-main-text">Record count</p>
                <p className={readOnlyValueClass}>-</p>
              </div>

              <div>
                <p className="text-ui font-bold text-aws-main-text">Type</p>
                <p className={readOnlyValueClass}>{typeLabel(zone.type)}</p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-ui font-bold text-aws-main-text"
                >
                  Description - optional
                </label>
                <p className="mt-1 text-ui text-aws-main-text-secondary">
                  This value lets you distinguish hosted zones that have the same name.
                </p>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={256}
                  placeholder="The hosted zone is used for..."
                  className="mt-2 w-full rounded border border-aws-main-border/70 bg-aws-main px-3 py-2 text-body text-aws-main-text placeholder:text-aws-main-text-muted focus:border-aws-accent focus:outline-none focus:ring-1 focus:ring-aws-accent/30"
                />
                <p className="mt-1 text-ui text-aws-main-text-muted">
                  The description can have up to 256 characters. {description.length}
                  /256
                </p>
              </div>
            </div>
          </section>

          {submitError && (
            <p className="text-ui text-red-400" role="alert">
              {submitError}
            </p>
          )}

          <div className="flex items-center justify-end gap-4">
            <Link
              href="/hosted-zones"
              className="text-ui text-aws-link hover:underline"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-8 items-center rounded-full bg-aws-orange px-5 text-ui font-semibold text-aws-nav transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
