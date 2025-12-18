
'use client';

import { useTheme } from 'next-themes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Icons } from '@/components/icons';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function SettingsDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    if (open) {
      setSelectedTheme(theme);
    }
  }, [open, theme]);

  const handleSaveChanges = () => {
    if (selectedTheme) {
      setTheme(selectedTheme);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your app experience.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-8">
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Appearance</h3>
                 <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme} className="grid grid-cols-3 gap-4">
                    <div>
                        <RadioGroupItem value="light" id="light" className="peer sr-only" />
                        <Label htmlFor="light" className="flex flex-col items-center justify-center rounded-2xl border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20 peer-data-[state=checked]:text-primary-foreground w-full cursor-pointer h-20 text-lg font-medium transition-all">
                           <Icons.Sun className="mb-2"/> Light
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                        <Label htmlFor="dark" className="flex flex-col items-center justify-center rounded-2xl border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20 peer-data-[state=checked]:text-primary-foreground w-full cursor-pointer h-20 text-lg font-medium transition-all">
                           <Icons.Moon className="mb-2"/> Dark
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="system" id="system" className="peer sr-only" />
                        <Label htmlFor="system" className="flex flex-col items-center justify-center rounded-2xl border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20 peer-data-[state=checked]:text-primary-foreground w-full cursor-pointer h-20 text-lg font-medium transition-all">
                           <Icons.System className="mb-2"/> System
                        </Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <div className="flex items-center justify-between p-4 rounded-2xl border bg-card">
                    <Label htmlFor="push-notifications" className="flex flex-col gap-1">
                        <span className="font-medium">Push Notifications</span>
                        <span className="text-sm text-muted-foreground">Receive updates on your device.</span>
                    </Label>
                    <Switch id="push-notifications" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border bg-card">
                    <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                        <span className="font-medium">Email Notifications</span>
                        <span className="text-sm text-muted-foreground">Get trip summaries and alerts via email.</span>
                    </Label>
                    <Switch id="email-notifications" defaultChecked />
                </div>
            </div>
             <div className="space-y-4">
                <h3 className="font-semibold text-lg">Account</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full">Change Password</Button>
                    <Button variant="destructive" className="w-full">Delete Account</Button>
                </div>
            </div>
        </div>
        <DialogFooter className="pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
