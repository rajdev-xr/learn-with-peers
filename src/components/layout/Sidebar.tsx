
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Trophy,
  Settings,
  BookOpen
} from 'lucide-react';

export function Sidebar() {
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'admin';
  
  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/skills',
      label: 'Skills',
      icon: BookOpen,
    },
    {
      href: '/leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
    },
    ...(isAdmin
      ? [
          {
            href: '/admin',
            label: 'Admin',
            icon: Settings,
          },
        ]
      : []),
  ];
  
  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background z-10">
      <div className="h-16 flex items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-bold">S</span>
          </div>
          <span className="font-bold text-xl">SkillSync</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-md bg-accent/10 p-3">
          <div>
            <p className="text-sm font-medium">SkillSync</p>
            <p className="text-xs text-muted-foreground">Microlearning Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}
