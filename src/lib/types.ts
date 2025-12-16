export interface User {
  id: string;
  name: string;
  email: string;
  role: 'educator' | 'student';
}

export interface PackingItem {
  id: string;
  name: string;
  required: boolean;
}

export interface Trip {
  id: string;
  name: string;
  date: string;
  imageUrl: string;
  imageHint: string;
  items: PackingItem[];
  assignedStudentIds: string[];
}

export interface StudentChecklistItemStatus {
  itemId: string;
  completed: boolean;
  educatorApproved: boolean | null; // null means not reviewed yet
  educatorComment?: string;
}

export interface StudentTripProgress {
  studentId: string;
  tripId: string;
  itemStatuses: StudentChecklistItemStatus[];
}
