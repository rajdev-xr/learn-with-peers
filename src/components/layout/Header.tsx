
import React from 'react';
import { Menu, Bell, Sun, Moon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HeaderProps {
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  } | null;
  onLogout: () => void;
}

export function Header({ toggleSidebar, isDarkMode, toggleDarkMode, user, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu size={20} />
      </Button>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleDarkMode} 
          className="text-foreground/70 hover:text-foreground"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="text-foreground/70 hover:text-foreground relative"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
        </Button>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-foreground/70 hover:text-foreground"
              >
                <User size={18} />
                <span className="hidden sm:inline-block">{user.name || user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="font-medium">{user.email}</DropdownMenuItem>
              <DropdownMenuItem className="font-medium">{user.role || 'User'}</DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" className="hidden sm:inline-block" asChild>
            <a href="/login">Log in</a>
          </Button>
        )}
      </div>
    </header>
  );
}
