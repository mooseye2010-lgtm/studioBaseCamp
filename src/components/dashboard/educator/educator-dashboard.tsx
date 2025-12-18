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
  const [activeTrip, setActiveTrip] = useState<string | null>(null);

  useEffect(() => {
    const educatorTrips = allTrips.filter(trip => trip.assignedStudentIds.some(id => user?.id && id === user.id) || !trip.assignedStudentIds.length);
    setTrips(allTrips);
    if(allTrips.length > 0) {
        setActiveTrip(allTrips[0].id);
    }
  }, [user]);

  if (!user || user.role !== 'educator') {
    return null;
  }

  const activeTripData = trips.find(t => t.id === activeTrip);

  return (
    <div className="container mx-auto max-w-5xl py-12 flex flex-col h-full">
        <header className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-5xl tracking-widest font-headline font-light">Dashboard</h1>
                <p className="text-muted-foreground mt-2 text-base uppercase font-body tracking-wider">Overview of your expeditions.</p>
            </div>
            <Button asChild size="lg" className="text-base rounded-full uppercase font-body tracking-wider">
                <Link href="/educator/trip/new">
                    <Icons.PlusCircle className="mr-2 h-5 w-5" />
                    New Trip
                </Link>
            </Button>
        </header>

      {trips.length > 0 && activeTripData ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 space-y-4">
                {trips.map((trip, i) => (
                    <div 
                        key={trip.id} 
                        className="animate-float-in" 
                        style={{animationDelay: `${i * 100}ms`, animationFillMode: 'backwards'}}
                        onClick={() => setActiveTrip(trip.id)}
                    >
                        <TripListItem trip={trip} isActive={activeTrip === trip.id} />
                    </div>
                ))}
            </div>
            <div className="md:col-span-2 sticky top-28">
                 <TripCard trip={activeTripData} />
            </div>
        </div>
      ) : (
        <div className="text-center p-16 border-2 border-dashed rounded-3xl animate-float-in flex-1 flex flex-col justify-center items-center">
            <Icons.List className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-3xl font-medium uppercase font-body tracking-wider">No trips yet</h3>
            <p className="max-w-md mx-auto mt-3 text-muted-foreground text-base uppercase font-body tracking-wider">Get started by creating a new trip for your students.</p>
        </div>
      )}
    </div>
  );
}

function TripListItem({ trip, isActive }: { trip: Trip, isActive: boolean }) {
    return (
        <Card className={`p-4 cursor-pointer transition-all duration-300 rounded-2xl border-2 ${isActive ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-secondary'}`}>
            <h3 className="font-semibold text-lg uppercase font-body tracking-wider">{trip.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1 uppercase font-body tracking-wider">
                <Icons.Calendar className="mr-2 h-4 w-4" />
                <span>{new Date(trip.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
            </div>
        </Card>
    )
}

function TripCard({ trip }: { trip: Trip }) {
  const progress = getOverallTripProgress(trip.id);

  return (
    <Link href={`/educator/trip/${trip.id}`} className="block group">
        <Card className="flex flex-col overflow-hidden transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 bg-card/80 backdrop-blur-sm rounded-3xl hover:scale-[1.01] hover:-translate-y-1">
             <div className="relative w-full h-64 flex-shrink-0">
                <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" data-ai-hint={trip.imageHint} />
                 <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>
            <div className="flex-1 p-6 sm:p-8">
                <h2 className="font-headline tracking-widest font-light text-2xl sm:text-3xl leading-tight">
                    {trip.name}
                </h2>
                 <div className="flex items-center text-md text-muted-foreground mt-2 uppercase font-body tracking-wider">
                    <Icons.Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-1 text-xs uppercase font-body tracking-wider">
                        <span className="font-medium text-muted-foreground">Overall Progress</span>
                        <span className="font-semibold text-primary text-sm">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3 rounded-full" />
                </div>
            </div>
            <div className="absolute top-4 right-4 p-3 bg-card/50 rounded-full text-foreground transition-transform group-hover:translate-x-1 group-hover:scale-110">
                <Icons.ChevronRight className="h-6 w-6" />
            </div>
        </Card>
    </Link>
  );
}
