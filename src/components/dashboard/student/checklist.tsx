'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Trip, StudentChecklistItemStatus, PackingItem, PackingItemRequirement } from '@/lib/types';
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
import { Rave } from './rave';
import Image from 'next/image';
import { Checkbox as SubCheckbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function Checklist({ tripId }: { tripId: string }) {
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [statuses, setStatuses] = useState<StudentChecklistItemStatus[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRave, setShowRave] = useState(false);
  const [progressSent, setProgressSent] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const foundTrip = allTrips.find(t => t.id === tripId);
    if (foundTrip && user) {
      setTrip(foundTrip);
      const studentData = allStudentProgress.find(p => p.tripId === tripId && p.studentId === user.id);
      
      const initialStatuses = foundTrip.items.map(item => {
        const existingStatus = studentData?.itemStatuses.find(s => s.itemId === item.id);
        if (existingStatus) return existingStatus;
        return {
          itemId: item.id,
          completed: false,
          educatorApproved: null,
          completedRequirements: [],
        };
      });

      setStatuses(initialStatuses);

    } else {
      setTrip(null);
    }
  }, [tripId, user]);
  
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
  
  useEffect(() => {
      if (completionPercentage === 100 && !progressSent) {
          setShowRave(true);
          setTimeout(() => {
            setShowRave(false);
            setProgressSent(true);
          }, 5000);
      }
  }, [completionPercentage, progressSent]);

  const handleRequirementCheckedChange = (itemId: string, requirementId: string, checked: boolean) => {
    setStatuses(prevStatuses => {
      return prevStatuses.map(s => {
        if (s.itemId === itemId) {
          const currentReqs = s.completedRequirements || [];
          const newCompletedReqs = checked
            ? [...currentReqs, requirementId]
            : currentReqs.filter(id => id !== requirementId);
          return { ...s, completedRequirements: newCompletedReqs };
        }
        return s;
      });
    });
  };

  const handleCheckedChange = (itemId: string, checked: boolean) => {
    setStatuses(prevStatuses => {
      return prevStatuses.map(s => s.itemId === itemId ? { ...s, completed: checked } : s);
    });

    if (checked) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  if (!user || !trip) {
    return <p className="uppercase font-body tracking-wider">Loading checklist...</p>;
  }

  return (
    <div className="animate-float-in">
       {showConfetti && !showRave && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} gravity={0.1} colors={['#FBBF24', '#D4AF37', '#C0C0C0']} />}
       {showRave && <Rave />}
       
       <div className="container mx-auto max-w-3xl py-12">
            <header className="mb-12 space-y-3">
                <Button asChild variant="ghost" className="px-0 rounded-full">
                    <Link href="/student/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group w-fit uppercase font-body tracking-wider">
                        <Icons.ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        All Trips
                    </Link>
                </Button>
                <div>
                    <h1 className="font-headline tracking-widest font-light leading-tight text-6xl">{trip.name}</h1>
                    <p className="text-xl text-muted-foreground flex items-center gap-2 mt-3 font-normal uppercase font-body tracking-wider">
                        <Icons.Calendar size={18} />
                        {format(new Date(trip.date), 'MMMM d, yyyy')}
                    </p>
                </div>
            </header>

            <main className="space-y-12">
                <section>
                    <div className="flex justify-between items-end mb-2">
                        <h2 className="text-xs font-medium text-muted-foreground tracking-wider uppercase font-body">Your Progress</h2>
                        <span className="font-semibold text-2xl text-primary uppercase font-body tracking-wider">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-3 rounded-full"/>
                </section>

                {progressSent && (
                    <div className="p-8 bg-secondary/70 rounded-3xl text-center animate-fade-in-up">
                        <h3 className="text-4xl font-headline tracking-widest text-primary">Progress Sent!</h3>
                        <p className="text-muted-foreground mt-2 uppercase font-body tracking-wider">Your educator has been notified. Have a great trip!</p>
                    </div>
                )}

                <section className="space-y-4">
                    <h3 className="text-3xl font-headline tracking-widest font-light">Packing List</h3>
                    {trip.items.map((item, i) => {
                    const status = statuses.find(s => s.itemId === item.id);
                    if (!status) return null;

                    return (
                        <div key={item.id} className="animate-fade-in-up" style={{animationDelay: `${i * 50}ms`, animationFillMode: 'backwards'}}>
                            <PackingItemCard 
                                item={item} 
                                status={status} 
                                onCheckedChange={handleCheckedChange}
                                onRequirementCheckedChange={handleRequirementCheckedChange}
                            />
                        </div>
                    );
                    })}
                </section>
            </main>
        </div>
    </div>
  );
}

interface PackingItemCardProps {
    item: PackingItem;
    status: StudentChecklistItemStatus;
    onCheckedChange: (itemId: string, checked: boolean) => void;
    onRequirementCheckedChange: (itemId: string, requirementId: string, checked: boolean) => void;
}

