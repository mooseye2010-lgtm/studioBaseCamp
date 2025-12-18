'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Trip, StudentChecklistItemStatus } from '@/lib/types';
import { trips as allTrips, studentProgress as allStudentProgress } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
    <div className="space-y-8 animate-fade-in-up-strong">
       {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={800} gravity={0.15} wind={0.02} />}
       
       <div className="space-y-6">
            <Link href="/student/dashboard" className="text-base text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                <Icons.ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to all expeditions
            </Link>
             <div className="relative aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-border/10">
                <Image src={trip.imageUrl} alt={trip.name} fill className="object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                 <div className="absolute bottom-0 left-0 p-8 md:p-10">
                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter font-headline leading-tight text-white drop-shadow-lg">{trip.name}</h2>
                    <p className="text-xl md:text-2xl text-white/80 flex items-center gap-3 mt-2 font-medium">
                        <Icons.Calendar size={24} />
                        {new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                 </div>
            </div>
        </div>

      <div className="space-y-4">
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-muted-foreground tracking-tight">Required Items Progress</span>
                <span className="text-4xl font-bold text-accent tracking-tighter">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-4" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-4xl font-bold font-headline tracking-tighter">Your Packing List</h3>
        {trip.items.map((item, i) => {
          const status = statuses.find(s => s.itemId === item.id);
          if (!status) return null;

          return (
            <div key={item.id} className="animate-fade-in-up-strong" style={{animationDelay: `${i * 70}ms`, animationFillMode: 'backwards'}}>
                <Card className={cn(
                    "transition-all duration-300 rounded-2xl",
                    status.completed ? 'bg-secondary/50 border-accent/20' : 'bg-card/50'
                )}>
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex h-12 items-center">
                        <Checkbox
                            id={`item-${item.id}`}
                            checked={status.completed}
                            onCheckedChange={(checked) => handleCheckedChange(item.id, !!checked)}
                            className="h-10 w-10 border-2"
                        />
                    </div>
                    <div className="flex-1 grid gap-1.5">
                        <Label htmlFor={`item-${item.id}`} className={cn("font-bold text-2xl tracking-tight cursor-pointer transition-colors", status.completed && "line-through text-muted-foreground")}>
                            {item.name}
                        </Label>
                        {!item.required && <Badge variant="outline" className={cn("w-fit text-sm", status.completed && "border-muted-foreground/50 text-muted-foreground")}>Optional</Badge>}
                        {status.educatorComment && (
                            <div className="flex items-start gap-3 text-base text-amber-300 bg-amber-900/50 border border-amber-500/30 rounded-xl p-3 mt-2">
                                <Icons.Comment className="h-5 w-5 mt-0.5 shrink-0"/>
                                <span className="leading-snug">{status.educatorComment}</span>
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
      </div>
    </div>
  );
}

function EducatorApprovalStatus({ status }: { status: boolean | null }) {
    const statusConfig = {
        approved: { icon: Icons.ThumbsUp, color: 'text-green-400', tooltip: 'Approved by educator' },
        rejected: { icon: Icons.ThumbsDown, color: 'text-red-400', tooltip: 'Changes requested by educator' },
        pending: { icon: Icons.Circle, color: 'text-muted-foreground/40', tooltip: 'Pending educator review' },
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
