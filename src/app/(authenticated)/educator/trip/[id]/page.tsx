import { TripDetails } from "@/components/dashboard/educator/trip-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function EducatorTripDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto">
      <Suspense fallback={<TripDetailsSkeleton />}>
        <TripDetails tripId={params.id} />
      </Suspense>
    </div>
  );
}

function TripDetailsSkeleton() {
    return (
        <div className="space-y-6">
             <Skeleton className="h-10 w-2/3" />
             <Skeleton className="h-6 w-1/3" />
             <div className="grid gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
             </div>
        </div>
    )
}
