
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  email: string;
  xp: number;
  rank: number;
  level: number;
  isCurrentUser: boolean;
}

const levelThresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000];

const getLevelFromXP = (xp: number): number => {
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

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          <Trophy className="h-3 w-3 mr-1" />
          1st
        </Badge>
      );
    case 2:
      return (
        <Badge className="bg-gray-400 hover:bg-gray-500">
          <Medal className="h-3 w-3 mr-1" />
          2nd
        </Badge>
      );
    case 3:
      return (
        <Badge className="bg-amber-700 hover:bg-amber-800">
          <Medal className="h-3 w-3 mr-1" />
          3rd
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {rank}th
        </Badge>
      );
  }
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, xp')
          .order('xp', { ascending: false })
          .limit(100);

        if (error) throw error;

        if (data) {
          const leaderboardWithRanks = data.map((profile, index) => ({
            ...profile,
            rank: index + 1,
            level: getLevelFromXP(profile.xp),
            isCurrentUser: user ? profile.id === user.id : false,
          }));

          setLeaderboard(leaderboardWithRanks);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  const getAvatarInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you stack up against other learners
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="w-8 h-8" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No users found on the leaderboard yet.</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden border shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Rank</th>
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Level</th>
                    <th className="text-left py-3 px-4 font-medium">XP</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((userData) => (
                    <tr 
                      key={userData.id} 
                      className={`
                        border-t hover:bg-muted/30 transition-colors
                        ${userData.isCurrentUser ? 'bg-primary/10' : ''}
                      `}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getRankBadge(userData.rank)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback>
                              {getAvatarInitials(userData.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className={userData.isCurrentUser ? 'font-semibold' : ''}>
                              {userData.email.split('@')[0]}
                            </span>
                            {userData.isCurrentUser && (
                              <span className="text-xs text-muted-foreground">You</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium mr-2">
                            {userData.level}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {userData.level === 1 ? 'Novice' : 
                             userData.level <= 3 ? 'Beginner' : 
                             userData.level <= 5 ? 'Intermediate' : 
                             userData.level <= 8 ? 'Advanced' : 'Expert'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{userData.xp.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
