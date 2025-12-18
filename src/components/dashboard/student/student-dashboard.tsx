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
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-bold tracking-tighter font-headline">Your Expeditions</h1>
        <p className="text-xl text-muted-foreground mt-1">Here are the trips you're signed up for.</p>
      </div>

      {trips.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, i) => (
             <div key={trip.id} className="animate-fade-in-up-strong" style={{animationDelay: `${i * 100}ms`, animationFillMode: 'backwards'}}>
                <TripCard trip={trip} studentId={user.id} />
            </div>
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/50 p-12 text-center mt-16 min-h-[400px] animate-fade-in-up-strong">
            <div className="bg-secondary p-6 rounded-full mb-4">
                <Icons.Checklist className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-3xl font-bold">No trips assigned yet</h3>
            <p className="mb-6 mt-2 text-lg text-muted-foreground">Check back later to see if an educator has assigned you to a trip.</p>
        </div>
      )}
    </div>
  );
}

function TripCard({ trip, studentId }: { trip: Trip, studentId: string }) {
  const progress = getStudentTripProgress(studentId, trip.id);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 border-border/30 h-full">
        <CardHeader className="p-0">
            <div className="relative h-56 w-full">
                <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" data-ai-hint={trip.imageHint}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                 <div className="absolute bottom-0 left-0 p-6">
                    <CardTitle className="font-headline text-3xl tracking-tighter text-white">
                        {trip.name}
                    </CardTitle>
                 </div>
            </div>
        </CardHeader>
        <CardContent className="flex-grow p-6">
            <div className="flex items-center text-base text-muted-foreground">
                <Icons.Calendar className="mr-3 h-5 w-5" />
                <span>{new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4 p-6 pt-0">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Your Progress</span>
                    <span className="text-lg font-bold text-accent">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
            </div>
            <Link href={`/student/trip/${trip.id}`} className="w-full">
                <Button variant="outline" size="lg" className="w-full mt-2 text-base font-bold">View Checklist</Button>
            </Link>
        </CardFooter>
    </Card>
  );
}
