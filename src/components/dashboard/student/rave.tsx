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

const icons = [Icons.Tent, Icons.Mountain, Icons.Checklist, Icons.Users, Icons.Leaf];

export function Rave() {
  const { width, height } = useWindowSize();
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const messageInterval = setInterval(() => {
        setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center animate-[rave-bg_2s_linear_infinite]">
        <Confetti width={width} height={height} numberOfPieces={600} gravity={0.2} />
        
        <div className="relative text-center text-primary-foreground p-8">
            <div className="grid grid-cols-5 gap-8 mb-12">
                {icons.map((Icon, i) => (
                    <Icon 
                        key={i} 
                        className="h-16 w-16 text-primary-foreground animate-[icon-pop_0.5s_ease-out_forwards]"
                        style={{animationDelay: `${i * 100}ms`}}
                    />
                ))}
            </div>

            <h1 
                key={currentMessage}
                className="text-6xl font-headline font-light tracking-widest animate-[icon-pop_0.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards] text-shadow-lg"
                style={{textShadow: '2px 2px 10px rgba(0,0,0,0.3)'}}
            >
                {currentMessage}
            </h1>
            
            <Button 
                onClick={() => setShow(false)} 
                className="mt-12 text-lg uppercase tracking-wider rounded-full bg-background/30 text-foreground hover:bg-background/50 h-14 px-8 animate-[float-in_0.8s_ease-out_1s_forwards] opacity-0"
            >
                Close
            </Button>
        </div>
    </div>
  );
}
