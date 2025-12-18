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
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

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
    <div className="animate-fade-in-up">
       {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} gravity={0.15} />}
       
       <div className="container mx-auto max-w-3xl py-12">
            <header className="mb-12 space-y-3">
                <Button asChild variant="ghost" className="px-0 rounded-full">
                    <Link href="/student/dashboard" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group w-fit">
                        <Icons.ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        All Trips
                    </Link>
                </Button>
                <div>
                    <h1 className="font-headline font-bold text-6xl tracking-tighter leading-tight">{trip.name}</h1>
                    <p className="text-xl text-muted-foreground flex items-center gap-2 mt-3 font-normal">
                        <Icons.Calendar size={18} />
                        {format(new Date(trip.date), 'MMMM d, yyyy')}
                    </p>
                </div>
            </header>

            <main className="space-y-12">
                <section>
                    <div className="flex justify-between items-end mb-2">
                        <h2 className="text-base font-medium text-muted-foreground tracking-wider uppercase">Your Progress</h2>
                        <span className="font-semibold text-2xl text-primary">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-3 rounded-full"/>
                </section>

                <section className="space-y-4">
                    <h3 className="text-3xl font-bold font-headline tracking-tight">Packing List</h3>
                    {trip.items.map((item, i) => {
                    const status = statuses.find(s => s.itemId === item.id);
                    if (!status) return null;

                    return (
                        <div key={item.id} className="animate-fade-in-up" style={{animationDelay: `${i * 50}ms`, animationFillMode: 'backwards'}}>
                            <Card className={cn(
                                "transition-all duration-300 rounded-2xl",
                                status.completed ? 'bg-secondary/70 border-primary/30' : 'bg-card'
                            )}>
                            <CardContent className="p-4 flex items-center gap-5">
                                <Checkbox
                                    id={`item-${item.id}`}
                                    checked={status.completed}
                                    onCheckedChange={(checked) => handleCheckedChange(item.id, !!checked)}
                                />
                                <div className="flex-1 grid gap-1.5">
                                    <Label htmlFor={`item-${item.id}`} className={cn("font-medium text-xl cursor-pointer transition-colors", status.completed && "line-through text-muted-foreground")}>
                                        {item.name}
                                    </Label>
                                    {!item.required && <Badge variant="outline" className={cn("w-fit text-xs font-medium rounded-md", status.completed && "border-muted-foreground/20 text-muted-foreground")}>Optional</Badge>}
                                    {status.educatorComment && (
                                        <div className="flex items-start gap-2.5 text-sm text-amber-200 bg-amber-500/20 border border-amber-500/30 rounded-xl p-3 mt-2">
                                            <Icons.Comment className="h-4 w-4 mt-0.5 shrink-0"/>
                                            <span className="leading-snug font-medium">{status.educatorComment}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex h-10 items-center ml-4">
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
            className="group h-16 w-16 shrink-0 flex items-center justify-center rounded-2xl bg-muted/60 hover:bg-muted transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring"
        >
            <div className={cn("h-9 w-9 rounded-lg border-2 border-foreground/30 flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:scale-110", checked && "bg-primary border-primary rotate-6")}>
                {checked && <Icons.Check className="h-8 w-8 text-primary-foreground animate-check-in" strokeWidth={3.5} />}
            </div>
        </button>
    )
}

function EducatorApprovalStatus({ status }: { status: boolean | null }) {
    const statusConfig = {
        approved: { icon: Icons.ThumbsUp, color: 'text-green-400', tooltip: 'Approved by educator' },
        rejected: { icon: Icons.ThumbsDown, color: 'text-red-400', tooltip: 'Changes requested' },
        pending: { icon: Icons.Circle, color: 'text-muted-foreground/30', tooltip: 'Pending review' },
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
                    <Icon className={`h-8 w-8 ${color} transition-transform duration-300 ease-in-out hover:scale-110`} />
                </TooltipTrigger>
                <TooltipContent className="rounded-lg">
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
