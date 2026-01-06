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
import { Button } from '@/components/ui/button';

export function StudentDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);

  useEffect(() => {
    if (user) {
      const assignedTrips = allTrips.filter(trip => trip.assignedStudentIds.includes(user.id));
      setTrips(assignedTrips);
    }
  }, [user]);

  if (!user || user.role !== 'student') {
    return null;
  }
  
  if (trips.length === 0) {
    return (
        <div className="flex items-center justify-center h-full text-center p-8">
            <div className="animate-float-in">
                <Icons.Checklist className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-3xl tracking-widest font-light font-headline">No trips assigned yet.</h3>
                <p className="max-w-md mx-auto mt-3 text-muted-foreground text-base uppercase font-body tracking-wider">Check back later. An educator will assign you to a trip soon!</p>
            </div>
        </div>
    );
  }
  
  const handleNext = () => {
      setCurrentTripIndex((prev) => (prev + 1) % trips.length);
  }
  
  const handlePrev = () => {
      setCurrentTripIndex((prev) => (prev - 1 + trips.length) % trips.length);
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-4xl max-h-4xl bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="relative w-full max-w-md h-[70vh]" style={{ perspective: '1000px'}}>
            {trips.map((trip, index) => {
                const isCurrent = index === currentTripIndex;
                const offset = index - currentTripIndex;
                
                return (
                    <div
                        key={trip.id}
                        className="absolute w-full h-full transition-all duration-500 ease-3d"
                        style={{
                            transform: `rotateY(${offset * 20}deg) translateX(${offset * 15}%) scale(${isCurrent ? 1 : 0.8})`,
                            zIndex: trips.length - Math.abs(offset),
                            opacity: Math.abs(offset) > 1 ? 0 : 1,
                            pointerEvents: isCurrent ? 'auto' : 'none',
                        }}
                    >
                        <TripCard trip={trip} studentId={user.id} />
                    </div>
                )
            })}
        </div>
        
        <div className="mt-8 flex items-center gap-4">
            <Button onClick={handlePrev} variant="outline" size="icon" className="rounded-full h-14 w-14 bg-card/50 backdrop-blur-md">
                <Icons.ArrowLeft className="h-6 w-6" />
            </Button>
             <Button onClick={handleNext} variant="outline" size="icon" className="rounded-full h-14 w-14 bg-card/50 backdrop-blur-md">
                <Icons.ArrowRight className="h-6 w-6" />
            </Button>
        </div>
    </div>
  );
}

function TripCard({ trip, studentId }: { trip: Trip, studentId: string }) {
  const progress = getStudentTripProgress(studentId, trip.id);

  return (
    <Link href={`/student/trip/${trip.id}`} className="block group h-full">
        <Card className="relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out shadow-2xl shadow-black/30 hover:shadow-primary/20 bg-card/80 backdrop-blur-xl rounded-[2.5rem] group-hover:scale-[1.03] group-hover:-translate-y-2 border-border/20">
            <div className="relative w-full h-1/2 flex-shrink-0">
                <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" data-ai-hint={trip.imageHint}/>
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/40 to-transparent" />
            </div>
            <div className="flex flex-col flex-1 p-8 w-full justify-end">
                <div className="text-center">
                    <h2 className="font-headline text-4xl leading-tight tracking-widest font-light">
                        {trip.name}
                    </h2>
                    <div className="flex items-center justify-center text-sm text-muted-foreground mt-3 uppercase font-body tracking-wider">
                        <Icons.Calendar className="mr-2 h-4 w-4" />
                        <span>{format(new Date(trip.date), 'MMMM d, yyyy')}</span>
                    </div>
                </div>
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-1 text-xs uppercase font-body tracking-wider">
                      <span className="font-medium text-muted-foreground">Your Progress</span>
                      <span className="font-semibold text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-full" />
                </div>
            </div>
             <div className="absolute top-6 right-6 text-background bg-foreground/80 backdrop-blur-md rounded-full p-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icons.ArrowRight className="h-6 w-6" />
            </div>
        </Card>
    </Link>
  );
}
