
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SkillCard } from '@/components/skills/SkillCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from '@/components/ui/loader';

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface UserProgress {
  skill_id: string;
  completed_modules: number;
  total_modules: number;
  progress_percentage: number;
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .order('title');

        if (skillsError) throw skillsError;

        // Get unique categories
        const uniqueCategories = Array.from(
          new Set(skillsData?.map(skill => skill.category) || [])
        );
        setCategories(uniqueCategories);

        if (skillsData) {
          setSkills(skillsData);

          // Fetch modules for each skill to calculate progress
          if (user) {
            const progressMap: Record<string, UserProgress> = {};
            
            await Promise.all(
              skillsData.map(async (skill) => {
                // Fetch all modules for this skill
                const { data: modules, error: modulesError } = await supabase
                  .from('modules')
                  .select('id, skill_id')
                  .eq('skill_id', skill.id);

                if (modulesError) throw modulesError;

                const totalModules = modules?.length || 0;
                
                if (totalModules === 0) {
                  progressMap[skill.id] = {
                    skill_id: skill.id,
                    completed_modules: 0,
                    total_modules: 0,
                    progress_percentage: 0,
                  };
                  return;
                }

                // Fetch completed modules for this user and skill
                const { data: completedModules, error: progressError } = await supabase
                  .from('progress')
                  .select('module_id')
                  .eq('user_id', user.id)
                  .in(
                    'module_id',
                    modules?.map(m => m.id) || []
                  );

                if (progressError) throw progressError;

                const completed = completedModules?.length || 0;
                const progressPercentage = totalModules > 0 
                  ? Math.round((completed / totalModules) * 100) 
                  : 0;

                progressMap[skill.id] = {
                  skill_id: skill.id,
                  completed_modules: completed,
                  total_modules: totalModules,
                  progress_percentage: progressPercentage,
                };
              })
            );

            setUserProgress(progressMap);
          }
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [user]);

  // Filter skills based on search query and category filter
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? skill.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Skills Library</h1>
          <p className="text-muted-foreground">
            Browse and learn from our collection of skills
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <Input
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:max-w-sm"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="sm:max-w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="w-8 h-8" />
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No skills found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill) => {
              const progress = userProgress[skill.id] || {
                completed_modules: 0,
                total_modules: 0,
                progress_percentage: 0
              };
              
              return (
                <SkillCard
                  key={skill.id}
                  id={skill.id}
                  title={skill.title}
                  description={skill.description}
                  category={skill.category}
                  progress={progress.progress_percentage}
                  totalModules={progress.total_modules}
                  completedModules={progress.completed_modules}
                />
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Skills;
