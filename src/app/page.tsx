'use client';

import { Tent } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>
      <div className="w-full max-w-sm text-center relative z-10">
        <div 
          className="mb-10 animate-title-pop-in" 
          style={{ animationFillMode: 'backwards' }}
        >
          <h1 className="flex items-center justify-center gap-1 text-5xl font-bold text-foreground/90 tracking-tighter font-headline">
            <span>Basec</span>
            <Tent className="text-primary -mb-1" size={36} strokeWidth={2.5} />
            <span>mp</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2 tracking-tight">The Not-Boring Packing App.</p>
        </div>
        
        <div 
            className="animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
        >
            <Card className="text-left bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-center text-foreground">
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
