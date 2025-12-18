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
        <div className="flex flex-col h-full items-center justify-center p-4 md:p-8">
            <Skeleton className="w-full max-w-md h-[70vh] rounded-3xl" />
            <div className="flex gap-4 mt-8">
                <Skeleton className="h-3 w-10 rounded-full" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-3 rounded-full" />
            </div>
        </div>
    )
}
