'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Trip, StudentChecklistItemStatus } from '@/lib/types';
import { trips as allTrips, studentProgress as allStudentProgress } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { notFound, useRouter } from 'next/navigation';
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
       {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={600} gravity={0.1} />}
       <div>
            <Link href="/student/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-2">
                <Icons.ArrowLeft size={16} />
                Back to all expeditions
            </Link>
            <h2 className="text-5xl font-bold tracking-tighter font-headline">{trip.name}</h2>
            <p className="text-xl text-muted-foreground flex items-center gap-2 mt-1">
                <Icons.Calendar size={20} />
                {new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>

      <div className="space-y-4">
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-base font-medium text-muted-foreground">Required Items Progress</span>
                <span className="text-2xl font-bold text-accent">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">Only required items count towards progress.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-3xl font-semibold font-headline tracking-tight">Your Packing List</h3>
        {trip.items.map((item, i) => {
          const status = statuses.find(s => s.itemId === item.id);
          if (!status) return null;

          return (
            <div key={item.id} className="animate-fade-in-up-strong" style={{animationDelay: `${i * 50}ms`, animationFillMode: 'backwards'}}>
                <Card className={cn(
                    "transition-all duration-300",
                    status.completed ? 'bg-secondary/50 border-accent/30' : 'bg-card'
                )}>
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex h-10 items-center">
                        <Checkbox
                            id={`item-${item.id}`}
                            checked={status.completed}
                            onCheckedChange={(checked) => handleCheckedChange(item.id, !!checked)}
                            className="h-8 w-8"
                        />
                    </div>
                    <div className="flex-1 grid gap-1">
                        <Label htmlFor={`item-${item.id}`} className={cn("font-bold text-xl cursor-pointer transition-colors", status.completed && "line-through text-muted-foreground")}>
                            {item.name}
                        </Label>
                        {!item.required && <Badge variant="outline" className={cn(status.completed && "border-muted-foreground/50 text-muted-foreground")}>Optional</Badge>}
                        {status.educatorComment && (
                            <div className="flex items-start gap-2 text-sm text-amber-400 bg-amber-900/40 border border-amber-500/30 rounded-md p-3 mt-2">
                                <Icons.Comment className="h-4 w-4 mt-0.5 shrink-0"/>
                                <span>{status.educatorComment}</span>
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
      </div>
    </div>
  );
}

function EducatorApprovalStatus({ status }: { status: boolean | null }) {
    const statusConfig = {
        approved: { icon: Icons.ThumbsUp, color: 'text-green-500', tooltip: 'Approved by educator' },
        rejected: { icon: Icons.ThumbsDown, color: 'text-red-500', tooltip: 'Changes requested by educator' },
        pending: { icon: Icons.Circle, color: 'text-muted-foreground/50', tooltip: 'Pending educator review' },
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
                    <Icon className={`h-8 w-8 ${color}`} />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
