'use client';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const messages = [
    "You're a packing legend!",
    "Ready for adventure!",
    "Mission Accomplished!",
    "Checklist obliterated!",
    "Let's get this show on the road!"
];

const icons = [Icons.Tent, Icons.Mountain, Icons.Checklist, Icons.Users, Icons.Leaf, Icons.Fire, Icons.Stake];

export function Rave() {
  const { width, height } = useWindowSize();
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const messageInterval = setInterval(() => {
        setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 1800);

    return () => clearInterval(messageInterval);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center animate-[rave-bg_1.5s_linear_infinite] overflow-hidden">
        <Confetti width={width} height={height} numberOfPieces={1000} gravity={0.2} tweenDuration={8000} recycle={false} />
        
        {/* Lasers */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute h-full w-2 bg-white/20 -skew-x-12 animate-[laser-sweep-1_3s_linear_infinite]" style={{ animationDelay: '0s' }}></div>
            <div className="absolute h-full w-2.5 bg-accent/30 -skew-x-12 animate-[laser-sweep-1_3s_linear_infinite]" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute h-full w-2 bg-white/20 -skew-x-12 animate-[laser-sweep-2_4s_linear_infinite]" style={{ animationDelay: '1s' }}></div>
            <div className="absolute h-full w-3 bg-primary/30 -skew-x-12 animate-[laser-sweep-2_4s_linear_infinite]" style={{ animationDelay: '1.3s' }}></div>
            <div className="absolute w-full h-2.5 bg-destructive/30 animate-[laser-sweep-3_5s_linear_infinite]" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Fireballs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => {
                const size = Math.random() * 80 + 20;
                const duration = Math.random() * 2 + 2;
                return (
                    <Icons.Fire
                        key={i}
                        className="absolute text-destructive opacity-0"
                        style={{
                            width: size,
                            height: size,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `fireball ${duration}s ease-out infinite`,
                            animationDelay: `${Math.random() * 4}s`,
                        }}
                    />
                );
            })}
        </div>

        <div className="relative text-center text-primary-foreground p-8">
            <div className="grid grid-cols-7 gap-6 mb-16">
                {icons.map((Icon, i) => (
                    <Icon 
                        key={i} 
                        className="h-20 w-20 text-primary-foreground animate-[icon-pop_0.6s_ease-out_forwards]"
                        style={{animationDelay: `${i * 120}ms`}}
                    />
                ))}
            </div>

            <h1 
                key={currentMessage}
                className="text-7xl font-headline font-light tracking-widest animate-[icon-pop_0.7s_cubic-bezier(0.34,1.56,0.64,1)_forwards] text-shadow-lg"
                style={{textShadow: '3px 3px 15px rgba(0,0,0,0.4)'}}
            >
                {currentMessage}
            </h1>
            
            <Button 
                onClick={() => setShow(false)} 
                className="mt-16 text-xl uppercase tracking-wider rounded-full bg-background/30 text-foreground hover:bg-background/50 h-16 px-10 animate-[float-in_1s_ease-out_1.2s_forwards] opacity-0"
            >
                Close
            </Button>
        </div>
    </div>
  );
}
