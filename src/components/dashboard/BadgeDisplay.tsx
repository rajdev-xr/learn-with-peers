
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Crown, Gem } from 'lucide-react';

interface UserBadge {
  id: string;
  badge_type: string;
  earned_at: string;
  xp_threshold: number;
}

interface BadgeDisplayProps {
  currentXP: number;
  userBadges: UserBadge[];
  className?: string;
}

const getBadgeIcon = (badgeType: string) => {
  switch (badgeType) {
    case 'Novice':
      return <Trophy className="w-4 h-4 text-green-500" />;
    case 'Intermediate':
      return <Star className="w-4 h-4 text-yellow-500" />;
    case 'Advanced':
      return <Crown className="w-4 h-4 text-blue-500" />;
    case 'Expert':
      return <Gem className="w-4 h-4 text-purple-500" />;
    default:
      return <Trophy className="w-4 h-4" />;
  }
};

const getBadgeColor = (badgeType: string) => {
  switch (badgeType) {
    case 'Novice':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Advanced':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Expert':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getCurrentBadge = (xp: number): { type: string; threshold: number } => {
  if (xp >= 1000) return { type: 'Expert', threshold: 1000 };
  if (xp >= 600) return { type: 'Advanced', threshold: 600 };
  if (xp >= 300) return { type: 'Intermediate', threshold: 300 };
  if (xp >= 100) return { type: 'Novice', threshold: 100 };
  return { type: 'Beginner', threshold: 0 };
};

export function BadgeDisplay({ currentXP, userBadges, className }: BadgeDisplayProps) {
  const currentBadge = getCurrentBadge(currentXP);
  const sortedBadges = [...userBadges].sort((a, b) => b.xp_threshold - a.xp_threshold);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Current Badge</h3>
        <Badge className={`${getBadgeColor(currentBadge.type)} flex items-center gap-2`}>
          {getBadgeIcon(currentBadge.type)}
          {currentBadge.type}
        </Badge>
      </div>
      
      {sortedBadges.length > 0 && (
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-3">Badge History</h4>
          <div className="space-y-2">
            {sortedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getBadgeIcon(badge.badge_type)}
                  <span>{badge.badge_type}</span>
                  <span className="text-muted-foreground">({badge.xp_threshold} XP)</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(badge.earned_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
