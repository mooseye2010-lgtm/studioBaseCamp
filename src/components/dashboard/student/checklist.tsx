'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Trip, StudentTripProgress, StudentChecklistItemStatus } from '@/lib/types';
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

export function Checklist({ tripId }: { tripId: string }) {
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [progress, setProgress] = useState<StudentTripProgress | undefined>(undefined);
  const [statuses, setStatuses] = useState<StudentChecklistItemStatus[]>([]);

  useEffect(() => {
    const foundTrip = allTrips.find(t => t.id === tripId);
    if (foundTrip && user) {
      setTrip(foundTrip);
      const studentData = allStudentProgress.find(p => p.tripId === tripId && p.studentId === user.id);
      setProgress(studentData);
      setStatuses(studentData ? studentData.itemStatuses : []);
    } else {
      setTrip(null);
    }
  }, [tripId, user]);

  const handleCheckedChange = (itemId: string, checked: boolean) => {
    // In a real app, this would be a server action to update the database
    const newStatuses = statuses.map(s => s.itemId === itemId ? { ...s, completed: checked } : s);
    setStatuses(newStatuses);
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
    return <p>Loading checklist...</p>; // Or a skeleton loader
  }

  return (
    <div className="space-y-6">
       <div>
        <Link href="/student/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Icons.ArrowLeft size={16} />
            Back to all trips
        </Link>
        <h2 className="text-3xl font-bold tracking-tight font-headline mt-2">{trip.name}</h2>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Icons.Calendar size={16} />
            {new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
            <span>Overall Progress</span>
            <span>{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} />
        <p className="text-xs text-muted-foreground">Only required items count towards progress.</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold font-headline">Items to Pack</h3>
        {trip.items.map(item => {
          const status = statuses.find(s => s.itemId === item.id);
          if (!status) return null;

          return (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex h-10 items-center">
                    <Checkbox
                        id={`item-${item.id}`}
                        checked={status.completed}
                        onCheckedChange={(checked) => handleCheckedChange(item.id, !!checked)}
                        className="h-6 w-6"
                    />
                </div>
                <div className="flex-1 grid gap-1.5">
                    <Label htmlFor={`item-${item.id}`} className="font-bold text-base cursor-pointer">
                        {item.name}
                    </Label>
                    {!item.required && <Badge variant="secondary">Optional</Badge>}
                    {status.educatorComment && (
                        <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
                            <Icons.Comment className="h-4 w-4 mt-0.5 shrink-0"/>
                            <span>{status.educatorComment}</span>
                        </div>
                    )}
                </div>
                 <div className="flex h-10 items-center">
                    <EducatorApprovalStatus status={status.educatorApproved} />
                 </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function EducatorApprovalStatus({ status }: { status: boolean | null }) {
    const statusConfig = {
        approved: { icon: Icons.ThumbsUp, color: 'text-green-600', tooltip: 'Approved by educator' },
        rejected: { icon: Icons.ThumbsDown, color: 'text-red-600', tooltip: 'Changes requested by educator' },
        pending: { icon: Icons.Circle, color: 'text-muted-foreground', tooltip: 'Pending educator review' },
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
                    <Icon className={`h-6 w-6 ${color}`} />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
