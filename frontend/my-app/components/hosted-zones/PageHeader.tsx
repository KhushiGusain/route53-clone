import Toolbar from "./Toolbar";

const ZONE_COUNT = 1;

export default function PageHeader() {
  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal leading-tight text-aws-main-text">
            Hosted zones{" "}
            <span className="text-lg font-normal text-aws-main-text-secondary">
              ({ZONE_COUNT})
            </span>
          </h1>
          <p className="mt-1.5 text-ui leading-snug text-aws-main-text-secondary">
            Automatic mode is the current search behavior optimized for best filter results.
          </p>
        </div>
        <Toolbar />
      </div>
    </section>
  );
}
