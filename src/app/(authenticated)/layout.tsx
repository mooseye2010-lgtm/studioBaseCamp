'use client';

import { AppHeader } from '@/components/dashboard/shared/header';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return null; // Or a loading spinner, but auth provider already shows one
  }
  
  if (!isAuthenticated) {
     // This should be handled by the AuthProvider, but as a fallback
    if (typeof window !== 'undefined') {
        router.push('/');
    }
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
