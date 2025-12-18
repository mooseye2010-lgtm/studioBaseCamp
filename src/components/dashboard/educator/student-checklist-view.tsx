'use client';

import { useState, useEffect } from 'react';
import type { Trip, User, StudentChecklistItemStatus, StudentTripProgress } from '@/lib/types';
import { studentProgress as allStudentProgress } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AIFeedbackDialog } from './ai-feedback-dialog';

export function StudentChecklistView({ trip, student }: { trip: Trip; student: User }) {
  const [statuses, setStatuses] = useState<StudentChecklistItemStatus[]>([]);

  useEffect(() => {
    const studentData = allStudentProgress.find(p => p.tripId === trip.id && p.studentId === student.id);
    if(studentData) {
        setStatuses(studentData.itemStatuses);
    }
  }, [trip.id, student.id]);

  const handleApproval = (itemId: string, approved: boolean | null) => {
    const newStatuses = statuses.map(s => s.itemId === itemId ? {...s, educatorApproved: approved} : s);
    setStatuses(newStatuses);
  }
  
  const handleCommentChange = (itemId: string, comment: string) => {
    const newStatuses = statuses.map(s => s.itemId === itemId ? {...s, educatorComment: comment} : s);
    setStatuses(newStatuses);
  }

  return (
    <div className="space-y-6">
        <h3 className="text-4xl font-bold tracking-tight font-headline">
            Checklist for <span className="text-primary">{student.name}</span>
        </h3>
        {trip.items.map((item, i) => {
            const status = statuses.find(s => s.itemId === item.id);
            if (!status) return null;

            const isConflicting = (status.completed && status.educatorApproved === false) || (!status.completed && status.educatorApproved === true);

            return (
                <div key={item.id} className="animate-fade-in-up-strong" style={{animationDelay: `${i * 50}ms`, animationFillMode: 'backwards'}}>
                    <Card className={cn("transition-all duration-300", isConflicting && "border-destructive/80 ring-2 ring-destructive/50")}>
                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:gap-6">
                            <div className="flex-1 flex items-center gap-4">
                                {status.completed ? <Icons.CheckCircle className="text-accent h-8 w-8 shrink-0" /> : <Icons.Circle className="text-muted-foreground/50 h-8 w-8 shrink-0" />}
                                <div>
                                    <p className="font-medium text-lg">{item.name}</p>
                                    {!item.required && <Badge variant="secondary" className="mt-1">Optional</Badge>}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-4 sm:mt-0">
                               {isConflicting && (
                                 <AIFeedbackDialog item={item} student={student} status={status}>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 rounded-full h-12 w-12">
                                        <Icons.AlertTriangle className="h-6 w-6" />
                                    </Button>
                                 </AIFeedbackDialog>
                               )}

                               <Button 
                                    variant={status.educatorApproved === true ? "secondary" : "ghost"} 
                                    size="icon" 
                                    className={cn("rounded-full h-12 w-12 text-green-500 hover:text-green-400", status.educatorApproved === true && "bg-green-500/20 text-green-400")}
                                    onClick={() => handleApproval(item.id, status.educatorApproved === true ? null : true)}
                                >
                                    <Icons.ThumbsUp className="h-6 w-6" />
                               </Button>
                               <Button 
                                    variant={status.educatorApproved === false ? "secondary" : "ghost"} 
                                    size="icon" 
                                    className={cn("rounded-full h-12 w-12 text-red-500 hover:text-red-400", status.educatorApproved === false && "bg-red-500/20 text-red-400")}
                                    onClick={() => handleApproval(item.id, status.educatorApproved === false ? null : false)}
                               >
                                    <Icons.ThumbsDown className="h-6 w-6" />
                               </Button>
                            </div>
                        </CardContent>
                        {status.educatorApproved === false && (
                            <div className="px-5 pb-4">
                                <Textarea 
                                    placeholder={`Add a comment for ${student.name}...`} 
                                    value={status.educatorComment}
                                    onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                    className="text-base"
                                />
                            </div>
                        )}
                    </Card>
                </div>
            );
        })}
    </div>
  );
}
