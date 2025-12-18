export interface User {
  id: string;
  name: string;
  email: string;
  role: 'educator' | 'student';
}

export interface PackingItemRequirement {
  id: string;
  text: string;
}

export interface PackingItem {
  id: string;
  name: string;
  required: boolean;
  description?: string;
  imageUrl?: string;
  link?: string;
  requirements?: PackingItemRequirement[];
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
  completedRequirements?: string[]; // Array of completed requirement IDs
}

export interface StudentTripProgress {
  studentId: string;
  tripId: string;
  itemStatuses: StudentChecklistItemStatus[];
}
