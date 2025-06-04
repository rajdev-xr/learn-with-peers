
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SkillCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  progress?: number;
  totalModules?: number;
  completedModules?: number;
}

export function SkillCard({ 
  id, 
  title, 
  description, 
  category, 
  progress = 0,
  totalModules = 0,
  completedModules = 0,
}: SkillCardProps) {
  return (
    <Link to={`/skills/${id}`}>
      <div className={cn(
        "rounded-lg border bg-card p-6 h-full flex flex-col relative transition-all duration-200",
        "hover:border-primary/20 hover:shadow-md"
      )}>
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            {category}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-xl mb-2 pr-14">{title}</h3>
        <p className="text-muted-foreground mb-6 line-clamp-2">{description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-foreground/70">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-muted-foreground">{completedModules} of {totalModules} modules</span>
            <span className="text-primary flex items-center gap-1 font-medium group-hover:underline">
              View Skill <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
