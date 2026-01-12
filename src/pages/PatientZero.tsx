// src/pages/PatientZero.tsx
// Where in the World is Patient Zero? - Multi-day mystery game
// UX aligned with Disease Detective brand styling

import { useState, useEffect } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { MysteryCard } from '../components/patient-zero/MysteryCard';
import { TheoryForm } from '../components/patient-zero/TheoryForm';
import { DetectiveBoard } from '../components/patient-zero/DetectiveBoard';
import { WorldMap } from '../components/patient-zero/WorldMap';
import { CountdownTimer } from '../components/patient-zero/CountdownTimer';
import { ScoreBreakdownDisplay } from '../components/patient-zero/ScoreBreakdown';
import { Confetti } from '../components/patient-zero/Confetti';
import { mysteries, featuredMystery, calculateTheoryScoreDetailed } from '../data/patient-zero-data';
import type { ScoreBreakdown } from '../data/patient-zero-data';
import { getCurrentDay, getNextClueRelease, DEV_MODE } from '../data/patient-zero-schedule';
import type { MysteryDefinition, PlayerTheory } from '../types/patient-zero';
import { ArrowLeft, Trophy, Target, Star, Users, Skull, MapPin, Calendar, Sparkles, TrendingUp, Zap, Search } from 'lucide-react';

// Simulated social proof - would come from backend in production
function getSimulatedSolvers(mysteryId: string): number {
  const baseCounts: Record<string, number> = {
    '75th-anniversary-grand': 847,
    'hantavirus-1993': 423,
    'toxic-shock-1980': 391,
  };
  // Add some randomness to make it feel dynamic
  const base = baseCounts[mysteryId] || Math.floor(Math.random() * 300) + 100;
  return base + Math.floor(Math.random() * 10);
}

