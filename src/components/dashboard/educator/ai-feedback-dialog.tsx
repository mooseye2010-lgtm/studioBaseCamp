'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { resolveConflictingApprovals } from '@/ai/flows/resolve-conflicting-approvals';
import type { ResolveConflictingApprovalsOutput } from '@/ai/flows/resolve-conflicting-approvals';
import type { PackingItem, Student, StudentChecklistItemStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AIFeedbackDialogProps {
  children: React.ReactNode;
  item: PackingItem;
  student: Student;
  status: StudentChecklistItemStatus;
}

export function AIFeedbackDialog({
  children,
  item,
  student,
  status,
}: AIFeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResolveConflictingApprovalsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await resolveConflictingApprovals({
        itemName: item.name,
        educatorApproved: !!status.educatorApproved,
        studentCompleted: status.completed,
        studentComment: status.educatorComment,
      });
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('Failed to get AI feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => handleOpen()}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Icons.AlertTriangle className="text-destructive"/>
            Approval Conflict
          </DialogTitle>
          <DialogDescription>
            AI-powered suggestions to resolve the conflict for item: <strong>{item.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            {loading && (
                <div className="flex items-center justify-center h-24">
                    <Icons.Spinner className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {result && (
                <div className="space-y-4">
                    <Alert>
                        <Icons.Comment className="h-4 w-4" />
                        <AlertTitle>AI Suggestion</AlertTitle>
                        <AlertDescription>{result.alertMessage}</AlertDescription>
                    </Alert>
                    <div>
                        <h4 className="font-semibold mb-2">Clarification Questions for {student.name}:</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            {result.clarificationQuestions.map((q, i) => (
                                <li key={i}>{q}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
