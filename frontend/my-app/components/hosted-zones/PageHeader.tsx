import Toolbar from "./Toolbar";

type PageHeaderProps = {
  filteredCount: number;
  totalCount: number;
  hasActiveFilter: boolean;
  selectedZoneId: number | null;
  refreshing: boolean;
  onRefresh: () => void;
  onDeleteClick: () => void;
};

export default function PageHeader({
  filteredCount,
  totalCount,
  hasActiveFilter,
  selectedZoneId,
  refreshing,
  onRefresh,
  onDeleteClick,
}: PageHeaderProps) {
  const countLabel = hasActiveFilter
    ? `${filteredCount}/${totalCount}`
    : `${totalCount}`;

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal leading-tight text-aws-main-text">
            Hosted zones{" "}
            <span className="text-lg font-normal text-aws-main-text-secondary">
              ({countLabel})
            </span>
          </h1>
          <p className="mt-1.5 text-ui leading-snug text-aws-main-text-secondary">
            Automatic mode is the current search behavior optimized for best filter results.
          </p>
        </div>
        <Toolbar
          selectedZoneId={selectedZoneId}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onDeleteClick={onDeleteClick}
        />
      </div>
    </section>
  );
}
