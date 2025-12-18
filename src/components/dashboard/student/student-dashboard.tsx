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
    <div className="container mx-auto max-w-5xl py-8 md:py-12">
        <div className="mb-10 md:mb-16 text-center">
            <h1 className="font-headline text-7xl md:text-8xl font-black tracking-tighter leading-none">Your</h1>
            <h1 className="font-headline text-7xl md:text-8xl font-black tracking-tighter leading-none text-primary">Expeditions</h1>
        </div>

      {trips.length > 0 ? (
        <div className="grid gap-8 md:gap-12">
            {trips.map((trip, i) => (
              <div key={trip.id} className="animate-fade-in-up-strong" style={{animationDelay: `${i * 100}ms`, animationFillMode: 'backwards'}}>
                <TripCard trip={trip} studentId={user.id} />
              </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-3xl animate-fade-in-up-strong">
            <Icons.Checklist className="h-24 w-24 text-muted-foreground/50 mb-6" />
            <h3 className="text-4xl font-bold tracking-tight font-headline">No trips assigned yet</h3>
            <p className="max-w-md mt-2 text-lg text-muted-foreground">Check back later. An educator will assign you to an expedition soon!</p>
        </div>
      )}
    </div>
  );
}

function TripCard({ trip, studentId }: { trip: Trip, studentId: string }) {
  const progress = getStudentTripProgress(studentId, trip.id);

  return (
    <Link href={`/student/trip/${trip.id}`} className="block group">
        <Card className="relative flex flex-col md:flex-row items-center overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/10 rounded-3xl border-2 hover:border-primary/50">
            <div className="relative w-full md:w-1/3 aspect-video md:aspect-[4/3] overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" data-ai-hint={trip.imageHint}/>
            </div>
            <div className="flex-1 p-6 md:p-8 lg:p-10 w-full text-center md:text-left">
                <h2 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tighter leading-tight drop-shadow-sm">
                    {trip.name}
                </h2>
                 <div className="flex items-center justify-center md:justify-start text-lg text-muted-foreground mt-3 font-medium">
                    <Icons.Calendar className="mr-2 h-5 w-5" />
                    <span>{format(new Date(trip.date), 'MMMM d, yyyy')}</span>
                </div>
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-base font-bold text-muted-foreground">YOUR PROGRESS</span>
                      <span className="font-headline font-bold text-4xl text-primary">{progress}%</span>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-700 ease-out" 
                        style={{width: `${progress}%`}}
                    />
                  </div>
                </div>
            </div>
            <div className="absolute top-4 right-4 text-foreground/20 group-hover:text-primary transition-colors duration-300">
                <Icons.ArrowRight className="h-8 w-8" />
            </div>
        </Card>
    </Link>
  );
}
