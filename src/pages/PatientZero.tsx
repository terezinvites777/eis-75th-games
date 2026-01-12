// src/pages/PatientZero.tsx
// Where in the World is Patient Zero? - Multi-day mystery game

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
import { ArrowLeft, Trophy, Target, Star, Users, Skull, MapPin, Calendar, Sparkles, TrendingUp } from 'lucide-react';

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
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Case Files
          </button>

          {/* Day indicator + countdown */}
          <div className="bg-slate-800/80 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-red-400" />
              <div>
                <div className="text-white font-bold">Day {currentDay} of 3</div>
                <div className="text-slate-400 text-sm">
                  {selectedMystery.clues.filter(c => c.day <= currentDay).length} of {selectedMystery.clues.length} clues available
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
                  className="px-3 py-1.5 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm"
                >
                  Skip Day
                </button>
              )}
            </div>
          </div>

          {/* Featured mystery badge */}
          {selectedMystery.isFeatured && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Star size={24} className="text-white" />
              <div>
                <div className="text-white font-bold">75th Anniversary Featured Case</div>
                <div className="text-amber-100 text-sm">
                  The landmark investigation that changed public health forever
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

          {/* Impact Stats (if available) */}
          {selectedMystery.impactStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {selectedMystery.impactStats.totalCases && (
                <div className="bg-white/95 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">{selectedMystery.impactStats.totalCases}</div>
                  <div className="text-xs text-slate-500 uppercase">Cases</div>
                </div>
              )}
              {selectedMystery.impactStats.deaths && (
                <div className="bg-white/95 rounded-lg p-3 text-center">
                  <Skull size={16} className="mx-auto text-slate-400 mb-1" />
                  <div className="text-2xl font-bold text-slate-700">{selectedMystery.impactStats.deaths}</div>
                  <div className="text-xs text-slate-500 uppercase">Deaths</div>
                </div>
              )}
              {selectedMystery.impactStats.statesAffected && (
                <div className="bg-white/95 rounded-lg p-3 text-center">
                  <MapPin size={16} className="mx-auto text-slate-400 mb-1" />
                  <div className="text-2xl font-bold text-slate-700">{selectedMystery.impactStats.statesAffected}</div>
                  <div className="text-xs text-slate-500 uppercase">States</div>
                </div>
              )}
              {selectedMystery.impactStats.eisOfficersDeployed && (
                <div className="bg-white/95 rounded-lg p-3 text-center">
                  <Users size={16} className="mx-auto text-blue-400 mb-1" />
                  <div className="text-2xl font-bold text-blue-600">{selectedMystery.impactStats.eisOfficersDeployed}</div>
                  <div className="text-xs text-slate-500 uppercase">EIS Officers</div>
                </div>
              )}
            </div>
          )}

          {/* Confetti celebration */}
          <Confetti active={showConfetti} />

          {/* Theory Form or Solution */}
          {isComplete && completedData ? (
            <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden relative">
              {/* Success banner */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400" />

              <div className="text-center mb-6">
                <Trophy size={48} className="mx-auto text-amber-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-800">Case Closed!</h3>

                {/* Social proof */}
                <div className="flex items-center justify-center gap-2 mt-2 text-slate-500 text-sm">
                  <TrendingUp size={16} className="text-green-500" />
                  <span>{solverCount.toLocaleString()} detectives have solved this case</span>
                </div>
              </div>

              {/* Score Breakdown Component */}
              <div className="mb-6">
                <ScoreBreakdownDisplay
                  breakdown={completedData.breakdown}
                  daySubmitted={completedData.daySubmitted}
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">EIS Officers Involved</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMystery.solution.eis_officers_involved.map(officer => (
                    <span key={officer} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {officer}
                    </span>
                  ))}
                </div>
              </div>

              {/* Historical Context */}
              {selectedMystery.historicalContext && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Historical Significance</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-line">
                    {selectedMystery.historicalContext}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Social proof indicator */}
              {solverCount > 0 && (
                <div className="bg-slate-100 rounded-lg p-3 mb-4 flex items-center justify-center gap-2 text-slate-600 text-sm">
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
                  className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg relative z-10"
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
        {/* World Map */}
        <div className="mb-6">
          <WorldMap
            locations={mapLocations}
            onLocationClick={handleSelectMystery}
          />
        </div>

        {/* Featured 75th Anniversary Mystery */}
        {featuredMystery && !completedMysteries[featuredMystery.id] && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-red-600 rounded-xl p-1 shadow-xl">
              <div className="bg-slate-900/95 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500 rounded-xl">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={16} className="text-amber-400" />
                      <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">
                        75th Anniversary Featured Case
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{featuredMystery.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">
                      The landmark outbreak that defined modern epidemiology. Can you solve the mystery that launched the EIS into the history books?
                    </p>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-amber-500 rounded-full h-2 transition-all"
                          style={{ width: `${(currentDay / 3) * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-sm">Day {currentDay}/3</span>
                    </div>

                    <button
                      onClick={() => featuredMystery && handleSelectMystery(featuredMystery.id)}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
                    >
                      Investigate Case
                    </button>
                  </div>
                </div>

                {/* Countdown to next clue */}
                {nextClueRelease && currentDay < 3 && (
                  <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Next clue releases in:</span>
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
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/95 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Target size={20} className="text-red-600" />
            How to Play
          </h2>
          <div className="space-y-2 text-slate-700 text-sm">
            <p>🔍 <strong>Investigate:</strong> New clues are revealed twice daily - morning and afternoon during the conference.</p>
            <p>🧠 <strong>Theorize:</strong> Use the evidence to form your theory about the outbreak, year, location, and pathogen.</p>
            <p>⏰ <strong>Score Big:</strong> Submit early for bonus multipliers! Day 1 = 2x points, Day 2 = 1.5x points.</p>
            <p>🎯 <strong>Solve:</strong> After all clues are revealed, unlock the solution and see how you scored!</p>
          </div>
        </div>

        {/* Day Progress + Dev Controls */}
        <div className="bg-slate-800/80 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar size={28} className="text-red-400" />
            <div>
              <div className="text-white font-bold text-lg">Investigation Day {currentDay}</div>
              <div className="text-slate-400 text-sm">
                {currentDay < 3 ? 'More clues coming soon...' : 'All clues revealed - submit your theories!'}
              </div>
            </div>
          </div>
          {DEV_MODE && currentDay < 3 && (
            <button
              onClick={advanceDay}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm"
            >
              Skip to Day {currentDay + 1}
            </button>
          )}
        </div>

        {/* Other Mysteries Grid */}
        <h2 className="text-xl font-bold text-white mb-4">Active Case Files</h2>
        <div className="grid md:grid-cols-2 gap-4">
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
          <div className="mt-4">
            <MysteryCard
              mystery={featuredMystery}
              currentDay={currentDay}
              isComplete={true}
              score={completedMysteries[featuredMystery.id]?.score}
              onStart={handleSelectMystery}
            />
          </div>
        )}

        {/* Total Score */}
        {Object.keys(completedMysteries).length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <Trophy size={28} />
              <div>
                <div className="text-sm opacity-80">Total Investigation Score</div>
                <div className="text-2xl font-bold">
                  {Object.values(completedMysteries).reduce((sum, data) => sum + (data?.score || 0), 0)} pts
                </div>
              </div>
            </div>
            <div className="text-sm opacity-80">
              {Object.keys(completedMysteries).length} / {mysteries.length} cases solved
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}

export default PatientZero;
