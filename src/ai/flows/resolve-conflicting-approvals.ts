// src/ai/flows/resolve-conflicting-approvals.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow to resolve conflicting approvals between educators and students on packing list items.
 *
 * It provides:
 * - `resolveConflictingApprovals`: A function to trigger the conflict resolution flow.
 * - `ResolveConflictingApprovalsInput`: The input type for the resolveConflictingApprovals function.
 * - `ResolveConflictingApprovalsOutput`: The output type for the resolveConflictingApprovals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResolveConflictingApprovalsInputSchema = z.object({
  itemName: z.string().describe('The name of the packing list item.'),
  educatorApproved: z.boolean().describe('Whether the educator has approved the item.'),
  studentCompleted: z.boolean().describe('Whether the student has marked the item as complete.'),
  studentComment: z.string().optional().describe('Optional comment from the student regarding the item.'),
});
export type ResolveConflictingApprovalsInput = z.infer<typeof ResolveConflictingApprovalsInputSchema>;

const ResolveConflictingApprovalsOutputSchema = z.object({
  alertMessage: z.string().describe('A message alerting the educator to the conflict.'),
  clarificationQuestions: z.array(z.string()).describe('Suggested questions for the educator to ask the student.'),
});
export type ResolveConflictingApprovalsOutput = z.infer<typeof ResolveConflictingApprovalsOutputSchema>;

export async function resolveConflictingApprovals(input: ResolveConflictingApprovalsInput): Promise<ResolveConflictingApprovalsOutput> {
  return resolveConflictingApprovalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resolveConflictingApprovalsPrompt',
  input: {schema: ResolveConflictingApprovalsInputSchema},
  output: {schema: ResolveConflictingApprovalsOutputSchema},
  prompt: `You are an AI assistant helping educators resolve discrepancies in packing list approvals.

  An educator has approved the item "{{itemName}}", but the student has marked it as {{#if studentCompleted}}complete{{else}}incomplete{{/if}}.
  {#if studentComment}The student left the following comment: "{{studentComment}}".{{/if}}

  Provide a brief alert message to the educator explaining the conflict.
  Suggest 2-3 clarification questions the educator can ask the student to understand the situation better.

  Format the output as a JSON object with "alertMessage" and "clarificationQuestions" fields.
  `,
});

const resolveConflictingApprovalsFlow = ai.defineFlow(
  {
    name: 'resolveConflictingApprovalsFlow',
    inputSchema: ResolveConflictingApprovalsInputSchema,
    outputSchema: ResolveConflictingApprovalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
