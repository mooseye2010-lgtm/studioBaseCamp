'use client';
import { useState, useEffect } from 'react';
import type { Trip, User } from '@/lib/types';
import { trips as allTrips, users as allUsers } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { getOverallTripProgress } from '@/lib/utils';


export function EducatorDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    // In a real app, this would be a fetch call based on the educator's ID
    setTrips(allTrips); // For mock, educator sees all trips
  }, [user]);

  if (!user || user.role !== 'educator') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Your Trips</h2>
         <Link href="/educator/trip/new">
            <Button>
                <Icons.PlusCircle className="mr-2" />
                Create New Trip
            </Button>
         </Link>
      </div>

      {trips.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
            <Icons.List className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No trips created yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">Get started by creating a new trip for your students.</p>
        </div>
      )}
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const progress = getOverallTripProgress(trip.id);
  const assignedStudents = allUsers.filter(u => trip.assignedStudentIds.includes(u.id));

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
            <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" data-ai-hint={trip.imageHint} />
        </div>
        <div className="p-6 pb-2">
         <CardTitle className="font-headline text-xl leading-tight">
            <Link href={`/educator/trip/${trip.id}`} className="hover:text-primary transition-colors">
                {trip.name}
            </Link>
         </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 p-6 pt-0">
         <div className="flex items-center text-sm text-muted-foreground">
            <Icons.Calendar className="mr-2 h-4 w-4" />
            <span>{new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
         </div>
         <div className="flex items-center text-sm text-muted-foreground">
            <Icons.Users className="mr-2 h-4 w-4" />
            <span>{assignedStudents.length} student{assignedStudents.length !== 1 ? 's' : ''} assigned</span>
         </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 p-6 pt-0">
          <div>
            <span className="text-sm font-medium">Overall Progress</span>
            <Progress value={progress} className="mt-1 h-2" />
          </div>
          <Link href={`/educator/trip/${trip.id}`} className="w-full">
            <Button variant="outline" className="w-full mt-2">View Details</Button>
          </Link>
      </CardFooter>
    </Card>
  );
}
