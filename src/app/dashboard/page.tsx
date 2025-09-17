import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TodayPlanCard from "@/components/dashboard/widgets/TodayPlanCard";
import ProgressCard from "@/components/dashboard/widgets/ProgressCard";
import RevisionQueueCard from "@/components/dashboard/widgets/RevisionQueueCard";
import InsightsCard from "@/components/dashboard/widgets/InsightsCard";
import XPCard from "@/components/dashboard/widgets/XPCard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* switch to a 12-col grid for better control */}
      <div className="grid grid-cols-12 gap-6">
        {/* left stack */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-8 space-y-6">
          <TodayPlanCard />
          <ProgressCard />
        </div>

        {/* right stack (wider at xl than your previous 1/3) */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-4 space-y-6">
          <RevisionQueueCard />
          <InsightsCard />
          <XPCard />
        </div>
      </div>
    </DashboardLayout>
  );
}