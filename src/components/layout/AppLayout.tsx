
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useIsMobile();
  
  // Initialize collapsed state based on mobile
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Mock user - this will be replaced with actual auth
  const mockUser = {
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'learner'
  };

  const handleLogout = () => {
    console.log('User logged out');
    // Will be implemented with Supabase auth later
  };

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${collapsed ? 'ml-0' : 'md:ml-64'}`}>
        <Header 
          toggleSidebar={toggleSidebar} 
          isDarkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          user={mockUser}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
      
      {/* Mobile overlay for sidebar */}
      {!collapsed && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setCollapsed(true)}
        />
      )}
    </div>
  );
}
