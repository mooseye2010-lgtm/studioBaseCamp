'use client';

import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SettingsDialog } from './settings-dialog';
import { useState } from 'react';

export function AppHeader() {
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-24 items-center justify-between">
          <Link
            href={user ? `/${user.role}/dashboard` : '/'}
            className="flex items-center gap-1"
          >
            <h1 className="flex items-center justify-center gap-1 text-3xl text-foreground tracking-[0.2em] font-headline font-light">
              <span>BASEC</span>
              <Icons.Tent className="text-primary -mb-0.5" size={28} strokeWidth={1.5} />
              <span>MP</span>
            </h1>
          </Link>
          <div className="flex items-center justify-end space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-14 w-14 rounded-full">
                  <Avatar className="h-14 w-14 border-2 border-muted hover:border-primary transition-colors">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                    <AvatarFallback className="text-lg font-medium uppercase">{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 rounded-2xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-base font-medium leading-none uppercase font-body tracking-wider">{user?.name}</p>
                    <p className="text-sm leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)} className="text-base p-3 cursor-pointer rounded-lg uppercase font-body tracking-wider">
                    <Icons.Settings className="mr-3 h-5 w-5" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={logout} className="text-base p-3 cursor-pointer rounded-lg uppercase font-body tracking-wider">
                  <Icons.LogOut className="mr-3 h-5 w-5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
