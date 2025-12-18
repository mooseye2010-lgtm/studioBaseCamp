'use client';

import { Tent } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center relative z-10">
        <div 
          className="mb-12 animate-title-pop-in" 
          style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
        >
          <h1 className="flex items-center justify-center gap-0 text-6xl font-bold text-foreground font-headline tracking-tighter -mx-2">
            <span>Basec</span>
            <Tent className="text-accent -mx-1 -mb-1" size={48} strokeWidth={2.5} />
            <span>mp</span>
          </h1>
          <p className="text-xl text-muted-foreground mt-2 tracking-tight">The not-boring packing list app.</p>
        </div>
        
        <div 
            className="animate-fade-in-up-strong"
            style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
        >
            <Card className="text-left bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold font-headline text-center text-foreground">
                    Get Ready for Adventure
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
