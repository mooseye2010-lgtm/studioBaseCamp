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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

export function StudentDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (user) {
      const assignedTrips = allTrips.filter(trip => trip.assignedStudentIds.includes(user.id));
      setTrips(assignedTrips);
    }
  }, [user]);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!user || user.role !== 'student') {
    return null;
  }
  
  if (trips.length === 1) {
    if(typeof window !== 'undefined') {
        window.location.href = `/student/trip/${trips[0].id}`;
    }
    return null;
  }

  if (trips.length === 0) {
    return (
        <div className="flex items-center justify-center h-full text-center p-8">
            <div className="animate-fade-in-up">
                <Icons.Checklist className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-3xl font-bold">No trips assigned yet.</h3>
                <p className="max-w-md mx-auto mt-3 text-muted-foreground text-lg">Check back later. An educator will assign you to a trip soon!</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-4">
        <Carousel setApi={setApi} className="w-full max-w-lg" opts={{ loop: true }}>
            <CarouselContent>
                {trips.map((trip) => (
                    <CarouselItem key={trip.id}>
                        <TripCard trip={trip} studentId={user.id} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-[-50px]" />
            <CarouselNext className="right-[-50px]" />
        </Carousel>

        <div className="flex gap-3 mt-8">
            {trips.map((_, i) => (
                <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                        "h-2.5 transition-all duration-300 rounded-full",
                        current === i ? "w-10 bg-primary" : "w-2.5 bg-muted-foreground/50"
                    )}
                />
            ))}
        </div>
    </div>
  );
}

function TripCard({ trip, studentId }: { trip: Trip, studentId: string }) {
  const progress = getStudentTripProgress(studentId, trip.id);

  return (
    <Link href={`/student/trip/${trip.id}`} className="block group">
        <Card className="relative flex flex-col h-[70vh] overflow-hidden transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-primary/20 bg-card/80 backdrop-blur-sm rounded-[2.5rem] group-hover:scale-[1.02] group-hover:-translate-y-1">
            <div className="relative w-full h-1/2 flex-shrink-0">
                <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" data-ai-hint={trip.imageHint}/>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
            </div>
            <div className="flex flex-col flex-1 p-8 w-full justify-end">
                <div className="text-center">
                    <h2 className="font-headline font-bold text-4xl leading-tight">
                        {trip.name}
                    </h2>
                    <div className="flex items-center justify-center text-md text-muted-foreground mt-3">
                        <Icons.Calendar className="mr-2 h-4 w-4" />
                        <span>{format(new Date(trip.date), 'MMMM d, yyyy')}</span>
                    </div>
                </div>
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="font-medium text-muted-foreground">Your Progress</span>
                      <span className="font-semibold text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-full" />
                </div>
            </div>
             <div className="absolute top-6 right-6 text-background bg-foreground/80 rounded-full p-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icons.ArrowRight className="h-6 w-6" />
            </div>
        </Card>
    </Link>
  );
}
