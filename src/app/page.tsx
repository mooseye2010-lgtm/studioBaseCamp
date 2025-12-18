'use client';

import { Tent } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center p-4 overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-background via-background to-secondary/10" />
      <div className="w-full max-w-sm text-center relative z-10">
        <div 
          className="mb-12 animate-float-in animate-gentle-float" 
          style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
        >
          <h1 className="flex items-center justify-center gap-1 text-6xl text-foreground/90 tracking-tighter font-headline">
            <span>Basec</span>
            <Tent className="text-primary -mb-1" size={48} strokeWidth={2} />
            <span>mp</span>
          </h1>
          <p className="text-xl text-muted-foreground mt-2 tracking-tight uppercase font-body">The Not-Boring Packing App.</p>
        </div>
        
        <div 
            className="animate-float-in"
            style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
        >
            <Card className="text-left bg-card/80 backdrop-blur-xl border-border/20 shadow-2xl shadow-black/30 rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-xl font-normal text-center text-foreground tracking-wide uppercase font-body">
                    Sign In
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
