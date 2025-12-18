'use client';
import { useState, useEffect } from 'react';
import type { Trip } from '@/lib/types';
import { trips as allTrips } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';
import { getOverallTripProgress } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export function EducatorDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    setTrips(allTrips);
  }, []);

  if (!user || user.role !== 'educator') {
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl py-12">
        <header className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-5xl font-bold tracking-tight font-headline">Dashboard</h1>
                <p className="text-muted-foreground mt-2 text-lg">Overview of your expeditions.</p>
            </div>
            <Button asChild size="lg" className="font-bold text-lg rounded-full">
                <Link href="/educator/trip/new">
                    <Icons.PlusCircle className="mr-2 h-5 w-5" />
                    New Trip
                </Link>
            </Button>
        </header>

      {trips.length > 0 ? (
        <div className="space-y-6">
            {trips.map((trip, i) => (
                <div key={trip.id} className="animate-fade-in-up" style={{animationDelay: `${i * 100}ms`, animationFillMode: 'backwards'}}>
                    <TripCard trip={trip} />
                </div>
            ))}
        </div>
      ) : (
        <div className="text-center p-16 border-2 border-dashed rounded-3xl animate-fade-in-up">
            <Icons.List className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-3xl font-medium">No trips yet</h3>
            <p className="max-w-md mx-auto mt-3 text-muted-foreground text-lg">Get started by creating a new trip for your students.</p>
        </div>
      )}
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const progress = getOverallTripProgress(trip.id);

  return (
    <Link href={`/educator/trip/${trip.id}`} className="block group">
        <Card className="flex items-center overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 bg-card/80 backdrop-blur-sm rounded-3xl hover:scale-[1.01] hover:-translate-y-1">
             <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" data-ai-hint={trip.imageHint} />
            </div>
            <div className="flex-1 p-6 sm:p-8">
                <h2 className="font-bold text-2xl sm:text-3xl leading-tight font-headline">
                    {trip.name}
                </h2>
                 <div className="flex items-center text-md text-muted-foreground mt-2">
                    <Icons.Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-medium text-muted-foreground">Overall Progress</span>
                        <span className="font-semibold text-primary text-base">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3 rounded-full" />
                </div>
            </div>
            <div className="px-6 text-muted-foreground transition-transform group-hover:translate-x-1">
                <Icons.ChevronRight className="h-8 w-8" />
            </div>
        </Card>
    </Link>
  );
}
