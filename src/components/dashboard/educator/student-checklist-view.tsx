'use client';

import { useState, useEffect } from 'react';
import type { Trip, User, StudentChecklistItemStatus, StudentTripProgress } from '@/lib/types';
import { studentProgress as allStudentProgress } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AIFeedbackDialog } from './ai-feedback-dialog';

export function StudentChecklistView({ trip, student }: { trip: Trip; student: User }) {
  const [progress, setProgress] = useState<StudentTripProgress | undefined>(undefined);
  const [statuses, setStatuses] = useState<StudentChecklistItemStatus[]>([]);

  useEffect(() => {
    const studentData = allStudentProgress.find(p => p.tripId === trip.id && p.studentId === student.id);
    setProgress(studentData);
    if(studentData) {
        setStatuses(studentData.itemStatuses);
    }
  }, [trip.id, student.id]);

  const handleApproval = (itemId: string, approved: boolean | null) => {
     // This would be a server action in a real app
    const newStatuses = statuses.map(s => s.itemId === itemId ? {...s, educatorApproved: approved} : s);
    setStatuses(newStatuses);
  }
  
  const handleCommentChange = (itemId: string, comment: string) => {
    const newStatuses = statuses.map(s => s.itemId === itemId ? {...s, educatorComment: comment} : s);
    setStatuses(newStatuses);
  }

  return (
    <div className="space-y-4">
        <h3 className="text-2xl font-bold tracking-tight font-headline">
            Checklist for <span className="text-primary">{student.name}</span>
        </h3>
        {trip.items.map(item => {
            const status = statuses.find(s => s.itemId === item.id);
            if (!status) return null;

            const isConflicting = (status.completed && status.educatorApproved === false) || (!status.completed && status.educatorApproved === true);

            return (
                <Card key={item.id} className={cn(isConflicting && "border-destructive/50")}>
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex-1 flex items-center gap-4">
                            {status.completed ? <Icons.CheckCircle className="text-green-600 h-6 w-6 shrink-0" /> : <Icons.Circle className="text-muted-foreground h-6 w-6 shrink-0" />}
                            <div>
                                <p className="font-medium">{item.name}</p>
                                {!item.required && <Badge variant="secondary" className="mt-1">Optional</Badge>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                           {isConflicting && (
                             <AIFeedbackDialog item={item} student={student} status={status}>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                    <Icons.AlertTriangle className="h-5 w-5" />
                                </Button>
                             </AIFeedbackDialog>
                           )}

                           <Button 
                                variant={status.educatorApproved === true ? "secondary" : "ghost"} 
                                size="icon" 
                                className={cn("text-green-600 hover:text-green-700", status.educatorApproved === true && "bg-green-100")}
                                onClick={() => handleApproval(item.id, status.educatorApproved === true ? null : true)}
                            >
                                <Icons.ThumbsUp className="h-5 w-5" />
                           </Button>
                           <Button 
                                variant={status.educatorApproved === false ? "secondary" : "ghost"} 
                                size="icon" 
                                className={cn("text-red-600 hover:text-red-700", status.educatorApproved === false && "bg-red-100")}
                                onClick={() => handleApproval(item.id, status.educatorApproved === false ? null : false)}
                           >
                                <Icons.ThumbsDown className="h-5 w-5" />
                           </Button>
                        </div>
                    </CardContent>
                    {status.educatorApproved === false && (
                        <div className="p-4 pt-0">
                            <Textarea 
                                placeholder="Add a comment for the student..." 
                                value={status.educatorComment}
                                onChange={(e) => handleCommentChange(item.id, e.target.value)}
                            />
                        </div>
                    )}
                </Card>
            );
        })}
    </div>
  );
}
