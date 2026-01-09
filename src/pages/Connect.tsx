// src/pages/Connect.tsx
// EpiConnect - Speed networking game

import { useState, useMemo } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { AttendeeCard } from '../components/connect/AttendeeCard';
import { ChallengeCard } from '../components/connect/ChallengeCard';
import { MatchFilters } from '../components/connect/MatchFilters';
import { mockAttendees, connectChallenges, topicLabels } from '../data/connect-data';
import type { AttendeeProfile, MatchFilter, Topic, Connection } from '../types/connect';
import { Users, Target, Sparkles } from 'lucide-react';

export function Connect() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeFilter, setActiveFilter] = useState<MatchFilter | Topic | null>(null);
  const [view, setView] = useState<'discover' | 'connections' | 'challenges'>('discover');

  // Calculate which attendees to show based on filter
  const filteredAttendees = useMemo(() => {
    const connectedIds = new Set(connections.map(c => c.connected_player_id));

    let attendees = mockAttendees.filter(a => !connectedIds.has(a.id));

    if (activeFilter === 'new-alumni') {
      attendees = attendees.filter(a => a.role === 'alumni' || a.role === 'supervisor');
    } else if (activeFilter === 'incoming-2nd') {
      attendees = attendees.filter(a => a.role === 'incoming' || a.role === 'second_year');
    } else if (activeFilter && topicLabels[activeFilter as Topic]) {
      attendees = attendees.filter(a => a.topics.includes(activeFilter as Topic));
    }

    return attendees;
  }, [activeFilter, connections]);

  // Calculate total points
  const totalPoints = connections.reduce((sum, c) => sum + c.points_earned, 0);

  // Calculate challenge progress
  const challengeProgress = useMemo(() => {
    const progress: Record<string, { progress: number; target: number; complete: boolean }> = {};

    connectChallenges.forEach(challenge => {
      let p = 0;
      let t = 1;

      switch (challenge.id) {
        case 'first-connect':
          p = connections.length > 0 ? 1 : 0;
          break;
        case 'alumni-wisdom':
          p = connections.filter(c => {
            const attendee = mockAttendees.find(a => a.id === c.connected_player_id);
            return attendee?.role === 'alumni';
          }).length > 0 ? 1 : 0;
          break;
        case 'topic-expert':
          t = 3;
          // Count connections with shared topics (simplified)
          p = Math.min(3, connections.length);
          break;
        case 'cross-country':
          // Check for opposite coast connections
          p = connections.filter(c => {
            const attendee = mockAttendees.find(a => a.id === c.connected_player_id);
            const westStates = ['California', 'Washington', 'Oregon', 'Arizona'];
            const eastStates = ['New York', 'Massachusetts', 'Florida', 'Georgia'];
            return westStates.includes(attendee?.home_state || '') || eastStates.includes(attendee?.home_state || '');
          }).length > 0 ? 1 : 0;
          break;
        case 'mentor-match':
          p = connections.filter(c => {
            const attendee = mockAttendees.find(a => a.id === c.connected_player_id);
            return attendee?.role === 'supervisor';
          }).length > 0 ? 1 : 0;
          break;
        case 'network-builder':
          t = 10;
          p = connections.length;
          break;
        case 'global-health':
          p = connections.filter(c => {
            const attendee = mockAttendees.find(a => a.id === c.connected_player_id);
            return attendee?.topics.includes('global_health');
          }).length > 0 ? 1 : 0;
          break;
        case 'cohort-buddy':
          p = connections.filter(c => {
            const attendee = mockAttendees.find(a => a.id === c.connected_player_id);
            return attendee?.role === 'incoming';
          }).length > 0 ? 1 : 0;
          break;
      }

      progress[challenge.id] = { progress: p, target: t, complete: p >= t };
    });

    return progress;
  }, [connections]);

  // Handle connection
  const handleConnect = (attendeeId: string) => {
    const attendee = mockAttendees.find(a => a.id === attendeeId);
    if (!attendee) return;

    // Calculate points (base + challenge bonuses)
    let points = 25; // Base connection points

    // Check if this connection completes any challenges
    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      player_id: 'current-user',
      connected_player_id: attendeeId,
      connected_at: new Date().toISOString(),
      points_earned: points,
    };

    setConnections(prev => [...prev, newConnection]);
  };

  // Get connected attendee profiles
  const connectedAttendees = connections.map(c =>
    mockAttendees.find(a => a.id === c.connected_player_id)
  ).filter(Boolean) as AttendeeProfile[];

  const completedChallenges = Object.values(challengeProgress).filter(p => p.complete).length;

  return (
    <GameShell
      theme="connect"
      heroTitle="EpiConnect"
      heroSubtitle="Speed networking for EIS officers"
      backPath="/"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Stats Bar */}
        <div className="bg-white/95 rounded-xl p-4 shadow-lg mb-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{connections.length}</div>
            <div className="text-xs text-slate-500">Connections</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-500">{totalPoints}</div>
            <div className="text-xs text-slate-500">Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{completedChallenges}</div>
            <div className="text-xs text-slate-500">Challenges</div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('discover')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              view === 'discover'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles size={18} />
            Discover
          </button>
          <button
            onClick={() => setView('connections')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              view === 'connections'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Users size={18} />
            My Network
          </button>
          <button
            onClick={() => setView('challenges')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              view === 'challenges'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Target size={18} />
            Challenges
          </button>
        </div>

        {/* Discover View */}
        {view === 'discover' && (
          <>
            <MatchFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            <div className="mt-6 space-y-4">
              {filteredAttendees.length === 0 ? (
                <div className="bg-white/95 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-lg font-semibold text-slate-800">No more matches!</h3>
                  <p className="text-slate-600 mt-2">
                    You've connected with everyone in this category. Try a different filter!
                  </p>
                </div>
              ) : (
                filteredAttendees.map(attendee => (
                  <AttendeeCard
                    key={attendee.id}
                    attendee={attendee}
                    onConnect={handleConnect}
                    isConnected={false}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* Connections View */}
        {view === 'connections' && (
          <div className="space-y-4">
            {connectedAttendees.length === 0 ? (
              <div className="bg-white/95 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">👋</div>
                <h3 className="text-lg font-semibold text-slate-800">No connections yet</h3>
                <p className="text-slate-600 mt-2">
                  Start networking! Browse attendees and make your first connection.
                </p>
                <button
                  onClick={() => setView('discover')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Find People
                </button>
              </div>
            ) : (
              connectedAttendees.map(attendee => (
                <AttendeeCard
                  key={attendee.id}
                  attendee={attendee}
                  isConnected={true}
                  showFullBio={true}
                />
              ))
            )}
          </div>
        )}

        {/* Challenges View */}
        {view === 'challenges' && (
          <div className="space-y-3">
            {connectChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                progress={challengeProgress[challenge.id]?.progress || 0}
                target={challengeProgress[challenge.id]?.target || 1}
                isComplete={challengeProgress[challenge.id]?.complete || false}
              />
            ))}
          </div>
        )}
      </div>
    </GameShell>
  );
}

export default Connect;
