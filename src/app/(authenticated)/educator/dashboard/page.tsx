import { EducatorDashboard } from "@/components/dashboard/educator/educator-dashboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EducatorDashboardPage() {
  return (
    <div className="container mx-auto">
      <Suspense fallback={<DashboardSkeleton />}>
        <EducatorDashboard />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}
