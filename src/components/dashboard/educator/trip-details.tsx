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
import { ScrollArea } from '@/components/ui/scroll-area';

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
            <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="mb-8 text-lg font-bold group flex items-center">
                <Icons.ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Back to All Students
            </Button>
            <StudentChecklistView 
                trip={trip}
                student={selectedStudent} 
            />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="space-y-6 lg:sticky lg:top-28">
                <Link href="/educator/dashboard" className="text-base text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                    <Icons.ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to all expeditions
                </Link>
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-border/10">
                    <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" />
                </div>
                <h2 className="text-7xl font-bold tracking-tighter font-headline leading-tight">{trip.name}</h2>
                <p className="text-2xl text-muted-foreground flex items-center gap-3">
                    <Icons.Calendar size={28} />
                    {new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <Card className="border-border/20 bg-card/30 backdrop-blur-sm rounded-3xl">
                <CardHeader>
                <CardTitle className="text-4xl font-bold tracking-tight font-headline">Student Progress</CardTitle>
                </CardHeader>
                <CardContent>
                <ScrollArea className="h-[calc(100vh-20rem)]">
                    <div className="space-y-1 pr-4">
                        {students.map((student, i) => (
                        <div key={student.id} style={{animationDelay: `${i * 70}ms`, animationFillMode: 'backwards'}} className="animate-fade-in-up-strong">
                            <StudentProgressItem student={student} tripId={tripId} onSelect={() => setSelectedStudent(student)} />
                        </div>
                        ))}
                    </div>
                </ScrollArea>
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
     <div onClick={onSelect} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary/50 cursor-pointer transition-all duration-300 group">
      <Avatar className="h-14 w-14 text-xl border-2 border-border/30">
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-bold text-xl tracking-tight">{student.name}</p>
        <div className="flex items-center gap-4 mt-1">
             <Progress value={progress} className="h-3 flex-1" />
             <span className="font-bold text-2xl text-accent w-16 text-right">{progress}%</span>
        </div>
      </div>
       <Icons.ChevronRight className="h-8 w-8 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </div>
  )
}
