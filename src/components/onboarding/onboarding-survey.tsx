'use client';

import { useTheme } from 'next-themes';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { ThemeRadioOption } from '@/components/dashboard/shared/settings-dialog';
import { useAuth } from '@/lib/auth';

export function OnboardingSurvey({ onComplete }: { onComplete: () => void }) {
  const { setTheme, theme } = useTheme();
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFinish = () => {
    if (selectedTheme) {
      setTheme(selectedTheme);
    }
    onComplete();
  };

  const steps = [
    {
      title: "Welcome to Basecamp!",
      subtitle: `Let's quickly set up your experience, ${user?.name}.`,
      content: !mounted ? null : (
        <div>
          <h3 className="font-semibold text-base uppercase font-body tracking-wider mb-4">Choose your look</h3>
          <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ThemeRadioOption value="light" icon={Icons.Sun} label="Light" />
              <ThemeRadioOption value="dark" icon={Icons.Moon} label="Dark" />
              <ThemeRadioOption value="system" icon={Icons.System} label="System" />
          </RadioGroup>
        </div>
      ),
    },
    {
      title: "You're all set!",
      subtitle: "Your preferences have been saved. Time to start your adventure.",
      content: (
        <div className="text-center py-8">
            <Icons.CheckCircle className="h-24 w-24 text-green-500 mx-auto animate-check-reveal" />
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
        setStep(step + 1);
    } else {
        handleFinish();
    }
  }

  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-background via-background to-secondary/10" />
      <div className="w-full max-w-2xl text-center relative z-10 animate-float-in">
        <div className="bg-card/80 backdrop-blur-xl border-border/20 shadow-2xl shadow-black/30 rounded-[2rem] p-8 md:p-12">
            <div className="mb-8">
                 <h1 className="font-headline tracking-widest font-light text-5xl">{currentStep.title}</h1>
                 <p className="text-muted-foreground mt-2 text-base uppercase font-body tracking-wider">{currentStep.subtitle}</p>
            </div>
            
            <div className="text-left mb-10 min-h-[140px]">
                {currentStep.content}
            </div>
            
            <Button onClick={handleNext} size="lg" className="text-lg tracking-wider rounded-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase font-body w-full max-w-xs mx-auto">
              {step < steps.length - 1 ? 'Continue' : 'Go to Dashboard'}
            </Button>
        </div>
      </div>
    </main>
  );
}
