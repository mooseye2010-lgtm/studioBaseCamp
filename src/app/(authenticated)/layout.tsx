'use client';

import { AppHeader } from '@/components/dashboard/shared/header';
import { OnboardingSurvey } from '@/components/onboarding/onboarding-survey';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`);
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }
  
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
        router.push('/');
    }
    return null;
  }

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    }
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <OnboardingSurvey onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-svh flex-col">
      <AppHeader />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
