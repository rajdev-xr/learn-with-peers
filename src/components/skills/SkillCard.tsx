
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
      <div className="skill-card group">
        <div className="absolute top-4 right-4">
          <span className="badge bg-accent/10 text-accent border-accent/20">
            {category}
          </span>
        </div>
        
        <h3 className="font-semibold text-xl mb-2 pr-14">{title}</h3>
        <p className="text-muted-foreground mb-6 line-clamp-2">{description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-foreground/70">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-bar-fill animate-progress-fill"
              style={{ width: `${progress}%` }} 
            />
          </div>
          
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-muted-foreground">{completedModules} of {totalModules} modules</span>
            <span className="text-primary flex items-center gap-1 font-medium group-hover:underline">
              View Skill <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
