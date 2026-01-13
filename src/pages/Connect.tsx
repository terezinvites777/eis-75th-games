// src/pages/Connect.tsx
// EpiConnect - Instagram-style networking for EIS officers

import { useState, useMemo, useEffect } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { AttendeeCard } from '../components/connect/AttendeeCard';
import { ChallengeCard } from '../components/connect/ChallengeCard';
import { MatchFilters } from '../components/connect/MatchFilters';
import { ProfileSetup } from '../components/connect/ProfileSetup';
import { QRCodeConnect } from '../components/connect/QRCodeConnect';
import { SpeedNetworking } from '../components/connect/SpeedNetworking';
import { ConnectLeftSidebar } from '../components/connect/ConnectLeftSidebar';
import { ConnectRightSidebar } from '../components/connect/ConnectRightSidebar';
import { OnlineNowCarousel } from '../components/connect/OnlineNowCarousel';
import {
  mockAttendees,
  connectChallenges,
  topicLabels,
  getTopMatches,
  getAttendeeById,
} from '../data/connect-data';
import type { AttendeeProfile, MatchFilter, Topic, Connection, UserProfile, ConnectView } from '../types/connect';
import { Users, Target, Sparkles, QrCode, Timer, Trophy, Zap, Search, Home } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter attendees based on active filter and search
  const filteredAttendees = useMemo(() => {
    let attendees = mockAttendees.filter(a =>
      a.id !== userProfile?.id && !connectedIds.has(a.id)
    );

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      attendees = attendees.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.home_state?.toLowerCase().includes(query) ||
        a.topics.some(t => topicLabels[t].toLowerCase().includes(query))
      );
    }

    if (activeFilter === 'new-alumni') {
      attendees = attendees.filter(a => a.role === 'alumni' || a.role === 'supervisor');
    } else if (activeFilter === 'incoming-2nd') {
      attendees = attendees.filter(a => a.role === 'incoming' || a.role === 'second_year');
    } else if (activeFilter && topicLabels[activeFilter as Topic]) {
      attendees = attendees.filter(a => a.topics.includes(activeFilter as Topic));
    }

    // Sort by match score if we have a user profile
    if (userProfile && !activeFilter && !searchQuery) {
      const scoreMap = new Map(rankedAttendees.map(r => [r.attendeeId, r]));
      attendees.sort((a, b) => {
        const scoreA = scoreMap.get(a.id)?.score || 0;
        const scoreB = scoreMap.get(b.id)?.score || 0;
        return scoreB - scoreA;
      });
    }

    return attendees;
  }, [activeFilter, connectedIds, userProfile, rankedAttendees, searchQuery]);

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

  // Handle selecting an online user
  const handleSelectOnlineUser = (id: string) => {
    // Scroll to that user in the feed or show their card
    const element = document.getElementById(`attendee-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-purple-500');
      setTimeout(() => element.classList.remove('ring-2', 'ring-purple-500'), 2000);
    }
  };

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

      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* LEFT SIDEBAR - Desktop only */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <ConnectLeftSidebar
              userProfile={userProfile}
              connections={connections}
              totalPoints={totalPoints}
              completedChallenges={completedChallenges}
              onEditProfile={() => setShowProfileSetup(true)}
            />
          </aside>

          {/* CENTER FEED */}
          <main className="flex-1 min-w-0 max-w-2xl">
            {/* Mobile Profile Summary */}
            <div className="lg:hidden mb-4">
              <div className="panel bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{userProfile.name}</div>
                    <div className="text-purple-200 text-sm">
                      {connections.length} connections | {totalPoints} pts
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search attendees by name, location, or topic..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Feed Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { key: 'discover', label: 'Discover', icon: Home },
                { key: 'connections', label: 'My Network', icon: Users, count: connections.length },
                { key: 'challenges', label: 'Challenges', icon: Target },
                { key: 'speed', label: 'Speed', icon: Timer },
                { key: 'qr', label: 'QR Code', icon: QrCode },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = view === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setView(tab.key as ConnectView)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        isActive ? 'bg-white/20' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
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
                {/* Online Now Carousel */}
                <OnlineNowCarousel
                  attendees={filteredAttendees}
                  onSelect={handleSelectOnlineUser}
                  connectedIds={connectedIds}
                />

                {/* Match Filters */}
                <MatchFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

                {/* Suggested matches header */}
                {!activeFilter && !searchQuery && rankedAttendees.length > 0 && (
                  <div className="mt-4 mb-2 flex items-center gap-2">
                    <span className="pill pill-themed text-xs">
                      <Zap size={12} />
                      Suggested for you
                    </span>
                  </div>
                )}

                {/* Attendee Feed */}
                <div className="mt-4 space-y-4">
                  {filteredAttendees.length === 0 ? (
                    <div className="panel text-center py-8">
                      <div className="text-4xl mb-3">🎉</div>
                      <h3 className="text-lg font-semibold text-slate-800">No more matches!</h3>
                      <p className="text-slate-600 mt-2 text-sm">
                        You've connected with everyone in this category. Try a different filter!
                      </p>
                    </div>
                  ) : (
                    filteredAttendees.slice(0, 10).map(attendee => {
                      const matchInfo = rankedAttendees.find(r => r.attendeeId === attendee.id);
                      return (
                        <div key={attendee.id} id={`attendee-${attendee.id}`} className="transition-all">
                          <AttendeeCard
                            attendee={attendee}
                            onConnect={(id) => handleConnect(id, 'app_connect')}
                            isConnected={false}
                            matchReasons={matchInfo?.reasons}
                          />
                        </div>
                      );
                    })
                  )}

                  {filteredAttendees.length > 10 && (
                    <div className="text-center py-4">
                      <p className="text-slate-500 text-sm">
                        Showing top 10 matches. Use search or filters to find more.
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
                  <div className="panel text-center py-8">
                    <div className="text-4xl mb-3">👋</div>
                    <h3 className="text-lg font-semibold text-slate-800">No connections yet</h3>
                    <p className="text-slate-600 mt-2 text-sm">
                      Start networking! Browse attendees and make your first connection.
                    </p>
                    <button
                      onClick={() => setView('discover')}
                      className="btn-emboss btn-emboss-primary mt-4"
                    >
                      <Sparkles size={16} />
                      Find People
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="panel bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
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
                              <span className="pill bg-green-100 text-green-700 border-green-200 text-xs">
                                +{connection.points_earned} pts
                              </span>
                              {connection.connection_method === 'qr_scan' && (
                                <span className="pill bg-purple-100 text-purple-700 border-purple-200 text-xs">
                                  QR
                                </span>
                              )}
                              {connection.connection_method === 'speed_session' && (
                                <span className="pill bg-amber-100 text-amber-700 border-amber-200 text-xs">
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
                <div className="panel bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white/80">Challenge Progress</div>
                      <div className="text-2xl font-bold">{completedChallenges} / {connectChallenges.length}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/80">Total Points</div>
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
          </main>

          {/* RIGHT SIDEBAR - XL screens only */}
          <aside className="hidden xl:block w-64 flex-shrink-0">
            <ConnectRightSidebar onNavigate={setView} />
          </aside>
        </div>
      </div>
    </GameShell>
  );
}

export default Connect;