function PackingItemCard({ item, status, onCheckedChange, onRequirementCheckedChange }: PackingItemCardProps) {
    
    const allRequirementsMet = useMemo(() => {
        if (!item.requirements || item.requirements.length === 0) {
            return true;
        }
        const completedReqs = status.completedRequirements || [];
        return item.requirements.every(req => completedReqs.includes(req.id));
    }, [item.requirements, status.completedRequirements]);

    const hasDetails = item.description || item.imageUrl || item.link || (item.requirements && item.requirements.length > 0);

    return (
        <Card className={cn(
            "transition-all duration-300 rounded-2xl",
            status.completed ? 'bg-secondary/70 border-primary/30' : 'bg-card'
        )}>
            <Collapsible>
                <div className="p-4 flex items-center gap-5">
                    <Checkbox
                        id={`item-${item.id}`}
                        checked={status.completed}
                        onCheckedChange={(checked) => onCheckedChange(item.id, !!checked)}
                        disabled={!allRequirementsMet}
                    />
                    <div className="flex-1 grid gap-1.5">
                        <Label htmlFor={`item-${item.id}`} className={cn("font-medium text-lg cursor-pointer transition-colors uppercase font-body tracking-wider", status.completed && "line-through text-muted-foreground", !allRequirementsMet && "cursor-not-allowed opacity-60")}>
                            {item.name}
                        </Label>
                        {!item.required && <Badge variant="outline" className={cn("w-fit text-xs font-medium rounded-md uppercase font-body tracking-wider", status.completed && "border-muted-foreground/20 text-muted-foreground")}>Optional</Badge>}
                        {status.educatorComment && (
                            <div className="flex items-start gap-2.5 text-sm text-amber-200 bg-amber-500/20 border border-amber-500/30 rounded-xl p-3 mt-2">
                                <Icons.Comment className="h-4 w-4 mt-0.5 shrink-0"/>
                                <span className="leading-snug font-medium uppercase font-body tracking-wider text-xs">{status.educatorComment}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex h-10 items-center ml-4">
                        {hasDetails && (
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                                    <Icons.ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                                </Button>
                            </CollapsibleTrigger>
                        )}
                        <EducatorApprovalStatus status={status.educatorApproved} />
                    </div>
                </div>

                {hasDetails && (
                    <CollapsibleContent>
                        <div className="px-5 pb-5 pt-2 border-t border-border/50">
                            {item.imageUrl && (
                                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-border">
                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.imageHint || ''} />
                                </div>
                            )}
                            {item.description && <p className="text-muted-foreground text-sm mb-4">{item.description}</p>}
                            
                            {item.requirements && item.requirements.length > 0 && (
                                <div className='mb-4'>
                                     <h4 className="font-semibold text-sm mb-2 uppercase tracking-wider">Requirements</h4>
                                     <div className="space-y-2">
                                        {item.requirements.map(req => (
                                            <div key={req.id} className="flex items-center space-x-3 p-2 bg-black/20 rounded-md">
                                                <SubCheckbox 
                                                    id={`req-${item.id}-${req.id}`}
                                                    checked={(status.completedRequirements || []).includes(req.id)}
                                                    onCheckedChange={(checked) => onRequirementCheckedChange(item.id, req.id, !!checked)}
                                                />
                                                <label htmlFor={`req-${item.id}-${req.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    {req.text}
                                                </label>
                                            </div>
                                        ))}
                                     </div>
                                </div>
                            )}

                            {item.link && (
                                <Button asChild variant="outline" size="sm" className="rounded-full">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                                        <Icons.Link className="mr-2 h-4 w-4" />
                                        View Details
                                    </a>
                                </Button>
                            )}
                        </div>
                    </CollapsibleContent>
                )}
            </Collapsible>
        </Card>
    );
}

function Checkbox({ id, checked, onCheckedChange, disabled }: { id: string, checked: boolean, onCheckedChange: (checked: boolean) => void, disabled?: boolean }) {
    const content = (
        <>
            {checked && <Icons.Check className="h-8 w-8 text-primary-foreground animate-check-reveal" strokeWidth={3} />}
            {!checked && !disabled && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild><div className="h-full w-full"/></TooltipTrigger>
                        <TooltipContent className="rounded-lg uppercase font-body tracking-wider">
                            <p>Mark as complete</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
            {!checked && disabled && (
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="h-full w-full flex items-center justify-center">
                                <Icons.Lock className="h-5 w-5 text-muted-foreground/50"/>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-lg uppercase font-body tracking-wider">
                            <p>Complete all sub-requirements first</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </>
    );

    return (
        <button
            id={id}
            role="checkbox"
            aria-checked={checked}
            onClick={() => !disabled && onCheckedChange(!checked)}
            disabled={disabled}
            className={cn("group h-16 w-16 shrink-0 flex items-center justify-center rounded-2xl bg-muted/30 hover:bg-muted/60 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring", disabled && "opacity-50 cursor-not-allowed")}
        >
            <div className={cn("h-9 w-9 rounded-lg border-2 border-foreground/30 flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:scale-110", checked && "bg-primary border-primary rotate-6", disabled && !checked && "border-muted-foreground/20")}>
                {content}
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
                <TooltipContent className="rounded-lg uppercase font-body tracking-wider">
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
