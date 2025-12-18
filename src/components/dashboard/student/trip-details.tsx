'use client';

import { useState, useEffect } from 'react';
import { trips, users } from '@/lib/data';
import type { Trip, User } from '@/lib/types';
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
      if (assignedStudents.length > 0) {
        setSelectedStudent(assignedStudents[0]);
      }
    } else {
        setTrip(null);
    }
  }, [tripId]);

  if (trip === null) {
    return <p className="uppercase font-body tracking-wider">Loading trip details...</p>;
  }

  return (
    <div className="animate-float-in container mx-auto max-w-6xl py-12">
        <div className="mb-8">
            <Button asChild variant="ghost" className="px-0 rounded-full group">
                <Link href="/educator/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 uppercase font-body tracking-wider">
                    <Icons.ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    All Trips
                </Link>
            </Button>
            <h2 className="text-4xl leading-tight font-headline mt-2 tracking-widest font-light">{trip.name}</h2>
            <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1 uppercase font-body tracking-wider">
                <Icons.Calendar size={18} />
                {new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-1 space-y-3">
                 <h3 className="text-xl font-semibold px-2 uppercase font-body tracking-wider">Student Progress</h3>
                 {students.map((student, i) => (
                    <div key={student.id} style={{animationDelay: `${i * 70}ms`, animationFillMode: 'backwards'}} className="animate-fade-in-up">
                        <StudentProgressItem student={student} tripId={tripId} onSelect={() => setSelectedStudent(student)} isActive={selectedStudent?.id === student.id} />
                    </div>
                ))}
            </div>

            <div className="lg:col-span-2">
                {selectedStudent && (
                     <StudentChecklistView 
                        trip={trip}
                        student={selectedStudent} 
                    />
                )}
            </div>
        </div>
    </div>
  );
}

function StudentProgressItem({ student, tripId, onSelect, isActive }: { student: User, tripId: string, onSelect: () => void, isActive: boolean }) {
  const progress = getStudentTripProgress(student.id, tripId);
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
     <div onClick={onSelect} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 group ${isActive ? 'bg-secondary' : 'hover:bg-secondary/50'}`}>
      <Avatar className="h-12 w-12 text-base border-2 border-muted">
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium text-base uppercase font-body tracking-wider">{student.name}</p>
        <div className="flex items-center gap-3 mt-1">
             <Progress value={progress} className="h-2 rounded-full flex-1" />
             <span className="font-semibold text-sm text-accent w-14 text-right uppercase font-body tracking-wider">{progress}%</span>
        </div>
      </div>
       <Icons.ChevronRight className={`h-6 w-6 text-muted-foreground transition-transform ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
    </div>
  )
}
