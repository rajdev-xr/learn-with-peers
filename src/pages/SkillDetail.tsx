
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader } from '@/components/ui/loader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, FileText, Lock } from 'lucide-react';

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface Module {
  id: string;
  title: string;
  resource_link: string;
  order_index: number;
  skill_id: string;
  xp_reward: number;
  isCompleted?: boolean;
}

interface Comment {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  user_profile: {
    email: string;
  };
}

const SkillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchSkillAndModules = async () => {
      try {
        if (!id) return;

        // Fetch skill details
        const { data: skillData, error: skillError } = await supabase
          .from('skills')
          .select('*')
          .eq('id', id)
          .single();

        if (skillError) throw skillError;
        setSkill(skillData);

        // Fetch modules for this skill
        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('*')
          .eq('skill_id', id)
          .order('order_index');

        if (modulesError) throw modulesError;
        
        if (!user) {
          setModules(modulesData || []);
          return;
        }

        // Fetch completed modules for this user
        const { data: completedModules, error: progressError } = await supabase
          .from('progress')
          .select('module_id')
          .eq('user_id', user.id)
          .in(
            'module_id',
            modulesData?.map(m => m.id) || []
          );

        if (progressError) throw progressError;

        // Mark completed modules
        const modulesWithProgress = modulesData?.map(module => ({
          ...module,
          isCompleted: (completedModules || []).some(cm => cm.module_id === module.id)
        })) || [];

        setModules(modulesWithProgress);
        
        const completed = completedModules?.length || 0;
        const total = modulesData?.length || 0;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        setProgress({
          completed,
          total,
          percentage
        });

        // Fetch comments with user profiles
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            *,
            user_profile:profiles(email)
          `)
          .eq('skill_id', id)
          .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;
        setComments(commentsData || []);

      } catch (error) {
        console.error('Error fetching skill details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillAndModules();
  }, [id, user]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !commentBody.trim() || !id) return;
    
    setSubmittingComment(true);
    
    try {
      const { error } = await supabase.from('comments').insert({
        body: commentBody.trim(),
        user_id: user.id,
        skill_id: id
      });

      if (error) throw error;
      
      setCommentBody('');
      
      // Refetch comments
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select(`
          *,
          user_profile:profiles(email)
        `)
        .eq('skill_id', id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      setComments(data || []);
      
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
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

  if (!skill) {
    return (
      <AppLayout>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Skill not found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/skills">Back to Skills</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <Link to="/skills" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Skills
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {skill.category}
            </div>
            <h1 className="text-3xl font-bold">{skill.title}</h1>
          </div>
          
          {modules.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                {progress.completed} of {progress.total} modules completed
              </div>
              <Progress value={progress.percentage} className="w-full md:w-48 h-2" />
            </div>
          )}
        </div>
        
        <p className="text-muted-foreground">{skill.description}</p>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Modules</h2>
          {modules.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No modules available for this skill yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {modules.map((module, index) => {
                const isLocked = index > 0 && !modules[index - 1].isCompleted;
                
                return (
                  <Card key={module.id} className={isLocked ? "opacity-70" : ""}>
                    <CardHeader className="py-3">
                      <CardTitle className="flex items-start justify-between">
                        <div className="flex gap-2 items-center">
                          <span className="rounded-full bg-muted w-6 h-6 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          {module.title}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <FileText className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">+{module.xp_reward} XP</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="py-3 pt-0 flex justify-between">
                      {isLocked ? (
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Lock className="h-4 w-4 mr-2" />
                          Complete previous module first
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {module.isCompleted ? (
                            <span className="flex items-center text-green-500">
                              <Check className="h-4 w-4 mr-2" />
                              Completed
                            </span>
                          ) : (
                            "Ready to start"
                          )}
                        </div>
                      )}
                      <Button 
                        asChild
                        variant={module.isCompleted ? "outline" : "default"}
                        disabled={isLocked}
                      >
                        <Link to={`/modules/${module.id}`}>
                          {module.isCompleted ? "Review" : "Start"}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Discussion</h2>
          <Card>
            <CardContent className="pt-6">
              {user ? (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="mb-3">
                    <textarea
                      className="w-full p-3 rounded-md border border-input bg-background min-h-28"
                      placeholder="Share your thoughts about this skill..."
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submittingComment || !commentBody.trim()}>
                    {submittingComment ? (
                      <>
                        <Loader className="mr-2 h-4 w-4" />
                        Posting...
                      </>
                    ) : (
                      "Post Comment"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center p-4 mb-4 bg-muted rounded-md">
                  <p className="text-muted-foreground mb-2">
                    You must be logged in to post comments.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              )}

              {comments.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4 last:border-none last:pb-0">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">
                          {comment.user_profile?.email?.split('@')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap">{comment.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default SkillDetail;
