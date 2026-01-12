// src/pages/Connect.tsx
// EpiConnect - Speed networking for EIS officers

import { useState, useMemo, useEffect } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { AttendeeCard } from '../components/connect/AttendeeCard';
import { ChallengeCard } from '../components/connect/ChallengeCard';
import { MatchFilters } from '../components/connect/MatchFilters';
import { ProfileSetup } from '../components/connect/ProfileSetup';
import { QRCodeConnect } from '../components/connect/QRCodeConnect';
import { SpeedNetworking } from '../components/connect/SpeedNetworking';
import {
  mockAttendees,
  connectChallenges,
  topicLabels,
  getTopMatches,
  getAttendeeById,
} from '../data/connect-data';
import type { AttendeeProfile, MatchFilter, Topic, Connection, UserProfile, ConnectView } from '../types/connect';
import { Users, Target, Sparkles, QrCode, Timer, User, Trophy, Zap } from 'lucide-react';
import { Confetti } from '../components/patient-zero/Confetti';

// Storage keys
const PROFILE_KEY = 'epiconnect_profile';
const CONNECTIONS_KEY = 'epiconnect_connections';

export function Connect() {
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Connections state
  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem(CONNECTIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());

  // UI state
  const [activeFilter, setActiveFilter] = useState<MatchFilter | Topic | null>(null);
  const [view, setView] = useState<ConnectView>('discover');
  const [showConfetti, setShowConfetti] = useState(false);

  // Persist profile to localStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Persist connections to localStorage
  useEffect(() => {
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
  }, [connections]);

  // Connected IDs set for quick lookup
  const connectedIds = useMemo(() => new Set(connections.map(c => c.connected_player_id)), [connections]);

  // Smart matching - get ranked attendees
  const rankedAttendees = useMemo(() => {
    if (!userProfile) return [];
    return getTopMatches(userProfile, mockAttendees, 20);
  }, [userProfile]);

  // Filter attendees based on active filter
  const filteredAttendees = useMemo(() => {
    let attendees = mockAttendees.filter(a =>
      a.id !== userProfile?.id && !connectedIds.has(a.id)
    );

    if (activeFilter === 'new-alumni') {
      attendees = attendees.filter(a => a.role === 'alumni' || a.role === 'supervisor');
    } else if (activeFilter === 'incoming-2nd') {
      attendees = attendees.filter(a => a.role === 'incoming' || a.role === 'second_year');
    } else if (activeFilter && topicLabels[activeFilter as Topic]) {
      attendees = attendees.filter(a => a.topics.includes(activeFilter as Topic));
    }

    // Sort by match score if we have a user profile
    if (userProfile && !activeFilter) {
      const scoreMap = new Map(rankedAttendees.map(r => [r.attendeeId, r]));
      attendees.sort((a, b) => {
        const scoreA = scoreMap.get(a.id)?.score || 0;
        const scoreB = scoreMap.get(b.id)?.score || 0;
        return scoreB - scoreA;
      });
    }

    return attendees;
  }, [activeFilter, connectedIds, userProfile, rankedAttendees]);

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
            const attendee = getAttendeeById(c.connected_player_id);
            return attendee?.role === 'alumni';
          }).length > 0 ? 1 : 0;
          break;
        case 'topic-expert':
          t = 3;
          p = Math.min(3, connections.length);
          break;
        case 'cross-country':
          p = connections.filter(c => {
            const attendee = getAttendeeById(c.connected_player_id);
            const westStates = ['California', 'Washington', 'Oregon', 'Arizona'];
            const eastStates = ['New York', 'Massachusetts', 'Florida', 'Georgia'];
            return westStates.includes(attendee?.home_state || '') || eastStates.includes(attendee?.home_state || '');
          }).length > 0 ? 1 : 0;
          break;
        case 'mentor-match':
          p = connections.filter(c => {
            const attendee = getAttendeeById(c.connected_player_id);
            return attendee?.role === 'supervisor';
          }).length > 0 ? 1 : 0;
          break;
        case 'network-builder':
          t = 10;
          p = connections.length;
          break;
        case 'global-health':
          p = connections.filter(c => {
            const attendee = getAttendeeById(c.connected_player_id);
            return attendee?.topics.includes('global_health');
          }).length > 0 ? 1 : 0;
          break;
        case 'cohort-buddy':
          p = connections.filter(c => {
            const attendee = getAttendeeById(c.connected_player_id);
            return attendee?.role === 'incoming';
          }).length > 0 ? 1 : 0;
          break;
        case 'speed-demon':
          t = 3;
          p = connections.filter(c => c.connection_method === 'speed_session').length;
          break;
        case 'qr-master':
          t = 5;
          p = connections.filter(c => c.connection_method === 'qr_scan').length;
          break;
        case 'decade-traveler':
          t = 3;
          const decades = new Set(
            connections
              .map(c => {
                const attendee = getAttendeeById(c.connected_player_id);
                if (attendee?.role === 'alumni' && attendee.eis_class_year) {
                  return Math.floor(attendee.eis_class_year / 10) * 10;
                }
                return null;
              })
              .filter(Boolean)
          );
          p = decades.size;
          break;
        case 'coffee-lover':
          t = 5;
          p = connections.filter(c => {
            const attendee = getAttendeeById(c.connected_player_id);
            return attendee?.open_to_coffee;
          }).length;
          break;
      }

      progress[challenge.id] = { progress: p, target: t, complete: p >= t };
    });

    return progress;
  }, [connections]);

  // Handle connection
  const handleConnect = (attendeeId: string, method: 'app_connect' | 'qr_scan' | 'speed_session' = 'app_connect', rating?: number) => {
    const attendee = getAttendeeById(attendeeId);
    if (!attendee) return;

    // Base points + method bonus
    let points = 25;
    if (method === 'qr_scan') points = 50;
    if (method === 'speed_session') points = 35;

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      player_id: userProfile?.id || 'current-user',
      connected_player_id: attendeeId,
      connected_at: new Date().toISOString(),
      points_earned: points,
      connection_method: method,
      rating,
    };

    setConnections(prev => [...prev, newConnection]);

    // Show confetti for special connections
    if (method === 'qr_scan' || method === 'speed_session') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100);
    }
  };

  // Handle skip in speed networking
  const handleSkip = (attendeeId: string) => {
    setSkippedIds(prev => new Set([...prev, attendeeId]));
  };

  // Profile setup completion
  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowProfileSetup(false);
  };

  // Get connected attendee profiles
  const connectedAttendees = connections.map(c =>
    getAttendeeById(c.connected_player_id)
  ).filter(Boolean) as AttendeeProfile[];

  const completedChallenges = Object.values(challengeProgress).filter(p => p.complete).length;

  // Show profile setup if no profile exists
  if (showProfileSetup || !userProfile) {
    return (
      <ProfileSetup
        onComplete={handleProfileComplete}
        initialProfile={userProfile || undefined}
      />
    );
  }

  return (
    <GameShell
      theme="connect"
      heroTitle="EpiConnect"
      heroSubtitle="Speed networking for EIS officers"
      backPath="/"
    >
      <Confetti active={showConfetti} />

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* User Profile Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 mb-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">{userProfile.name}</div>
              <div className="text-purple-200 text-sm">
                {userProfile.role === 'incoming' ? 'Incoming EIS' :
                 userProfile.role === 'second_year' ? '2nd Year EIS' :
                 userProfile.role === 'alumni' ? 'Alumni' : 'Supervisor'}
                {userProfile.eis_class_year && ` '${String(userProfile.eis_class_year).slice(-2)}`}
              </div>
            </div>
            <button
              onClick={() => setShowProfileSetup(true)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white/95 rounded-xl p-4 shadow-lg mb-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">{connections.length}</div>
            <div className="text-xs text-slate-500">Connections</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-500">{totalPoints}</div>
            <div className="text-xs text-slate-500">Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{completedChallenges}/{connectChallenges.length}</div>
            <div className="text-xs text-slate-500">Challenges</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setView('speed')}
            className={`p-4 rounded-xl font-semibold transition-all flex items-center gap-3 ${
              view === 'speed'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${view === 'speed' ? 'bg-white/20' : 'bg-purple-100'}`}>
              <Timer size={20} className={view === 'speed' ? 'text-white' : 'text-purple-600'} />
            </div>
            <div className="text-left">
              <div className="font-semibold">Speed Network</div>
              <div className={`text-xs ${view === 'speed' ? 'text-purple-200' : 'text-slate-500'}`}>5-min sessions</div>
            </div>
          </button>

          <button
            onClick={() => setView('qr')}
            className={`p-4 rounded-xl font-semibold transition-all flex items-center gap-3 ${
              view === 'qr'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${view === 'qr' ? 'bg-white/20' : 'bg-purple-100'}`}>
              <QrCode size={20} className={view === 'qr' ? 'text-white' : 'text-purple-600'} />
            </div>
            <div className="text-left">
              <div className="font-semibold">QR Connect</div>
              <div className={`text-xs ${view === 'qr' ? 'text-purple-200' : 'text-slate-500'}`}>Scan in person</div>
            </div>
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setView('discover')}
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              view === 'discover'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles size={18} />
            Discover
          </button>
          <button
            onClick={() => setView('connections')}
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              view === 'connections'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Users size={18} />
            My Network
            {connections.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                view === 'connections' ? 'bg-white/20' : 'bg-purple-100 text-purple-700'
              }`}>
                {connections.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setView('challenges')}
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              view === 'challenges'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Target size={18} />
            Challenges
          </button>
        </div>

        {/* Speed Networking View */}
        {view === 'speed' && (
          <SpeedNetworking
            userProfile={userProfile}
            onConnect={(id, rating) => handleConnect(id, 'speed_session', rating)}
            onSkip={handleSkip}
            connectedIds={connectedIds}
            skippedIds={skippedIds}
          />
        )}

        {/* QR Code View */}
        {view === 'qr' && (
          <QRCodeConnect
            userProfile={userProfile}
            onConnect={(id) => handleConnect(id, 'qr_scan')}
            connectedIds={connectedIds}
          />
        )}

        {/* Discover View */}
        {view === 'discover' && (
          <>
            <MatchFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            {/* Suggested matches header */}
            {!activeFilter && rankedAttendees.length > 0 && (
              <div className="mt-4 mb-2 flex items-center gap-2 text-purple-700">
                <Zap size={16} />
                <span className="text-sm font-medium">Suggested for you</span>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {filteredAttendees.length === 0 ? (
                <div className="bg-white/95 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-lg font-semibold text-slate-800">No more matches!</h3>
                  <p className="text-slate-600 mt-2">
                    You've connected with everyone in this category. Try a different filter!
                  </p>
                </div>
              ) : (
                filteredAttendees.slice(0, 10).map(attendee => {
                  const matchInfo = rankedAttendees.find(r => r.attendeeId === attendee.id);
                  return (
                    <AttendeeCard
                      key={attendee.id}
                      attendee={attendee}
                      onConnect={(id) => handleConnect(id, 'app_connect')}
                      isConnected={false}
                      matchReasons={matchInfo?.reasons}
                    />
                  );
                })
              )}

              {filteredAttendees.length > 10 && (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm">
                    Showing top 10 matches. Use filters to narrow down.
                  </p>
                </div>
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
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                >
                  Find People
                </button>
              </div>
            ) : (
              <>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-700 font-medium mb-2">
                    <Trophy size={18} />
                    Your Network
                  </div>
                  <p className="text-sm text-purple-600">
                    You've connected with {connectedAttendees.length} people and earned {totalPoints} points!
                  </p>
                </div>
                {connectedAttendees.map(attendee => {
                  const connection = connections.find(c => c.connected_player_id === attendee.id);
                  return (
                    <div key={attendee.id} className="relative">
                      <AttendeeCard
                        attendee={attendee}
                        isConnected={true}
                        showFullBio={true}
                      />
                      {connection && (
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            +{connection.points_earned} pts
                          </span>
                          {connection.connection_method === 'qr_scan' && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              QR
                            </span>
                          )}
                          {connection.connection_method === 'speed_session' && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                              Speed
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Challenges View */}
        {view === 'challenges' && (
          <div className="space-y-3">
            {/* Progress summary */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-80">Challenge Progress</div>
                  <div className="text-2xl font-bold">{completedChallenges} / {connectChallenges.length}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-80">Total Points</div>
                  <div className="text-2xl font-bold">{totalPoints}</div>
                </div>
              </div>
              <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all"
                  style={{ width: `${(completedChallenges / connectChallenges.length) * 100}%` }}
                />
              </div>
            </div>

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
