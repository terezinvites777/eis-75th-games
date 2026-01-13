// src/components/connect/ConnectLeftSidebar.tsx
// Instagram-style left sidebar with user profile and activity

import { Heart, CheckCircle, Clock, User, Trophy, Zap } from 'lucide-react';
import type { UserProfile, Connection } from '../../types/connect';
import { getAttendeeById } from '../../data/connect-data';

interface ConnectLeftSidebarProps {
  userProfile: UserProfile;
  connections: Connection[];
  totalPoints: number;
  completedChallenges: number;
  onEditProfile: () => void;
}

export function ConnectLeftSidebar({
  userProfile,
  connections,
  totalPoints,
  completedChallenges,
  onEditProfile,
}: ConnectLeftSidebarProps) {
  const roleLabel = {
    incoming: 'Incoming EIS',
    second_year: '2nd Year EIS',
    alumni: 'EIS Alumni',
    supervisor: 'Supervisor',
  }[userProfile.role];

  // Get initials
  const initials = userProfile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  // Get recent activity (last 3 connections)
  const recentActivity = connections.slice(-3).reverse();

  return (
    <div className="sticky top-6 space-y-4">
      {/* User Profile Card */}
      <div className="panel">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-slate-800 truncate">{userProfile.name}</h2>
            <p className="text-sm text-slate-500">{roleLabel}</p>
          </div>
          <button
            onClick={onEditProfile}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <User size={18} />
          </button>
        </div>

        {/* Journey Stats - Purple gradient */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-white/80" />
            <span className="text-sm font-medium text-white/80">Your Networking Journey</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{connections.length}</div>
              <div className="text-xs text-white/70">Connects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalPoints}</div>
              <div className="text-xs text-white/70">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{completedChallenges}</div>
              <div className="text-xs text-white/70">Badges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="panel">
        <div className="section-header mb-3">
          <Zap size={16} className="text-purple-600" />
          <span className="section-title">Recent Activity</span>
          <div className="section-header-line" />
        </div>

        {recentActivity.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            No activity yet. Start connecting!
          </p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map(connection => {
              const attendee = getAttendeeById(connection.connected_player_id);
              if (!attendee) return null;

              const methodIcon = connection.connection_method === 'qr_scan'
                ? 'QR'
                : connection.connection_method === 'speed_session'
                  ? 'Speed'
                  : null;

              return (
                <div key={connection.id} className="flex items-start gap-2 p-2 rounded-lg bg-purple-50">
                  <Heart size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 truncate">
                      Connected with <span className="font-medium">{attendee.name}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">
                        +{connection.points_earned} pts
                      </span>
                      {methodIcon && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded">
                          {methodIcon}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Conference Timeline */}
      <div className="panel">
        <div className="section-header mb-3">
          <Clock size={16} className="text-purple-600" />
          <span className="section-title">Conference Timeline</span>
          <div className="section-header-line" />
        </div>

        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-800">Day 1 - Welcome</p>
              <p className="text-xs text-slate-400">April 28, 2026</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-4 h-4 rounded-full bg-purple-500 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-purple-700">Day 2 - Networking</p>
              <p className="text-xs text-slate-400">April 29, 2026</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Clock size={16} className="text-slate-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-slate-500">Day 3 - Presentations</p>
              <p className="text-xs text-slate-400">April 30, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectLeftSidebar;
