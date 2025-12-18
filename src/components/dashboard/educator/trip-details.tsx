'use client';

import { useState, useEffect } from 'react';
import { trips, users } from '@/lib/data';
import type { Trip, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { getStudentTripProgress } from '@/lib/utils';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { StudentChecklistView } from './student-checklist-view';
import Image from 'next/image';

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
    <div className="animate-fade-in-up container mx-auto max-w-6xl py-12">
      {selectedStudent ? (
        <div>
            <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="mb-8 text-base group flex items-center px-0 rounded-full">
                <Icons.ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Student Overview
            </Button>
            <StudentChecklistView 
                trip={trip}
                student={selectedStudent} 
            />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="space-y-6 lg:col-span-1">
                <Button asChild variant="ghost" className="px-0 rounded-full">
                    <Link href="/educator/dashboard" className="text-base text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                        <Icons.ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        All Trips
                    </Link>
                </Button>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
                    <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" />
                </div>
                <h2 className="text-4xl font-bold leading-tight font-headline">{trip.name}</h2>
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                    <Icons.Calendar size={18} />
                    {new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="lg:col-span-2">
                <Card className="rounded-3xl bg-card/60">
                    <CardHeader>
                    <CardTitle className="text-2xl font-medium">Student Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {students.map((student, i) => (
                            <div key={student.id} style={{animationDelay: `${i * 70}ms`, animationFillMode: 'backwards'}} className="animate-fade-in-up">
                                <StudentProgressItem student={student} tripId={tripId} onSelect={() => setSelectedStudent(student)} />
                            </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}

function StudentProgressItem({ student, tripId, onSelect }: { student: User, tripId: string, onSelect: () => void }) {
  const progress = getStudentTripProgress(student.id, tripId);
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
     <div onClick={onSelect} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary cursor-pointer transition-all duration-200 group">
      <Avatar className="h-12 w-12 text-base border-2">
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium text-lg">{student.name}</p>
        <div className="flex items-center gap-3 mt-1">
             <Progress value={progress} className="h-2.5 rounded-full flex-1" />
             <span className="font-semibold text-md text-accent w-14 text-right">{progress}%</span>
        </div>
      </div>
       <Icons.ChevronRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </div>
  )
}
