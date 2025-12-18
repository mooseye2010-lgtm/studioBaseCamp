'use client';
import { useState, useEffect } from 'react';
import type { Trip } from '@/lib/types';
import { trips as allTrips } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';
import { getStudentTripProgress } from '@/lib/utils';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

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
  
  // If there is only one trip, redirect to it
  if (trips.length === 1) {
    if(typeof window !== 'undefined') {
        window.location.href = `/student/trip/${trips[0].id}`;
    }
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
        <div className="mb-10 text-center">
            <h1 className="font-light text-5xl tracking-tight">Your Trips</h1>
        </div>

      {trips.length > 0 ? (
        <div className="grid gap-6">
            {trips.map((trip, i) => (
              <div key={trip.id} className="animate-fade-in-up" style={{animationDelay: `${i * 100}ms`, animationFillMode: 'backwards'}}>
                <TripCard trip={trip} studentId={user.id} />
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center p-12 border-2 border-dashed rounded-lg animate-fade-in-up">
            <Icons.Checklist className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-medium">No trips assigned yet.</h3>
            <p className="max-w-md mx-auto mt-2 text-muted-foreground">Check back later. An educator will assign you to a trip soon!</p>
        </div>
      )}
    </div>
  );
}

function TripCard({ trip, studentId }: { trip: Trip, studentId: string }) {
  const progress = getStudentTripProgress(studentId, trip.id);

  return (
    <Link href={`/student/trip/${trip.id}`} className="block group">
        <Card className="flex items-center overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/20">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" data-ai-hint={trip.imageHint}/>
            </div>
            <div className="flex-1 p-4 sm:p-6 w-full">
                <h2 className="font-medium text-xl sm:text-2xl leading-tight">
                    {trip.name}
                </h2>
                 <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Icons.Calendar className="mr-2 h-4 w-4" />
                    <span>{format(new Date(trip.date), 'MMMM d, yyyy')}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="font-medium text-muted-foreground">Your Progress</span>
                      <span className="font-semibold text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
            </div>
             <div className="px-4 text-muted-foreground transition-transform group-hover:translate-x-1">
                <Icons.ChevronRight className="h-6 w-6" />
            </div>
        </Card>
    </Link>
  );
}
