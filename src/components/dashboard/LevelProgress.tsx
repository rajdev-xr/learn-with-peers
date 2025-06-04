
import React from 'react';
import { cn } from '@/lib/utils';

interface LevelProgressProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  className?: string;
}

export function LevelProgress({ level, xp, xpToNextLevel, className }: LevelProgressProps) {
  const progress = Math.min(100, Math.round((xp / xpToNextLevel) * 100));
  
  // Determine level title based on level number
  const getLevelTitle = (level: number) => {
    if (level <= 5) return 'Beginner';
    if (level <= 15) return 'Intermediate';
    if (level <= 25) return 'Advanced';
    if (level <= 35) return 'Expert';
    return 'Master';
  };
  
  const levelTitle = getLevelTitle(level);

  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Current Level</p>
          <div className="flex items-center mt-1 gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="font-bold text-primary">{level}</span>
            </div>
            <div>
              <h3 className="font-bold text-xl">{levelTitle}</h3>
              <p className="text-xs text-muted-foreground">{xp} XP total</p>
            </div>
          </div>
        </div>
        
        <div className="level-badge text-sm">Level {level}</div>
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-foreground/70">Progress to Level {level + 1}</span>
          <span className="font-medium">{xp} / {xpToNextLevel} XP</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-bar-fill"
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        <p className="mt-2 text-sm text-muted-foreground">
          {xpToNextLevel - xp} XP needed for next level
        </p>
      </div>
    </div>
  );
}
