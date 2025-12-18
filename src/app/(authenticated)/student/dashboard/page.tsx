import { StudentDashboard } from "@/components/dashboard/student/student-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function StudentDashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <StudentDashboard />
        </Suspense>
    );
}

function DashboardSkeleton() {
    return (
        <div className="flex flex-col h-full p-4 md:p-8">
            <div className="flex-1 flex items-center justify-center">
                <Skeleton className="w-full max-w-md h-96 rounded-3xl" />
            </div>
        </div>
    )
}
