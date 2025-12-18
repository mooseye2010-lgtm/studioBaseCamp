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
        <div className="flex flex-col h-full p-6 space-y-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-48 rounded-lg" />
                <Skeleton className="h-14 w-40 rounded-full" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-3xl" />
                <Skeleton className="h-32 w-full rounded-3xl" />
                <Skeleton className="h-32 w-full rounded-3xl" />
            </div>
        </div>
    )
}
