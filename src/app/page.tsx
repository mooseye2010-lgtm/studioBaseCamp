'use client';

import { Tent, Mountain } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-headline">
              <span className="text-primary">B</span>
              <Tent className="text-primary -mx-1" size={28} />
              <span className="text-primary">secamp</span>
              <Mountain className="text-primary" size={28} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
