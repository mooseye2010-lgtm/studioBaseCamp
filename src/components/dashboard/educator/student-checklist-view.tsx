
'use client';

import { useState, useEffect } from 'react';
import type { Trip, User, StudentChecklistItemStatus, PackingItem } from '@/lib/types';
import { studentProgress as allStudentProgress } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AIFeedbackDialog } from './ai-feedback-dialog';
import { Progress } from '@/components/ui/progress';
import { getStudentTripProgress } from '@/lib/utils';

export function StudentChecklistView({ trip, student }: { trip: Trip; student: User }) {
  const [statuses, setStatuses] = useState<StudentChecklistItemStatus[]>([]);

  useEffect(() => {
    // Find the progress data for the current student and trip.
    const studentData = allStudentProgress.find(p => p.tripId === trip.id && p.studentId === student.id);
    if (studentData) {
      setStatuses(studentData.itemStatuses);
    }
  }, [trip.id, student.id]);

  /**
   * Updates the approval status for a specific checklist item.
   * A null value means the educator has not reviewed it.
   */
  const handleApproval = (itemId: string, approved: boolean | null) => {
    const newStatuses = statuses.map(s =>
      s.itemId === itemId ? { ...s, educatorApproved: approved } : s
    );
    // In a real app, this change would be saved to a database.
    setStatuses(newStatuses);
  }

  /**
   * Updates the educator's comment for a specific checklist item.
   */
  const handleCommentChange = (itemId: string, comment: string) => {
    const newStatuses = statuses.map(s =>
      s.itemId === itemId ? { ...s, educatorComment: comment } : s
    );
    // In a real app, this change would be saved to a database.
    setStatuses(newStatuses);
  }

  const progress = getStudentTripProgress(student.id, trip.id);

  return (
    <div className="space-y-8">
      <StudentHeader name={student.name} progress={progress} />
      {trip.items.map((item, i) => {
        const status = statuses.find(s => s.itemId === item.id);
        if (!status) return null;

        const isConflicting = (status.completed && status.educatorApproved === false) || (!status.completed && status.educatorApproved === true);

        return (
          <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}>
            <ChecklistItemCard
              item={item}
              student={student}
              status={status}
              isConflicting={isConflicting}
              onApproval={handleApproval}
              onCommentChange={handleCommentChange}
            />
          </div>
        );
      })}
    </div>
  );
}

function StudentHeader({ name, progress }: { name: string; progress: number }) {
  return (
    <div className="space-y-2">
      <h3 className="text-4xl font-light">
        Checklist for <span className="font-medium text-primary">{name}</span>
      </h3>
      <div className="flex items-center gap-4 pt-2">
        <Progress value={progress} className="h-3 rounded-full flex-1" />
        <span className="font-semibold text-xl text-accent">{progress}%</span>
      </div>
    </div>
  );
}

interface ChecklistItemCardProps {
  item: PackingItem;
  student: User;
  status: StudentChecklistItemStatus;
  isConflicting: boolean;
  onApproval: (itemId: string, approved: boolean | null) => void;
  onCommentChange: (itemId: string, comment: string) => void;
}

function ChecklistItemCard({
  item,
  student,
  status,
  isConflicting,
  onApproval,
  onCommentChange
}: ChecklistItemCardProps) {
  const showCommentBox = status.educatorApproved === false;

  return (
    <Card className={cn(
      "transition-all duration-300 rounded-2xl",
      isConflicting && "border-destructive/50 ring-4 ring-destructive/20",
      status.completed ? "bg-secondary/70" : "bg-card",
    )}>
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <div className="flex-1 flex items-center gap-4">
          {status.completed
            ? <Icons.CheckCircle className="text-accent h-8 w-8 shrink-0" />
            : <Icons.Circle className="text-muted-foreground/30 h-8 w-8 shrink-0" />}
          <div>
            <p className="font-medium text-lg">{item.name}</p>
            {!item.required && <Badge variant="secondary" className="mt-1 text-xs rounded-md">Optional</Badge>}
          </div>
        </div>
        <ApprovalActions
          item={item}
          student={student}
          status={status}
          isConflicting={isConflicting}
          onApproval={onApproval}
        />
      </CardContent>
      {showCommentBox && (
        <div className="px-5 pb-4 -mt-2">
          <Textarea
            placeholder={`Add a comment for ${student.name}...`}
            value={status.educatorComment}
            onChange={(e) => onCommentChange(item.id, e.target.value)}
            className="text-base bg-secondary/80 rounded-xl"
          />
        </div>
      )}
    </Card>
  );
}

interface ApprovalActionsProps {
  item: PackingItem;
  student: User;
  status: StudentChecklistItemStatus;
  isConflicting: boolean;
  onApproval: (itemId: string, approved: boolean | null) => void;
}

function ApprovalActions({ item, student, status, isConflicting, onApproval }: ApprovalActionsProps) {
  return (
    <div className="flex items-center gap-1 mt-3 sm:mt-0">
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
        className={cn("rounded-full h-12 w-12", status.educatorApproved === true ? "bg-green-500/20 text-green-400" : "text-muted-foreground hover:text-green-500")}
        onClick={() => onApproval(item.id, status.educatorApproved === true ? null : true)}
        aria-label="Approve"
      >
        <Icons.ThumbsUp className="h-6 w-6" />
      </Button>

      <Button
        variant={status.educatorApproved === false ? "secondary" : "ghost"}
        size="icon"
        className={cn("rounded-full h-12 w-12", status.educatorApproved === false ? "bg-red-500/20 text-red-400" : "text-muted-foreground hover:text-red-500")}
        onClick={() => onApproval(item.id, status.educatorApproved === false ? null : false)}
        aria-label="Reject"
      >
        <Icons.ThumbsDown className="h-6 w-6" />
      </Button>
    </div>
  );
}
