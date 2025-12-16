import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { studentProgress, trips } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStudentTripProgress(studentId: string, tripId: string): number {
    const progress = studentProgress.find(p => p.studentId === studentId && p.tripId === tripId);
    const trip = trips.find(t => t.id === tripId);

    if (!progress || !trip) return 0;
    
    const requiredItems = trip.items.filter(item => item.required);
    if(requiredItems.length === 0) return 100;

    const completedRequiredItems = progress.itemStatuses.filter(itemStatus => {
        const item = requiredItems.find(i => i.id === itemStatus.itemId);
        return item && itemStatus.completed;
    }).length;

    return Math.round((completedRequiredItems / requiredItems.length) * 100);
}

export function getOverallTripProgress(tripId: string): number {
    const trip = trips.find(t => t.id === tripId);
    if (!trip || trip.assignedStudentIds.length === 0) return 0;

    const totalProgress = trip.assignedStudentIds.reduce((sum, studentId) => {
        return sum + getStudentTripProgress(studentId, tripId);
    }, 0);

    return Math.round(totalProgress / trip.assignedStudentIds.length);
}
