import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TodayPlanCard from "@/components/dashboard/widgets/TodayPlanCard";
import ProgressCard from "@/components/dashboard/widgets/ProgressCard";
import RevisionQueueCard from "@/components/dashboard/widgets/RevisionQueueCard";
import InsightsCard from "@/components/dashboard/widgets/InsightsCard";
import XPCard from "@/components/dashboard/widgets/XPCard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodayPlanCard />
          <ProgressCard />
        </div>

        <div className="space-y-6">
          <RevisionQueueCard />
          <InsightsCard />
          <XPCard />
        </div>
      </div>
    </DashboardLayout>
  );
}