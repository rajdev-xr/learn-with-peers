
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LevelProgress } from '@/components/dashboard/LevelProgress';
import { SkillCard } from '@/components/skills/SkillCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader } from '@/components/ui/loader';

interface UserData {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedModules: number;
  streak: number;
}

interface SkillProgress {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  totalModules: number;
  completedModules: number;
}

// Calculate level based on XP
const getLevelFromXP = (xp: number): number => {
  const levelThresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000];
  let level = 1;
  for (let i = 1; i < levelThresholds.length; i++) {
    if (xp >= levelThresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
};

// Calculate XP needed for next level
const getXPForNextLevel = (xp: number): number => {
  const levelThresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000];
  for (let i = 1; i < levelThresholds.length; i++) {
    if (xp < levelThresholds[i]) {
      return levelThresholds[i];
    }
  }
  // If beyond defined levels
  return levelThresholds[levelThresholds.length - 1] * 1.5;
};

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [inProgressSkills, setInProgressSkills] = useState<SkillProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !userProfile) return;
      
      try {
        // Count completed modules
        const { count: completedModules, error: countError } = await supabase
          .from('progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (countError) throw countError;
        
        // Calculate level and XP to next level
        const xp = userProfile.xp || 0;
        const level = getLevelFromXP(xp);
        const xpToNextLevel = getXPForNextLevel(xp);
        
        setUserData({
          name: user.email?.split('@')[0] || 'User',
          level,
          xp,
          xpToNextLevel,
          completedModules: completedModules || 0,
          streak: 7, // Mock data for streak - would require additional tracking
        });
        
        // Fetch in-progress skills (skills with at least one completed module)
        if (completedModules && completedModules > 0) {
          // Get unique skill_ids from completed modules
          const { data: completedModuleData, error: progressError } = await supabase
            .from('progress')
            .select(`
              module:modules(
                skill_id
              )
            `)
            .eq('user_id', user.id);
          
          if (progressError) throw progressError;
          
          // Extract unique skill ids
          const uniqueSkillIds = Array.from(
            new Set(completedModuleData?.map(item => item.module.skill_id) || [])
          );
          
          if (uniqueSkillIds.length > 0) {
            // Fetch skill details
            const { data: skillsData, error: skillsError } = await supabase
              .from('skills')
              .select('*')
              .in('id', uniqueSkillIds)
              .limit(3);
              
            if (skillsError) throw skillsError;
            
            // For each skill, calculate progress
            if (skillsData) {
              const skillProgressPromises = skillsData.map(async (skill) => {
                // Get all modules for this skill
                const { data: modules, error: modulesError } = await supabase
                  .from('modules')
                  .select('id')
                  .eq('skill_id', skill.id);
                  
                if (modulesError) throw modulesError;
                
                const totalModules = modules?.length || 0;
                
                if (totalModules === 0) {
                  return {
                    ...skill,
                    progress: 0,
                    totalModules: 0,
                    completedModules: 0,
                  };
                }
                
                // Get completed modules for this skill
                const { data: completed, error: completedError } = await supabase
                  .from('progress')
                  .select('module_id')
                  .eq('user_id', user.id)
                  .in('module_id', modules?.map(m => m.id) || []);
                  
                if (completedError) throw completedError;
                
                const completedCount = completed?.length || 0;
                const progressPercentage = Math.round((completedCount / totalModules) * 100);
                
                return {
                  ...skill,
                  progress: progressPercentage,
                  totalModules,
                  completedModules: completedCount,
                };
              });
              
              const skillsWithProgress = await Promise.all(skillProgressPromises);
              setInProgressSkills(skillsWithProgress);
            }
          }
        }
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, userProfile]);
  
  if (!userData && loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-40">
          <Loader className="h-8 w-8" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userData?.name || 'User'}
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey and track your progress
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatsCard
            title="Completed Modules"
            value={userData?.completedModules || 0}
            icon={<BookOpen size={20} />}
            description="Across all skills"
          />
          
          <StatsCard
            title="Current Streak"
            value={userData?.streak || 0}
            icon={<Clock size={20} />}
            description="Days in a row"
            trend={{ value: 16, isPositive: true }}
          />
          
          <StatsCard
            title="Total XP"
            value={userData?.xp || 0}
            icon={<Trophy size={20} />}
            description="Experience points earned"
          />
        </div>
        
        {userData && (
          <LevelProgress
            level={userData.level}
            xp={userData.xp}
            xpToNextLevel={userData.xpToNextLevel}
            className="mb-8"
          />
        )}
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">In Progress</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/skills">View All Skills</Link>
          </Button>
        </div>
        
        {inProgressSkills.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">
              You haven't started any skills yet.
            </p>
            <Button asChild>
              <Link to="/skills">Explore Skills</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inProgressSkills.map((skill) => (
              <SkillCard key={skill.id} {...skill} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
