'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Trip, StudentChecklistItemStatus } from '@/lib/types';
import { trips as allTrips, studentProgress as allStudentProgress } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { format } from 'date-fns';

export function Checklist({ tripId }: { tripId: string }) {
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [statuses, setStatuses] = useState<StudentChecklistItemStatus[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const foundTrip = allTrips.find(t => t.id === tripId);
    if (foundTrip && user) {
      setTrip(foundTrip);
      const studentData = allStudentProgress.find(p => p.tripId === tripId && p.studentId === user.id);
      setStatuses(studentData ? studentData.itemStatuses : []);
    } else {
      setTrip(null);
    }
  }, [tripId, user]);

  const handleCheckedChange = (itemId: string, checked: boolean) => {
    const newStatuses = statuses.map(s => s.itemId === itemId ? { ...s, completed: checked } : s);
    setStatuses(newStatuses);

    if (checked) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const completionPercentage = useMemo(() => {
    if (!trip) return 0;
    const requiredItems = trip.items.filter(item => item.required);
    if(requiredItems.length === 0) return 100;
    const completedRequiredItems = statuses.filter(s => {
        const item = requiredItems.find(i => i.id === s.itemId);
        return item && s.completed;
    }).length;
    return Math.round((completedRequiredItems / requiredItems.length) * 100);
  }, [statuses, trip]);

  if (!user || !trip) {
    return <p>Loading checklist...</p>;
  }

  return (
    <div className="animate-fade-in-up-strong">
       {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.12} />}
       
       <div className="container mx-auto max-w-4xl py-8 md:py-12">
            <header className="mb-10 md:mb-16 space-y-4 text-center">
                <Link href="/student/dashboard" className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 group w-fit mx-auto">
                    <Icons.ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    All Expeditions
                </Link>
                <div>
                    <h1 className="font-headline text-6xl md:text-7xl font-black tracking-tighter leading-none">{trip.name}</h1>
                    <p className="text-xl md:text-2xl text-muted-foreground flex items-center justify-center gap-3 mt-4 font-medium">
                        <Icons.Calendar size={22} />
                        {format(new Date(trip.date), 'MMMM d, yyyy')}
                    </p>
                </div>
            </header>

            <main className="space-y-12">
                <section className='text-center'>
                    <div className="flex justify-between items-end mb-3 max-w-sm mx-auto">
                        <h2 className="text-lg font-bold text-muted-foreground tracking-widest uppercase">Required Items</h2>
                        <span className="font-headline font-bold text-5xl text-primary tracking-tighter">{completionPercentage}%</span>
                    </div>
                    <div className="h-5 bg-muted rounded-full overflow-hidden max-w-sm mx-auto">
                        <div 
                            className="h-full bg-gradient-to-r from-primary to-green-400 transition-all duration-700 ease-out" 
                            style={{width: `${completionPercentage}%`}}
                        />
                    </div>
                </section>

                <section className="space-y-4 md:space-y-5">
                    <h3 className="text-3xl font-bold font-headline tracking-tighter text-center">Your Packing List</h3>
                    {trip.items.map((item, i) => {
                    const status = statuses.find(s => s.itemId === item.id);
                    if (!status) return null;

                    return (
                        <div key={item.id} className="animate-fade-in-up-strong" style={{animationDelay: `${i * 50}ms`, animationFillMode: 'backwards'}}>
                            <Card className={cn(
                                "transition-all duration-300 rounded-2xl",
                                status.completed ? 'bg-secondary/70 border-primary/20' : 'bg-card'
                            )}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <Checkbox
                                    id={`item-${item.id}`}
                                    checked={status.completed}
                                    onCheckedChange={(checked) => handleCheckedChange(item.id, !!checked)}
                                />
                                <div className="flex-1 grid gap-1.5">
                                    <Label htmlFor={`item-${item.id}`} className={cn("font-headline font-bold text-2xl tracking-tight cursor-pointer transition-colors", status.completed && "line-through text-muted-foreground")}>
                                        {item.name}
                                    </Label>
                                    {!item.required && <Badge variant="outline" className={cn("w-fit text-sm font-semibold border-muted-foreground/30", status.completed && "border-muted-foreground/20 text-muted-foreground")}>Optional</Badge>}
                                    {status.educatorComment && (
                                        <div className="flex items-start gap-3 text-base text-accent bg-accent/10 border border-accent/20 rounded-xl p-3 mt-2">
                                            <Icons.Comment className="h-5 w-5 mt-0.5 shrink-0"/>
                                            <span className="leading-snug font-medium">{status.educatorComment}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex h-12 items-center ml-4">
                                    <EducatorApprovalStatus status={status.educatorApproved} />
                                </div>
                            </CardContent>
                            </Card>
                        </div>
                    );
                    })}
                </section>
            </main>
        </div>
    </div>
  );
}

function Checkbox({ id, checked, onCheckedChange }: { id: string, checked: boolean, onCheckedChange: (checked: boolean) => void }) {
    return (
        <button
            id={id}
            role="checkbox"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className="group h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-muted/60 hover:bg-muted transition-all duration-200"
        >
            <div className={cn("h-7 w-7 rounded-lg border-4 border-foreground/30 flex items-center justify-center transition-all duration-200 group-hover:border-primary", checked && "bg-primary border-primary")}>
                {checked && <Icons.Check className="h-6 w-6 text-primary-foreground animate-check-in" strokeWidth={4} />}
            </div>
        </button>
    )
}

function EducatorApprovalStatus({ status }: { status: boolean | null }) {
    const statusConfig = {
        approved: { icon: Icons.ThumbsUp, color: 'text-green-500', tooltip: 'Approved by educator' },
        rejected: { icon: Icons.ThumbsDown, color: 'text-red-500', tooltip: 'Changes requested by educator' },
        pending: { icon: Icons.Circle, color: 'text-muted-foreground/30', tooltip: 'Pending educator review' },
    };

    let currentStatus: 'approved' | 'rejected' | 'pending';
    if(status === true) currentStatus = 'approved';
    else if (status === false) currentStatus = 'rejected';
    else currentStatus = 'pending';

    const { icon: Icon, color, tooltip } = statusConfig[currentStatus];

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Icon className={`h-10 w-10 ${color}`} />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
