import type { HostedZone } from "@/lib/types";

const actionBtnClass =
  "inline-flex h-7 items-center rounded-full cursor-pointer border border-aws-accent bg-transparent px-3 text-ui font-normal text-aws-link transition-colors hover:bg-aws-accent/10";

type HostedZoneDetailsHeaderProps = {
  zone: HostedZone;
  onDeleteClick: () => void;
};

export default function HostedZoneDetailsHeader({
  zone,
  onDeleteClick,
}: HostedZoneDetailsHeaderProps) {
  return (
    <section className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2.5">
        <span className="inline-flex shrink-0 items-center rounded bg-aws-accent px-2 py-0.5 text-ui font-medium text-white">
          {zone.type}
        </span>
        <h1 className="text-2xl font-normal leading-tight text-aws-main-text">
          {zone.name}
        </h1>
        <span className="text-ui text-aws-link">Info</span>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <button type="button" className={actionBtnClass} onClick={onDeleteClick}>
          Delete zone
        </button>
        <button type="button" className={actionBtnClass}>
          Test record
        </button>
        <button type="button" className={actionBtnClass}>
          Configure query logging
        </button>
      </div>
    </section>
  );
}
