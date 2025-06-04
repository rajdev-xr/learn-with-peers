
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Trophy, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon: Icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <Link to={href} className="w-full" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-normal",
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/20"
        )}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const isMobile = useIsMobile();
  const pathname = window.location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleNavItemClick = () => {
    if (isMobile) setCollapsed(true);
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-0 -translate-x-full" : "w-64",
        isMobile ? "shadow-lg" : ""
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4 py-2">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-sidebar-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            S
          </div>
          <span>SkillSync</span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
        <div className="text-xs font-semibold text-sidebar-foreground/50 mb-2 pl-4">
          Navigation
        </div>

        <NavItem 
          href="/" 
          icon={Home} 
          label="Dashboard" 
          isActive={isActive('/')} 
          onClick={handleNavItemClick}
        />
        
        <NavItem 
          href="/skills" 
          icon={BookOpen} 
          label="Skills" 
          isActive={isActive('/skills')} 
          onClick={handleNavItemClick}
        />
        
        <NavItem 
          href="/leaderboard" 
          icon={Trophy} 
          label="Leaderboard" 
          isActive={isActive('/leaderboard')} 
          onClick={handleNavItemClick}
        />
      </div>

      <div className="border-t border-sidebar-border p-4">
        <NavItem 
          href="/settings" 
          icon={Settings} 
          label="Settings" 
          isActive={isActive('/settings')} 
          onClick={handleNavItemClick}
        />
      </div>
    </div>
  );
}
