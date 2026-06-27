"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import type { HostedZone, ZoneType } from "@/lib/types";

const zoneTypes: { value: ZoneType; title: string; description: string }[] = [
  {
    value: "Public",
    title: "Public hosted zone",
    description: "A public hosted zone determines how traffic is routed on the internet.",
  },
  {
    value: "Private",
    title: "Private hosted zone",
    description: "A private hosted zone determines how traffic is routed within an Amazon VPC.",
  },
];

export default function CreateHostedZonePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ZoneType>("Public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Domain name is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hosted-zones`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            type,
            description: description.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create hosted zone.");
      }

      const createdZone = (await response.json()) as HostedZone;
      router.push(`/hosted-zones/${createdZone.id}`);
    } catch {
      setError("Failed to create hosted zone. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout breadcrumbTail="Create hosted zone" showSidebar={true}>
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="text-2xl font-normal text-aws-main-text">
          Create hosted zone
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <section className="rounded border border-aws-main-border/70 bg-aws-main-elevated/30 p-6">
            <h2 className="text-body font-bold text-aws-main-text">
              Hosted zone configuration
            </h2>
            <p className="mt-1 text-ui text-aws-main-text-secondary">
              A hosted zone is a container that holds information about how you want
              to route traffic for a domain, such as example.com, and its subdomains.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-ui font-bold text-aws-main-text">
                  Domain name
                </label>
                <p className="mt-1 text-ui text-aws-main-text-secondary">
                  This is the name of the domain that you want to route traffic for.
                </p>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="example.com"
                  className="mt-2 w-full rounded border border-aws-main-border/70 bg-aws-main px-3 py-2 text-body text-aws-main-text placeholder:text-aws-main-text-muted focus:border-aws-accent focus:outline-none focus:ring-1 focus:ring-aws-accent/30"
                />
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
                  {description.length}/256
                </p>
              </div>

              <fieldset>
                <legend className="block text-ui font-bold text-aws-main-text">
                  Type
                </legend>
                <p className="mt-1 text-ui text-aws-main-text-secondary">
                  The type indicates whether you want to route traffic on the internet
                  or in an Amazon VPC.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {zoneTypes.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded border px-4 py-3 transition-colors ${
                        type === option.value
                          ? "border-aws-accent bg-aws-main-elevated/60"
                          : "border-aws-main-border/70 bg-aws-main hover:border-aws-main-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={type === option.value}
                        onChange={() => setType(option.value)}
                        className="mt-0.5 accent-aws-accent"
                      />
                      <span>
                        <span className="block text-ui font-bold text-aws-main-text">
                          {option.title}
                        </span>
                        <span className="mt-1 block text-ui text-aws-main-text-secondary">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          {error && (
            <p className="text-ui text-red-400" role="alert">
              {error}
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
              disabled={loading}
              className="inline-flex h-8 items-center rounded-full bg-aws-orange px-5 text-ui font-semibold text-aws-nav transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create hosted zone"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
