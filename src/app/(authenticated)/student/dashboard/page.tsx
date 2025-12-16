import { StudentDashboard } from "@/components/dashboard/student/student-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function StudentDashboardPage() {
    return (
        <div className="container mx-auto">
            <Suspense fallback={<DashboardSkeleton />}>
                <StudentDashboard />
            </Suspense>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}