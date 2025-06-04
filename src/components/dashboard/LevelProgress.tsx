
import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface LevelProgressProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  className?: string;
}

export function LevelProgress({ level, xp, xpToNextLevel, className }: LevelProgressProps) {
  const progressPercentage = Math.min(Math.round((xp / xpToNextLevel) * 100), 100);
  
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Current Level</p>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xl">
              {level}
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                {level === 1 ? 'Novice' : 
                 level <= 3 ? 'Beginner' : 
                 level <= 5 ? 'Intermediate' : 
                 level <= 8 ? 'Advanced' : 'Expert'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {xp} / {xpToNextLevel} XP to next level
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/3">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-muted-foreground">Level {level}</p>
            <p className="text-xs text-muted-foreground">Level {level + 1}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
