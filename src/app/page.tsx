'use client';

import { Tent } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center relative z-10">
        <div 
          className="mb-10 animate-title-pop-in" 
          style={{ animationFillMode: 'backwards' }}
        >
          <h1 className="flex items-center justify-center gap-1 text-5xl font-light text-foreground tracking-wider">
            <span>Basec</span>
            <Tent className="text-primary -mb-1" size={36} strokeWidth={1.5} />
            <span>mp</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2 tracking-tight">The minimalist packing list app.</p>
        </div>
        
        <div 
            className="animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
        >
            <Card className="text-left shadow-lg border-border/30">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-center text-foreground">
                    Welcome
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
