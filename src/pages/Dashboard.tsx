
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LevelProgress } from '@/components/dashboard/LevelProgress';
import { SkillCard } from '@/components/skills/SkillCard';
import { BookOpen, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock data - will be replaced with actual data from Supabase
  const userData = {
    name: 'Alex Johnson',
    level: 8,
    xp: 720,
    xpToNextLevel: 1000,
    completedModules: 24,
    streak: 7,
  };
  
  // Mock skills data
  const inProgressSkills = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Master the core concepts of JavaScript programming language',
      category: 'Programming',
      progress: 65,
      totalModules: 10,
      completedModules: 6,
    },
    {
      id: '2',
      title: 'React Hooks',
      description: 'Learn how to use React Hooks effectively in your applications',
      category: 'Frontend',
      progress: 30,
      totalModules: 8,
      completedModules: 2,
    },
    {
      id: '3',
      title: 'UI/UX Principles',
      description: 'Understand the fundamentals of user interface and experience design',
      category: 'Design',
      progress: 10,
      totalModules: 12,
      completedModules: 1,
    },
  ];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.name}</h1>
          <p className="text-muted-foreground">
            Continue your learning journey and track your progress
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatsCard
            title="Completed Modules"
            value={userData.completedModules}
            icon={<BookOpen size={20} />}
            description="Across all skills"
          />
          
          <StatsCard
            title="Current Streak"
            value={userData.streak}
            icon={<Clock size={20} />}
            description="Days in a row"
            trend={{ value: 16, isPositive: true }}
          />
          
          <StatsCard
            title="Total XP"
            value={userData.xp}
            icon={<Trophy size={20} />}
            description="Experience points earned"
          />
        </div>
        
        <LevelProgress
          level={userData.level}
          xp={userData.xp}
          xpToNextLevel={userData.xpToNextLevel}
          className="mb-8"
        />
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">In Progress</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/skills">View All Skills</Link>
          </Button>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inProgressSkills.map((skill) => (
            <SkillCard key={skill.id} {...skill} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
