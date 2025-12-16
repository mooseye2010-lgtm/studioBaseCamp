'use client';

import { useState, useEffect } from 'react';
import { trips, users, studentProgress as allStudentProgress } from '@/lib/data';
import type { Trip, User, StudentTripProgress } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { getStudentTripProgress } from '@/lib/utils';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { StudentChecklistView } from './student-checklist-view';

export function TripDetails({ tripId }: { tripId: string }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  useEffect(() => {
    const foundTrip = trips.find(t => t.id === tripId);
    if (foundTrip) {
      setTrip(foundTrip);
      const assignedStudents = users.filter(u => foundTrip.assignedStudentIds.includes(u.id));
      setStudents(assignedStudents);
    } else {
        setTrip(null);
    }
  }, [tripId]);

  if (trip === null) {
    // This will be caught by Suspense in a real app, but for client-side it's a bit different.
    // Let's assume data is always found for now. If it were a real fetch, we'd handle loading/error states.
    // For a static mock, we can use notFound() if we know it doesn't exist.
    // notFound();
    return <p>Loading trip details...</p>;
  }

  if (selectedStudent) {
    return (
        <div>
            <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="mb-4">
                <Icons.ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Students
            </Button>
            <StudentChecklistView 
                trip={trip}
                student={selectedStudent} 
            />
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/educator/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Icons.ArrowLeft size={16} />
            Back to all trips
        </Link>
        <h2 className="text-3xl font-bold tracking-tight font-headline mt-2">{trip.name}</h2>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Icons.Calendar size={16} />
            {new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map(student => (
              <StudentProgressItem key={student.id} student={student} tripId={tripId} onSelect={() => setSelectedStudent(student)} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentProgressItem({ student, tripId, onSelect }: { student: User, tripId: string, onSelect: () => void }) {
  const progress = getStudentTripProgress(student.id, tripId);
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
     <div onClick={onSelect} className="flex items-center gap-4 p-3 -m-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
      <Avatar>
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">{student.name}</p>
        <Progress value={progress} className="mt-1 h-2" />
      </div>
      <span className="font-semibold text-lg">{progress}%</span>
    </div>
  )
}
