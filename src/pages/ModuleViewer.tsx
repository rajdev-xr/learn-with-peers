
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, ExternalLink, Trophy } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  resource_link: string;
  skill_id: string;
  xp_reward: number;
  skill: {
    title: string;
  };
  isCompleted?: boolean;
}

const ModuleViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModule = async () => {
      try {
        if (!id || !user) return;

        // Fetch module with its skill
        const { data, error } = await supabase
          .from('modules')
          .select(`
            *,
            skill:skills(title)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        // Check if user has completed this module
        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('module_id', id)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          // PGRST116 is "Results contain 0 rows" - not an error in our case
          throw progressError;
        }

        setModule({
          ...data,
          isCompleted: !!progressData
        });

      } catch (error) {
        console.error('Error fetching module:', error);
        toast.error('Failed to load module content');
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id, user]);

  const handleMarkComplete = async () => {
    try {
      if (!user || !module || module.isCompleted) return;
      
      setCompleting(true);
      
      const { error } = await supabase.from('progress').insert({
        user_id: user.id,
        module_id: module.id
      });

      if (error) throw error;
      
      toast.success(`Module completed! You earned ${module.xp_reward} XP`);
      
      // Update local state
      setModule({
        ...module,
        isCompleted: true
      });
      
    } catch (error) {
      console.error('Error marking module as complete:', error);
      toast.error('Failed to mark module as complete');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-full">
          <Loader className="h-8 w-8" />
        </div>
      </AppLayout>
    );
  }

  if (!module) {
    return (
      <AppLayout>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Module not found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/skills">Back to Skills</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link 
                to={`/skills/${module.skill_id}`} 
                className="flex items-center text-muted-foreground hover:text-foreground mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {module.skill.title}
              </Link>
              <h1 className="text-3xl font-bold">{module.title}</h1>
            </div>
            
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-sm">
              <Trophy className="h-4 w-4" />
              {module.xp_reward} XP
            </Badge>
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <div className="bg-card p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">Learning Resource</h3>
              <Button asChild variant="ghost" size="sm">
                <a 
                  href={module.resource_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Open in new tab
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
            <div className="p-0">
              {/* Embed or display the resource */}
              <div className="aspect-video w-full">
                <iframe 
                  src={module.resource_link}
                  className="w-full h-full border-0"
                  title={module.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
          
          <div className="py-6 flex items-center justify-between">
            <Link to={`/skills/${module.skill_id}`}>
              <Button variant="outline">Back to Skill</Button>
            </Link>
            
            <Button 
              onClick={handleMarkComplete}
              disabled={module.isCompleted || completing}
              className={module.isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {completing ? (
                <>
                  <Loader className="mr-2 h-4 w-4" />
                  Marking Complete...
                </>
              ) : module.isCompleted ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ModuleViewer;
