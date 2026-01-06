
import { TripDetails } from "@/components/dashboard/educator/trip-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function EducatorTripDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<TripDetailsSkeleton />}>
      <TripDetails tripId={params.id} />
    </Suspense>
  );
}

function TripDetailsSkeleton() {
  return (
    <div className="p-6">
      <Skeleton className="h-9 w-40 mb-8 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
          <Skeleton className="h-10 w-2/3 rounded-lg" />
          <Skeleton className="h-6 w-1/3 rounded-lg" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
