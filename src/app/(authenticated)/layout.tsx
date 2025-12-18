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
    return null;
  }
  
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
        router.push('/');
    }
    return null;
  }

  return (
    <div className="flex h-svh flex-col">
      <AppHeader />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
