'use client';
import { useState, useEffect } from 'react';
import type { Trip } from '@/lib/types';
import { trips as allTrips } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <div className="container mx-auto max-w-5xl py-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight font-headline">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of your expeditions.</p>
            </div>
            <Button asChild size="lg" className="font-bold text-lg">
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
        <div className="text-center p-12 border-2 border-dashed rounded-lg animate-fade-in-up">
            <Icons.List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-medium">No trips yet</h3>
            <p className="max-w-md mx-auto mt-2 text-muted-foreground">Get started by creating a new trip for your students.</p>
        </div>
      )}
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const progress = getOverallTripProgress(trip.id);

  return (
    <Link href={`/educator/trip/${trip.id}`} className="block group">
        <Card className="flex items-center overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 bg-card/80 backdrop-blur-sm">
             <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" data-ai-hint={trip.imageHint} />
            </div>
            <div className="flex-1 p-4 sm:p-6">
                <h2 className="font-bold text-xl sm:text-2xl leading-tight font-headline">
                    {trip.name}
                </h2>
                 <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Icons.Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-medium text-muted-foreground">Overall Progress</span>
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
