import { Checklist } from "@/components/dashboard/student/checklist";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function StudentTripChecklistPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto max-w-4xl">
      <Suspense fallback={<ChecklistSkeleton />}>
        <Checklist tripId={params.id} />
      </Suspense>
    </div>
  );
}

function ChecklistSkeleton() {
    return (
         <div className="space-y-6">
             <Skeleton className="h-10 w-2/3" />
             <Skeleton className="h-6 w-1/3" />
             <Skeleton className="h-4 w-full" />
             <div className="space-y-4 pt-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
             </div>
        </div>
    )
}
