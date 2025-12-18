import { EducatorDashboard } from "@/components/dashboard/educator/educator-dashboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EducatorDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <EducatorDashboard />
    </Suspense>
  );
}

function DashboardSkeleton() {
    return (
        <div className="flex flex-col h-full p-4 md:p-8">
            <div className="flex-1 flex items-center justify-center">
                <Skeleton className="w-full max-w-md h-96 rounded-3xl" />
            </div>
            <div className="flex-shrink-0 flex justify-end">
                <Skeleton className="h-14 w-48 rounded-full" />
            </div>
        </div>
    )
}