export function PatientZero() {
  const [selectedMystery, setSelectedMystery] = useState<MysteryDefinition | null>(null);
  const [theories, setTheories] = useState<Record<string, PlayerTheory>>({});
  const [completedMysteries, setCompletedMysteries] = useState<Record<string, { score: number; breakdown: ScoreBreakdown; daySubmitted: number }>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [solverCounts, setSolverCounts] = useState<Record<string, number>>({});

  // Use conference schedule for day progression (or dev mode for testing)
  const [currentDay, setCurrentDay] = useState(getCurrentDay());

  // Initialize simulated solver counts
  useEffect(() => {
    const counts: Record<string, number> = {};
    mysteries.forEach(m => {
      counts[m.id] = getSimulatedSolvers(m.id);
    });
    setSolverCounts(counts);
  }, []);

  // For dev mode - allow manual day advancement
  const advanceDay = () => {
    if (DEV_MODE && currentDay < 3) {
      setCurrentDay(prev => prev + 1);
    }
  };

  const handleSelectMystery = (id: string) => {
    const mystery = mysteries.find(m => m.id === id);
    if (mystery) {
      setSelectedMystery(mystery);
    }
  };

  const handleSubmitTheory = (theoryData: PlayerTheory['theory']) => {
    if (!selectedMystery) return;

    const theory: PlayerTheory = {
      player_id: 'current-user',
      mystery_id: selectedMystery.id,
      submitted_at: new Date().toISOString(),
      theory: theoryData,
      day_submitted: currentDay,
    };

    setTheories(prev => ({
      ...prev,
      [selectedMystery.id]: theory,
    }));
  };

  const handleRevealSolution = () => {
    if (!selectedMystery) return;

    const theory = theories[selectedMystery.id];
    if (theory) {
      const breakdown = calculateTheoryScoreDetailed(
        theory.theory,
        selectedMystery.solution,
        theory.day_submitted
      );

      setCompletedMysteries(prev => ({
        ...prev,
        [selectedMystery.id]: {
          score: breakdown.totalScore,
          breakdown,
          daySubmitted: theory.day_submitted,
        },
      }));

      // Trigger confetti celebration!
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100); // Reset trigger after brief delay
    }
  };

  // Get next clue release time for countdown
  const nextClueRelease = getNextClueRelease();

  // Map locations for the WorldMap component
  const mapLocations = mysteries.map(m => ({
    id: m.id,
    title: m.title,
    lat: m.coordinates.lat,
    lng: m.coordinates.lng,
    revealed: !!completedMysteries[m.id]?.score,
    isFeatured: m.isFeatured,
  }));

  // Mystery detail view
  if (selectedMystery) {
    const completedData = completedMysteries[selectedMystery.id];
    const isComplete = !!completedData?.score;
    const existingTheory = theories[selectedMystery.id];
    const allCluesRevealed = currentDay >= 3;
    const solverCount = solverCounts[selectedMystery.id] || 0;

    return (
      <GameShell
        theme="patient-zero"
        heroTitle={selectedMystery.title}
        heroSubtitle="Where in the World is Patient Zero?"
        showNav={false}
      >
        <div className="px-4 py-6 max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setSelectedMystery(null)}
            className="btn-emboss btn-emboss-sm mb-4"
          >
            <ArrowLeft size={16} />
            Back to Case Files
          </button>

          {/* Day indicator + countdown - brand panel */}
          <div className="panel-themed p-4 mb-6 animate-slide-up">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Calendar size={24} className="text-red-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Day {currentDay} of 3</div>
                  <div className="text-slate-500 text-sm">
                    {selectedMystery.clues.filter(c => c.day <= currentDay).length} of {selectedMystery.clues.length} clues available
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Early bonus indicator */}
                {currentDay <= 2 && !isComplete && (
                  <span className="pill pill-gold animate-pulse-glow">
                    <Zap size={14} />
                    {currentDay === 1 ? '2x' : '1.5x'} early bonus!
                  </span>
                )}
                {!allCluesRevealed && nextClueRelease && (
                  <CountdownTimer
                    targetDate={nextClueRelease}
                    label="Next Clue"
                    variant="compact"
                    onComplete={() => setCurrentDay(getCurrentDay())}
                  />
                )}
                {DEV_MODE && !allCluesRevealed && (
                  <button
                    onClick={advanceDay}
                    className="btn-emboss btn-emboss-sm"
                  >
                    Skip Day
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(currentDay / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Featured mystery badge */}
          {selectedMystery.isFeatured && (
            <div className="panel mb-6 relative overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
              <div className="flex items-center gap-3 pt-1">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Star size={24} className="text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">75th Anniversary Featured Case</div>
                  <div className="text-slate-500 text-sm">
                    The landmark investigation that changed public health forever
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detective Board with clues */}
          <div className="mb-6">
            <DetectiveBoard
              clues={selectedMystery.clues}
              currentDay={currentDay}
              mysteryTitle={selectedMystery.title}
            />
          </div>

          {/* Impact Stats (if available) - using stat-card */}
          {selectedMystery.impactStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 stagger-children">
              {selectedMystery.impactStats.totalCases && (
                <div className="stat-card">
                  <div className="stat-value text-red-600">{selectedMystery.impactStats.totalCases}</div>
                  <div className="stat-label">Cases</div>
                </div>
              )}
              {selectedMystery.impactStats.deaths && (
                <div className="stat-card">
                  <Skull size={16} className="mx-auto text-slate-400 mb-1" />
                  <div className="stat-value text-slate-700">{selectedMystery.impactStats.deaths}</div>
                  <div className="stat-label">Deaths</div>
                </div>
              )}
              {selectedMystery.impactStats.statesAffected && (
                <div className="stat-card">
                  <MapPin size={16} className="mx-auto text-slate-400 mb-1" />
                  <div className="stat-value text-slate-700">{selectedMystery.impactStats.statesAffected}</div>
                  <div className="stat-label">States</div>
                </div>
              )}
              {selectedMystery.impactStats.eisOfficersDeployed && (
                <div className="stat-card">
                  <Users size={16} className="mx-auto text-blue-400 mb-1" />
                  <div className="stat-value text-blue-600">{selectedMystery.impactStats.eisOfficersDeployed}</div>
                  <div className="stat-label">EIS Officers</div>
                </div>
              )}
            </div>
          )}

          {/* Confetti celebration */}
          <Confetti active={showConfetti} />

          {/* Theory Form or Solution */}
          {isComplete && completedData ? (
            <div className="panel relative overflow-hidden animate-slide-up">
              {/* Success banner */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400" />

              <div className="text-center mb-6 pt-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-3 animate-score-pop">
                  <Trophy size={32} className="text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Case Closed!</h3>

                {/* Social proof */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="pill">
                    <TrendingUp size={14} className="text-green-500" />
                    {solverCount.toLocaleString()} detectives have solved this case
                  </span>
                </div>
              </div>

              {/* Score Breakdown Component */}
              <div className="mb-6">
                <ScoreBreakdownDisplay
                  breakdown={completedData.breakdown}
                  daySubmitted={completedData.daySubmitted}
                />
              </div>

              <div className="panel-themed p-4 mb-4">
                <div className="section-header mb-3">
                  <Users size={16} className="text-blue-600" />
                  <span className="section-title">EIS Officers Involved</span>
                  <div className="section-header-line" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMystery.solution.eis_officers_involved.map(officer => (
                    <span key={officer} className="pill pill-blue">
                      {officer}
                    </span>
                  ))}
                </div>
              </div>

              {/* Historical Context */}
              {selectedMystery.historicalContext && (
                <div className="panel-themed p-4">
                  <div className="section-header mb-3">
                    <Sparkles size={16} className="text-amber-600" />
                    <span className="section-title">Historical Significance</span>
                    <div className="section-header-line" />
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {selectedMystery.historicalContext}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Social proof indicator */}
              {solverCount > 0 && (
                <div className="panel-themed p-3 mb-4 flex items-center justify-center gap-2 text-slate-600 text-sm animate-slide-up">
                  <Users size={16} className="text-slate-400" />
                  <span>{solverCount.toLocaleString()} investigators have cracked this case — can you?</span>
                </div>
              )}

              <TheoryForm
                existingTheory={existingTheory?.theory}
                onSubmit={handleSubmitTheory}
              />

              {/* Reveal solution button (available on day 3) */}
              {allCluesRevealed && existingTheory && (
                <button
                  type="button"
                  onClick={handleRevealSolution}
                  className="btn-emboss btn-emboss-primary btn-emboss-lg w-full mt-4"
                >
                  <Target size={18} />
                  Reveal Solution & Score
                </button>
              )}
            </>
          )}
        </div>
      </GameShell>
    );
  }

  // Mystery selection view (main page)
  return (
    <GameShell
      theme="patient-zero"
      heroTitle="Where in the World is Patient Zero?"
      heroSubtitle="Solve historic outbreak mysteries"
      backPath="/"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* World Map - enhanced with panel styling */}
        <div className="mb-6 animate-slide-up">
          <WorldMap
            locations={mapLocations}
            onLocationClick={handleSelectMystery}
          />
        </div>

        {/* Featured 75th Anniversary Mystery - premium panel styling */}
        {featuredMystery && !completedMysteries[featuredMystery.id] && (
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="panel relative overflow-hidden">
              {/* Gold accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-600 to-red-600" />

              <div className="flex items-start gap-4 pt-1">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                  <Sparkles size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="pill pill-gold">
                      <Star size={14} />
                      75th Anniversary Featured Case
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{featuredMystery.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    The landmark outbreak that defined modern epidemiology. Can you solve the mystery that launched the EIS into the history books?
                  </p>

                  {/* Progress indicator with brand styling */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${(currentDay / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="pill">Day {currentDay}/3</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => featuredMystery && handleSelectMystery(featuredMystery.id)}
                      className="btn-emboss btn-emboss-primary"
                    >
                      <Search size={18} />
                      Investigate Case
                    </button>
                    {currentDay <= 2 && (
                      <span className="pill pill-gold animate-pulse-glow">
                        <Zap size={14} />
                        {currentDay === 1 ? '2x' : '1.5x'} early bonus!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Countdown to next clue */}
              {nextClueRelease && currentDay < 3 && (
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Next clue releases in:</span>
                  <CountdownTimer
                    targetDate={nextClueRelease}
                    label="Next Clue"
                    variant="compact"
                    onComplete={() => setCurrentDay(getCurrentDay())}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions - brand panel styling */}
        <div className="panel mb-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="section-header mb-4">
            <Target size={18} className="text-red-600" />
            <span className="section-title">How to Play</span>
            <div className="section-header-line" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="stat-card !text-left !p-4">
              <div className="text-2xl mb-1">🔍</div>
              <div className="font-semibold text-slate-800 text-sm">Investigate</div>
              <div className="text-xs text-slate-500 mt-1">New clues revealed twice daily</div>
            </div>
            <div className="stat-card !text-left !p-4">
              <div className="text-2xl mb-1">🧠</div>
              <div className="font-semibold text-slate-800 text-sm">Theorize</div>
              <div className="text-xs text-slate-500 mt-1">Form your theory about the outbreak</div>
            </div>
            <div className="stat-card !text-left !p-4">
              <div className="text-2xl mb-1">⏰</div>
              <div className="font-semibold text-slate-800 text-sm">Score Big</div>
              <div className="text-xs text-slate-500 mt-1">Day 1 = 2x, Day 2 = 1.5x bonus</div>
            </div>
            <div className="stat-card !text-left !p-4">
              <div className="text-2xl mb-1">🎯</div>
              <div className="font-semibold text-slate-800 text-sm">Solve</div>
              <div className="text-xs text-slate-500 mt-1">Unlock solution and see your score</div>
            </div>
          </div>
        </div>

        {/* Day Progress - brand panel */}
        <div className="panel-themed p-4 mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar size={24} className="text-red-600" />
              </div>
              <div>
                <div className="font-bold text-lg text-slate-800">Investigation Day {currentDay}</div>
                <div className="text-slate-500 text-sm">
                  {currentDay < 3 ? 'More clues coming soon...' : 'All clues revealed - submit your theories!'}
                </div>
              </div>
            </div>
            {DEV_MODE && currentDay < 3 && (
              <button
                onClick={advanceDay}
                className="btn-emboss btn-emboss-sm"
              >
                Skip to Day {currentDay + 1}
              </button>
            )}
          </div>
          <div className="mt-4">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentDay / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Other Mysteries Grid - with section header */}
        <div className="section-header mb-4">
          <Search size={18} className="text-[var(--theme-primary)]" />
          <span className="section-title">Active Case Files</span>
          <div className="section-header-line" />
        </div>
        <div className="grid md:grid-cols-2 gap-4 stagger-children">
          {mysteries.filter(m => !m.isFeatured).map(mystery => (
            <MysteryCard
              key={mystery.id}
              mystery={mystery}
              currentDay={currentDay}
              isComplete={!!completedMysteries[mystery.id]?.score}
              score={completedMysteries[mystery.id]?.score}
              onStart={handleSelectMystery}
            />
          ))}
        </div>

        {/* Completed Featured Mystery Card */}
        {featuredMystery && completedMysteries[featuredMystery.id]?.score && (
          <div className="mt-4 animate-slide-up">
            <MysteryCard
              mystery={featuredMystery}
              currentDay={currentDay}
              isComplete={true}
              score={completedMysteries[featuredMystery.id]?.score}
              onStart={handleSelectMystery}
            />
          </div>
        )}

        {/* Total Score - brand panel */}
        {Object.keys(completedMysteries).length > 0 && (
          <div className="mt-6 panel relative overflow-hidden animate-slide-up">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Trophy size={24} className="text-amber-600" />
                </div>
                <div>
                  <div className="stat-label">Total Investigation Score</div>
                  <div className="text-2xl font-bold text-gradient-gold animate-score-pop">
                    {Object.values(completedMysteries).reduce((sum, data) => sum + (data?.score || 0), 0)} pts
                  </div>
                </div>
              </div>
              <span className="pill pill-themed">
                {Object.keys(completedMysteries).length} / {mysteries.length} cases solved
              </span>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}

export default PatientZero;
