'use client';

import { Tent, Mountain } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TitleCharacter = ({ char, delay }: { char: string, delay: string }) => (
  <span className="title-char" style={{ animationDelay: delay }}>{char}</span>
);

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
            <h1 className="flex items-center justify-center gap-1 text-6xl font-bold text-center font-headline tracking-tighter">
              <span className="text-primary"><TitleCharacter char="B" delay="0s" /></span>
              <span className="title-char -mx-2 -mb-2" style={{ animationDelay: '0.1s' }}><Tent className="text-primary" size={60} strokeWidth={2} /></span>
              <span className="text-primary"><TitleCharacter char="s" delay="0.2s" /></span>
              <span className="text-primary"><TitleCharacter char="e" delay="0.3s" /></span>
              <span className="text-primary"><TitleCharacter char="c" delay="0.4s" /></span>
              <span className="text-primary"><TitleCharacter char="a" delay="0.5s" /></span>
              <span className="text-primary"><TitleCharacter char="m" delay="0.6s" /></span>
              <span className="text-primary"><TitleCharacter char="p" delay="0.7s" /></span>
            </h1>
            <p className="text-xl text-muted-foreground mt-2">The not-boring packing list app.</p>
        </div>
        <Card className="shadow-2xl text-left border-2 border-foreground/80">
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-headline text-center">
                Log In To Your Account
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
