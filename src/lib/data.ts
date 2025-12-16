import type { User, Trip, StudentTripProgress } from './types';
import { placeholderImages } from './placeholder-images';

const yosemiteImage = placeholderImages.find(p => p.id === 'trip-yosemite')!;
const zionImage = placeholderImages.find(p => p.id === 'trip-zion')!;
const smokyImage = placeholderImages.find(p => p.id === 'trip-smoky')!;


export const users: User[] = [
  { id: 'user-1', name: 'Dr. Anya Sharma', email: 'anya.sharma@school.edu', role: 'educator' },
  { id: 'user-2', name: 'Ben Carter', email: 'ben.carter@student.edu', role: 'student' },
  { id: 'user-3', name: 'Chloe Davis', email: 'chloe.davis@student.edu', role: 'student' },
  { id: 'user-4', name: 'Mr. David Chen', email: 'david.chen@school.edu', role: 'educator' },
  { id: 'user-5', name: 'Sofia Rodriguez', email: 'sofia.rodriguez@student.edu', role: 'student' },
];

export const trips: Trip[] = [
  {
    id: 'trip-1',
    name: 'Yosemite National Park Geology Tour',
    date: '2024-10-15',
    imageUrl: yosemiteImage.imageUrl,
    imageHint: yosemiteImage.imageHint,
    assignedStudentIds: ['user-2', 'user-3'],
    items: [
      { id: 'item-1-1', name: 'Water Bottle (2L)', required: true },
      { id: 'item-1-2', name: 'Sunscreen (SPF 30+)', required: true },
      { id: 'item-1-3', name: 'Hiking Boots', required: true },
      { id: 'item-1-4', name: 'First-Aid Kit', required: true },
      { id: 'item-1-5', name: 'Camera', required: false },
      { id: 'item-1-6', name: 'Field Journal & Pencil', required: false },
    ],
  },
  {
    id: 'trip-2',
    name: 'Zion Canyon Observation Study',
    date: '2024-11-05',
    imageUrl: zionImage.imageUrl,
    imageHint: zionImage.imageHint,
    assignedStudentIds: ['user-2', 'user-5'],
    items: [
      { id: 'item-2-1', name: 'Wide-brimmed Hat', required: true },
      { id: 'item-2-2', name: 'Sunglasses', required: true },
      { id: 'item-2-3', name: 'Trail Snacks', required: true },
      { id: 'item-2-4', name: 'Binoculars', required: false },
    ],
  },
    {
    id: 'trip-3',
    name: 'Smoky Mountains Biodiversity Trip',
    date: '2025-04-20',
    imageUrl: smokyImage.imageUrl,
    imageHint: smokyImage.imageHint,
    assignedStudentIds: ['user-3', 'user-5'],
    items: [
      { id: 'item-3-1', name: 'Rain Jacket', required: true },
      { id: 'item-3-2', name: 'Insect Repellent', required: true },
      { id: 'item-3-3', name: 'Portable Charger', required: true },
      { id: 'item-3-4', name: 'Plant Identification Guide', required: false },
    ],
  },
];

export const studentProgress: StudentTripProgress[] = [
  {
    studentId: 'user-2',
    tripId: 'trip-1',
    itemStatuses: [
      { itemId: 'item-1-1', completed: true, educatorApproved: true },
      { itemId: 'item-1-2', completed: true, educatorApproved: null },
      { itemId: 'item-1-3', completed: false, educatorApproved: true, educatorComment: 'Please ensure these are properly broken in before the trip.' },
      { itemId: 'item-1-4', completed: true, educatorApproved: false, educatorComment: 'Please show me your kit, the expiry date on some items might be an issue.' },
      { itemId: 'item-1-5', completed: false, educatorApproved: null },
      { itemId: 'item-1-6', completed: true, educatorApproved: true },
    ],
  },
  {
    studentId: 'user-3',
    tripId: 'trip-1',
    itemStatuses: [
      { itemId: 'item-1-1', completed: true, educatorApproved: true },
      { itemId: 'item-1-2', completed: true, educatorApproved: true },
      { itemId: 'item-1-3', completed: true, educatorApproved: true },
      { itemId: 'item-1-4', completed: false, educatorApproved: null },
      { itemId: 'item-1-5', completed: false, educatorApproved: null },
      { itemId: 'item-1-6', completed: false, educatorApproved: null },
    ],
  },
    {
    studentId: 'user-2',
    tripId: 'trip-2',
    itemStatuses: [
      { itemId: 'item-2-1', completed: true, educatorApproved: true },
      { itemId: 'item-2-2', completed: true, educatorApproved: null },
      { itemId: 'item-2-3', completed: false, educatorApproved: null },
      { itemId: 'item-2-4', completed: true, educatorApproved: true },
    ],
  },
  {
    studentId: 'user-5',
    tripId: 'trip-2',
    itemStatuses: [
      { itemId: 'item-2-1', completed: false, educatorApproved: null },
      { itemId: 'item-2-2', completed: false, educatorApproved: null },
      { itemId: 'item-2-3', completed: false, educatorApproved: null },
      { itemId: 'item-2-4', completed: false, educatorApproved: null },
    ],
  },
];
