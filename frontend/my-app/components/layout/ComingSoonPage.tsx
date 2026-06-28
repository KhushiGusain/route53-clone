import AppLayout from "@/components/layout/AppLayout";

type ComingSoonPageProps = {
  pageBreadcrumb: string;
};

export default function ComingSoonPage({
  pageBreadcrumb,
}: ComingSoonPageProps) {
  return (
    <AppLayout pageBreadcrumb={pageBreadcrumb}>
      <p className="text-body text-aws-main-text">Coming soon</p>
    </AppLayout>
  );
}
