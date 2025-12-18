'use client';
import { useState, useEffect } from 'react';
import type { Trip } from '@/lib/types';
import { trips as allTrips } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
    <div className="flex flex-col h-full">
      {trips.length > 0 ? (
        <Carousel className="flex-1 w-full flex flex-col justify-center items-center -mt-16" opts={{loop: true}}>
          <CarouselContent className="-ml-4">
            {trips.map((trip, i) => (
              <CarouselItem key={trip.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                 <div className="p-1">
                    <TripCard trip={trip} />
                 </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex gap-4">
            <CarouselPrevious className="relative -left-4 -top-0 -translate-y-0 h-14 w-14 rounded-full"/>
            <CarouselNext className="relative -right-4 -top-0 -translate-y-0 h-14 w-14 rounded-full"/>
          </div>
        </Carousel>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="bg-secondary/50 p-6 rounded-full mb-6 animate-fade-in-up-strong">
                <Icons.List className="h-20 w-20 text-muted-foreground" />
            </div>
            <h3 className="text-5xl font-bold tracking-tighter font-headline animate-fade-in-up-strong" style={{animationDelay: '100ms'}}>No expeditions yet</h3>
            <p className="max-w-md mt-3 text-xl text-muted-foreground animate-fade-in-up-strong" style={{animationDelay: '200ms'}}>Get started by creating a new expedition for your students.</p>
        </div>
      )}
       <div className="flex-shrink-0 p-8 flex justify-end animate-fade-in-up-strong" style={{animationDelay: '400ms'}}>
         <Link href="/educator/trip/new">
            <Button size="lg" className="font-bold text-xl h-16 rounded-full shadow-2xl shadow-primary/30">
                <Icons.PlusCircle className="mr-3 h-7 w-7" />
                New Expedition
            </Button>
         </Link>
      </div>
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {

  return (
    <Link href={`/educator/trip/${trip.id}`} className="block group">
        <Card className="aspect-[3/4] relative flex flex-col overflow-hidden transition-all duration-500 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/20 rounded-3xl border-border/20 shadow-xl">
            <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" data-ai-hint={trip.imageHint} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative flex flex-col flex-1 justify-end p-8 md:p-10 text-white">
                <h2 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight drop-shadow-lg">
                    {trip.name}
                </h2>
                 <div className="flex items-center text-lg text-white/80 mt-4 font-medium">
                    <Icons.Calendar className="mr-3 h-6 w-6" />
                    <span>{new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
        </Card>
    </Link>
  );
}
