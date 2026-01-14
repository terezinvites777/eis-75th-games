// src/pages/Connect.tsx
// EpiConnect - Instagram-style networking for EIS officers
// Museum exhibit styling with purple velvet theme

import { useState, useMemo, useEffect } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { AttendeeCard } from '../components/connect/AttendeeCard';
import { MatchFilters } from '../components/connect/MatchFilters';
import { ProfileSetup } from '../components/connect/ProfileSetup';
import { QRCodeConnect } from '../components/connect/QRCodeConnect';
import { SpeedNetworking } from '../components/connect/SpeedNetworking';
import { ConnectRightSidebar } from '../components/connect/ConnectRightSidebar';
import { OnlineNowCarousel } from '../components/connect/OnlineNowCarousel';
import { EpiHeroHeader } from '../components/epiconnect/EpiHeroHeader';
import { EpiExhibitCard, EpiCardHeader } from '../components/epiconnect/EpiExhibitCard';
import { EpiModeTabs } from '../components/epiconnect/EpiModeTabs';
import { EpiLedgerRow } from '../components/epiconnect/EpiLedgerRow';
import { EpiProgressCard } from '../components/epiconnect/EpiProgressCard';
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

  // Mode tabs configuration
  const tabs = [
    { key: 'discover', label: 'Discover', icon: <Home size={16} /> },
    { key: 'connections', label: 'My Network', icon: <Users size={16} />, count: connections.length },
    { key: 'challenges', label: 'Challenges', icon: <Target size={16} /> },
    { key: 'speed', label: 'Speed', icon: <Timer size={16} /> },
    { key: 'qr', label: 'QR Code', icon: <QrCode size={16} /> },
  ];

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

      <div className="epi-shell">
        {/* Hero Header */}
        <EpiHeroHeader
          title="EpiConnect"
          subtitle="Speed networking for EIS officers"
          backPath="/"
          badge={
            <>
              <span className="epi-online">Online Now</span>
              <span style={{ marginLeft: 4 }}>{filteredAttendees.filter((_, i) => i < 8).length}</span>
            </>
          }
          badgeVariant="online"
        />

        <div className="epi-grid">
          {/* LEFT SIDEBAR - Desktop only */}
          <aside className="epi-grid__left hidden lg:block">
            <EpiExhibitCard>
              {/* Profile */}
              <div className="epi-profile">
                <div className="epi-profile__avatar">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="epi-profile__name">{userProfile.name}</div>
                <div className="epi-profile__role">
                  {userProfile.role === 'incoming' ? 'Incoming EIS' :
                   userProfile.role === 'second_year' ? '2nd Year EIS' :
                   userProfile.role === 'alumni' ? 'EIS Alumni' : 'Supervisor'}
                </div>
              </div>

              {/* Stats */}
              <div className="epi-stats">
                <div className="epi-stat">
                  <div className="epi-stat__value">{connections.length}</div>
                  <div className="epi-stat__label">Connects</div>
                </div>
                <div className="epi-stat">
                  <div className="epi-stat__value">{totalPoints}</div>
                  <div className="epi-stat__label">Points</div>
                </div>
                <div className="epi-stat">
                  <div className="epi-stat__value">{completedChallenges}</div>
                  <div className="epi-stat__label">Badges</div>
                </div>
              </div>

              {/* Edit Profile */}
              <button
                onClick={() => setShowProfileSetup(true)}
                className="epi-btn epi-btn--secondary epi-btn--sm w-full"
              >
                Edit Profile
              </button>
            </EpiExhibitCard>

            {/* Activity Feed */}
            <EpiExhibitCard variant="muted" className="mt-4">
              <EpiCardHeader icon={<Sparkles size={14} />}>Recent Activity</EpiCardHeader>
              <div className="epi-activity">
                {connections.slice(-3).reverse().map((conn) => {
                  const attendee = getAttendeeById(conn.connected_player_id);
                  return (
                    <div key={conn.id} className="epi-activityItem">
                      <div className="epi-activityItem__icon">
                        <Users size={14} />
                      </div>
                      <div className="epi-activityItem__text">
                        Connected with <strong>{attendee?.name}</strong>
                      </div>
                    </div>
                  );
                })}
                {connections.length === 0 && (
                  <div className="text-center text-sm text-purple-400 py-4">
                    No activity yet
                  </div>
                )}
              </div>
            </EpiExhibitCard>
          </aside>

          {/* CENTER FEED */}
          <main className="epi-grid__center">
            {/* Mobile Profile Summary */}
            <div className="lg:hidden">
              <div className="epi-mobileProfile">
                <div className="epi-mobileProfile__row">
                  <div className="epi-mobileProfile__avatar">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="epi-mobileProfile__name">{userProfile.name}</div>
                    <div className="epi-mobileProfile__stats">
                      {connections.length} connections | {totalPoints} pts
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar - only show in discover and connections views */}
            {(view === 'discover' || view === 'connections') && (
              <div className="epi-search mb-4">
                <Search className="epi-search__icon" size={18} />
                <input
                  type="text"
                  placeholder="Search attendees by name, location, or topic..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="epi-search__input"
                />
              </div>
            )}

            {/* Mode Tabs */}
            <div className="mb-4">
              <EpiModeTabs
                tabs={tabs}
                activeTab={view}
                onTabChange={(key) => setView(key as ConnectView)}
              />
            </div>

            {/* Speed Networking View */}
            {view === 'speed' && (
              <EpiExhibitCard variant="feature">
                <SpeedNetworking
                  userProfile={userProfile}
                  onConnect={(id, rating) => handleConnect(id, 'speed_session', rating)}
                  onSkip={handleSkip}
                  connectedIds={connectedIds}
                  skippedIds={skippedIds}
                />
              </EpiExhibitCard>
            )}

            {/* QR Code View */}
            {view === 'qr' && (
              <EpiExhibitCard variant="feature">
                <QRCodeConnect
                  userProfile={userProfile}
                  onConnect={(id) => handleConnect(id, 'qr_scan')}
                  connectedIds={connectedIds}
                />
              </EpiExhibitCard>
            )}

            {/* Discover View */}
            {view === 'discover' && (
              <>
                {/* Online Now Carousel */}
                <EpiExhibitCard variant="feature" className="mb-4">
                  <EpiCardHeader
                    icon={<Users size={14} />}
                    action={<span className="epi-online">Online ({filteredAttendees.slice(0, 8).length})</span>}
                  >
                    People Near You
                  </EpiCardHeader>
                  <OnlineNowCarousel
                    attendees={filteredAttendees}
                    onSelect={handleSelectOnlineUser}
                    connectedIds={connectedIds}
                  />
                </EpiExhibitCard>

                {/* Match Filters */}
                <MatchFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

                {/* Suggested matches header */}
                {!activeFilter && !searchQuery && rankedAttendees.length > 0 && (
                  <div className="mt-4 mb-2 flex items-center gap-2">
                    <span className="epi-pill epi-pill--purple">
                      <Zap size={12} />
                      Suggested for you
                    </span>
                  </div>
                )}

                {/* Attendee Feed */}
                <div className="mt-4 space-y-4">
                  {filteredAttendees.length === 0 ? (
                    <EpiExhibitCard className="text-center py-8">
                      <div className="text-4xl mb-3">&#127881;</div>
                      <h3 className="text-lg font-semibold text-[#3d1440]">No more matches!</h3>
                      <p className="text-[#7a5c7c] mt-2 text-sm">
                        You've connected with everyone in this category. Try a different filter!
                      </p>
                    </EpiExhibitCard>
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
                      <p className="text-[#7a5c7c] text-sm">
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
                  <EpiExhibitCard variant="feature" className="text-center py-8">
                    <div className="text-4xl mb-3">&#128075;</div>
                    <h3 className="text-lg font-semibold text-[#3d1440]">No connections yet</h3>
                    <p className="text-[#7a5c7c] mt-2 text-sm">
                      Start networking! Browse attendees and make your first connection.
                    </p>
                    <button
                      onClick={() => setView('discover')}
                      className="epi-btn epi-btn--primary mt-4"
                    >
                      <Sparkles size={16} />
                      Find People
                    </button>
                  </EpiExhibitCard>
                ) : (
                  <>
                    <EpiExhibitCard variant="feature">
                      <div className="flex items-center gap-2 text-[#7a2a7e] font-medium mb-2">
                        <Trophy size={18} />
                        Your Network
                      </div>
                      <p className="text-sm text-[#5c1e5f]">
                        You've connected with {connectedAttendees.length} people and earned {totalPoints} points!
                      </p>
                    </EpiExhibitCard>
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
                              <span className="epi-pill epi-pill--success">
                                +{connection.points_earned} pts
                              </span>
                              {connection.connection_method === 'qr_scan' && (
                                <span className="epi-pill epi-pill--purple">QR</span>
                              )}
                              {connection.connection_method === 'speed_session' && (
                                <span className="epi-pill epi-pill--gold">Speed</span>
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
              <div className="space-y-4">
                {/* Progress Summary */}
                <EpiProgressCard
                  completed={completedChallenges}
                  total={connectChallenges.length}
                  points={totalPoints}
                />

                {/* Challenge Ledger */}
                <EpiExhibitCard variant="feature">
                  <EpiCardHeader icon={<Target size={14} />}>
                    Challenge Ledger
                  </EpiCardHeader>
                  <div className="epi-ledger">
                    {connectChallenges.map(challenge => (
                      <EpiLedgerRow
                        key={challenge.id}
                        icon={challenge.icon}
                        title={challenge.title}
                        description={challenge.description}
                        points={challenge.points}
                        progress={challengeProgress[challenge.id]?.progress || 0}
                        target={challengeProgress[challenge.id]?.target || 1}
                        isComplete={challengeProgress[challenge.id]?.complete || false}
                      />
                    ))}
                  </div>
                </EpiExhibitCard>
              </div>
            )}
          </main>

          {/* RIGHT SIDEBAR - XL screens only */}
          <aside className="epi-grid__right hidden xl:block">
            <EpiExhibitCard variant="muted">
              <ConnectRightSidebar onNavigate={setView} />
            </EpiExhibitCard>
          </aside>
        </div>
      </div>
    </GameShell>
  );
}

export default Connect;
