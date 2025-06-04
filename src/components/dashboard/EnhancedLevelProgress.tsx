
import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Crown, Gem } from 'lucide-react';

interface EnhancedLevelProgressProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  className?: string;
}

const getBadgeIcon = (xp: number) => {
  if (xp >= 1000) return <Gem className="w-5 h-5 text-purple-500" />;
  if (xp >= 600) return <Crown className="w-5 h-5 text-blue-500" />;
  if (xp >= 300) return <Star className="w-5 h-5 text-yellow-500" />;
  if (xp >= 100) return <Trophy className="w-5 h-5 text-green-500" />;
  return <Trophy className="w-5 h-5 text-gray-400" />;
};

const getCurrentBadge = (xp: number): string => {
  if (xp >= 1000) return 'Expert';
  if (xp >= 600) return 'Advanced';
  if (xp >= 300) return 'Intermediate';
  if (xp >= 100) return 'Novice';
  return 'Beginner';
};

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case 'Expert':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Advanced':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Novice':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getNextBadgeThreshold = (xp: number): { threshold: number; name: string } => {
  if (xp < 100) return { threshold: 100, name: 'Novice' };
  if (xp < 300) return { threshold: 300, name: 'Intermediate' };
  if (xp < 600) return { threshold: 600, name: 'Advanced' };
  if (xp < 1000) return { threshold: 1000, name: 'Expert' };
  return { threshold: 1000, name: 'Expert' }; // Already at max
};

export function EnhancedLevelProgress({ level, xp, xpToNextLevel, className }: EnhancedLevelProgressProps) {
  const progressPercentage = Math.min(Math.round((xp / xpToNextLevel) * 100), 100);
  const currentBadge = getCurrentBadge(xp);
  const nextBadge = getNextBadgeThreshold(xp);
  const isMaxLevel = xp >= 1000;
  
  // Calculate progress to next badge (not level)
  const badgeProgressPercentage = isMaxLevel 
    ? 100 
    : Math.round((xp / nextBadge.threshold) * 100);

  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Current Level & Badge</p>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xl">
              {level}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-lg">
                  {level === 1 ? 'Novice' : 
                   level <= 3 ? 'Beginner' : 
                   level <= 5 ? 'Intermediate' : 
                   level <= 8 ? 'Advanced' : 'Expert'}
                </h4>
                <Badge className={`${getBadgeColor(currentBadge)} flex items-center gap-1`}>
                  {getBadgeIcon(xp)}
                  {currentBadge}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {xp} XP total • {xp} / {xpToNextLevel} XP to next level
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/3 space-y-3">
          {/* Level Progress */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">Level Progress</span>
              <span className="text-xs font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">Level {level}</p>
              <p className="text-xs text-muted-foreground">Level {level + 1}</p>
            </div>
          </div>

          {/* Badge Progress */}
          {!isMaxLevel && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Next Badge: {nextBadge.name}</span>
                <span className="text-xs font-medium">{badgeProgressPercentage}%</span>
              </div>
              <Progress value={badgeProgressPercentage} className="h-2" />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">{xp} XP</p>
                <p className="text-xs text-muted-foreground">{nextBadge.threshold} XP</p>
              </div>
            </div>
          )}
          
          {isMaxLevel && (
            <div className="text-center text-sm text-muted-foreground">
              🎉 Maximum badge achieved!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
