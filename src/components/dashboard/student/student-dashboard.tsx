'use client';
import { useState, useEffect } from 'react';
import type { Trip } from '@/lib/types';
import { trips as allTrips } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { getStudentTripProgress } from '@/lib/utils';
import { Icons } from '@/components/icons';

export function StudentDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (user) {
      const assignedTrips = allTrips.filter(trip => trip.assignedStudentIds.includes(user.id));
      setTrips(assignedTrips);
    }
  }, [user]);

  if (!user || user.role !== 'student') {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Your Assigned Trips</h2>
      {trips.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} studentId={user.id} />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center mt-10">
            <Icons.Checklist className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No trips assigned</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">Check back later to see if an educator has assigned you to a trip.</p>
        </div>
      )}
    </div>
  );
}

function TripCard({ trip, studentId }: { trip: Trip, studentId: string }) {
  const progress = getStudentTripProgress(studentId, trip.id);

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
            <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" data-ai-hint={trip.imageHint}/>
        </div>
         <div className="p-6 pb-2">
            <CardTitle className="font-headline text-xl leading-tight">
                <Link href={`/student/trip/${trip.id}`} className="hover:text-primary transition-colors">
                    {trip.name}
                </Link>
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
         <div className="flex items-center text-sm text-muted-foreground">
            <Icons.Calendar className="mr-2 h-4 w-4" />
            <span>{new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
         </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 p-6 pt-0">
          <div>
            <span className="text-sm font-medium">Your Progress</span>
            <Progress value={progress} className="mt-1 h-2" />
          </div>
          <Link href={`/student/trip/${trip.id}`} className="w-full">
            <Button variant="outline" className="w-full mt-2">View Checklist</Button>
          </Link>
      </CardFooter>
    </Card>
  );
}
