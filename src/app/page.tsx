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
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-0.5 text-2xl font-headline">
              <span className="text-primary"><TitleCharacter char="B" delay="0s" /></span>
              <span className="title-char" style={{ animationDelay: '0.1s' }}><Tent className="text-primary" size={28} /></span>
              <span className="text-primary"><TitleCharacter char="s" delay="0.2s" /></span>
              <span className="text-primary"><TitleCharacter char="e" delay="0.3s" /></span>
              <span className="text-primary"><TitleCharacter char="c" delay="0.4s" /></span>
              <span className="text-primary"><TitleCharacter char="a" delay="0.5s" /></span>
              <span className="text-primary"><TitleCharacter char="m" delay="0.6s" /></span>
              <span className="text-primary"><TitleCharacter char="p" delay="0.7s" /></span>
              <span className="title-char" style={{ animationDelay: '0.8s' }}><Mountain className="text-primary ml-1" size={28} /></span>
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
