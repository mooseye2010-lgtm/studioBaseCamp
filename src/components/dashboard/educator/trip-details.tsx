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
    return <p>Loading trip details...</p>;
  }

  return (
    <div className="animate-fade-in-up-strong">
      {selectedStudent ? (
        <div>
            <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="mb-6 text-base">
                <Icons.ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Students
            </Button>
            <StudentChecklistView 
                trip={trip}
                student={selectedStudent} 
            />
        </div>
      ) : (
        <div className="space-y-8">
            <div>
                <Link href="/educator/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-2">
                    <Icons.ArrowLeft size={16} />
                    Back to all expeditions
                </Link>
                <h2 className="text-5xl font-bold tracking-tighter font-headline">{trip.name}</h2>
                <p className="text-xl text-muted-foreground flex items-center gap-2 mt-1">
                    <Icons.Calendar size={20} />
                    {new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <Card className="border-border/30">
                <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight">Student Progress</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-2">
                    {students.map((student, i) => (
                    <div key={student.id} style={{animationDelay: `${i * 50}ms`, animationFillMode: 'backwards'}} className="animate-fade-in-up-strong">
                        <StudentProgressItem student={student} tripId={tripId} onSelect={() => setSelectedStudent(student)} />
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}

function StudentProgressItem({ student, tripId, onSelect }: { student: User, tripId: string, onSelect: () => void }) {
  const progress = getStudentTripProgress(student.id, tripId);
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
     <div onClick={onSelect} className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary cursor-pointer transition-colors duration-200">
      <Avatar className="h-12 w-12 text-lg">
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium text-lg">{student.name}</p>
        <div className="flex items-center gap-3 mt-1">
             <Progress value={progress} className="h-2.5 flex-1" />
             <span className="font-bold text-lg text-accent w-12 text-right">{progress}%</span>
        </div>
      </div>
       <Icons.ChevronRight className="h-6 w-6 text-muted-foreground" />
    </div>
  )
}
