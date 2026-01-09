// src/pages/PatientZero.tsx
// Where in the World is Patient Zero? - Multi-day mystery game

import { useState } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { MysteryCard } from '../components/patient-zero/MysteryCard';
import { ClueReveal } from '../components/patient-zero/ClueReveal';
import { TheoryForm } from '../components/patient-zero/TheoryForm';
import { mysteries, calculateTheoryScore } from '../data/patient-zero-data';
import type { MysteryDefinition, PlayerTheory } from '../types/patient-zero';
import { ArrowLeft, Trophy, Clock, Target, Lightbulb } from 'lucide-react';

export function PatientZero() {
  const [selectedMystery, setSelectedMystery] = useState<MysteryDefinition | null>(null);
  const [theories, setTheories] = useState<Record<string, PlayerTheory>>({});
  const [completedMysteries, setCompletedMysteries] = useState<Record<string, number>>({});

  // For demo, we'll simulate day progression
  // In production, this would be based on actual dates
  const [currentDay, setCurrentDay] = useState(1);

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
      const score = calculateTheoryScore(
        theory.theory,
        selectedMystery.solution,
        theory.day_submitted
      );

      setCompletedMysteries(prev => ({
        ...prev,
        [selectedMystery.id]: score,
      }));
    }
  };

  // Advance day (for demo)
  const advanceDay = () => {
    if (currentDay < 3) {
      setCurrentDay(prev => prev + 1);
    }
  };

  // Mystery detail view
  if (selectedMystery) {
    const isComplete = !!completedMysteries[selectedMystery.id];
    const existingTheory = theories[selectedMystery.id];
    const revealedClues = selectedMystery.clues.filter(c => c.day <= currentDay);
    const allCluesRevealed = currentDay >= 3;

    return (
      <GameShell
        theme="detective"
        heroTitle={selectedMystery.title}
        heroSubtitle="Where in the World is Patient Zero?"
        showNav={false}
      >
        <div className="px-4 py-6 max-w-2xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setSelectedMystery(null)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Mysteries
          </button>

          {/* Day indicator + advance button (demo) */}
          <div className="bg-slate-800/80 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-amber-400" />
              <div>
                <div className="text-white font-bold">Day {currentDay} of 3</div>
                <div className="text-slate-400 text-sm">
                  {revealedClues.length} clues revealed
                </div>
              </div>
            </div>
            {!allCluesRevealed && (
              <button
                onClick={advanceDay}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm"
              >
                Next Day (Demo)
              </button>
            )}
          </div>

          {/* Clues */}
          <div className="space-y-3 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-400" />
              Investigation Clues
            </h2>

            {selectedMystery.clues.map((clue, idx) => (
              <ClueReveal
                key={idx}
                clue={clue}
                isRevealed={clue.day <= currentDay}
                isNew={clue.day === currentDay}
              />
            ))}
          </div>

          {/* Theory Form or Solution */}
          {isComplete ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <Trophy size={48} className="mx-auto text-amber-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-800">Mystery Solved!</h3>
                <div className="text-3xl font-bold text-amber-600 mt-2">
                  {completedMysteries[selectedMystery.id]} points
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">The Solution</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Outbreak:</span> <span className="font-medium text-slate-800">{selectedMystery.solution.outbreak}</span></div>
                  <div><span className="text-slate-500">Year:</span> <span className="font-medium text-slate-800">{selectedMystery.solution.year}</span></div>
                  <div><span className="text-slate-500">Location:</span> <span className="font-medium text-slate-800">{selectedMystery.solution.location}</span></div>
                  <div><span className="text-slate-500">Pathogen:</span> <span className="font-medium text-slate-800">{selectedMystery.solution.pathogen}</span></div>
                  <div><span className="text-slate-500">Source:</span> <span className="font-medium text-slate-800">{selectedMystery.solution.source}</span></div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">EIS Officers Involved</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMystery.solution.eis_officers_involved.map(officer => (
                    <span key={officer} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {officer}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <TheoryForm
                existingTheory={existingTheory?.theory}
                onSubmit={handleSubmitTheory}
              />

              {/* Reveal solution button (available on day 3) */}
              {allCluesRevealed && existingTheory && (
                <button
                  onClick={handleRevealSolution}
                  className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
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

  // Mystery selection view
  return (
    <GameShell
      theme="detective"
      heroTitle="Where in the World is Patient Zero?"
      heroSubtitle="Solve historic outbreak mysteries"
      backPath="/"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Intro */}
        <div className="bg-white/95 rounded-xl p-6 shadow-lg mb-6">
          <p className="text-slate-700 leading-relaxed">
            Put on your detective hat! New clues are revealed twice daily. Study the evidence,
            form your theory, and identify the outbreak. Submit early for bonus points, but
            beware - more clues mean more competition!
          </p>
        </div>

        {/* Current Day Indicator */}
        <div className="bg-slate-800/80 rounded-xl p-4 mb-6 flex items-center gap-4">
          <Clock size={32} className="text-amber-400" />
          <div>
            <div className="text-white font-bold text-lg">Day {currentDay}</div>
            <div className="text-slate-400 text-sm">
              {currentDay < 3 ? 'More clues coming soon...' : 'All clues revealed!'}
            </div>
          </div>
        </div>

        {/* Mystery Grid */}
        <h2 className="text-xl font-bold text-white mb-4">Active Mysteries</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mysteries.map(mystery => (
            <MysteryCard
              key={mystery.id}
              mystery={mystery}
              currentDay={currentDay}
              isComplete={!!completedMysteries[mystery.id]}
              score={completedMysteries[mystery.id]}
              onStart={handleSelectMystery}
            />
          ))}
        </div>

        {/* Total Score */}
        {Object.keys(completedMysteries).length > 0 && (
          <div className="mt-6 bg-amber-500/90 text-white rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={28} />
              <div>
                <div className="text-sm opacity-80">Total Score</div>
                <div className="text-2xl font-bold">
                  {Object.values(completedMysteries).reduce((a, b) => a + b, 0)} pts
                </div>
              </div>
            </div>
            <div className="text-sm opacity-80">
              {Object.keys(completedMysteries).length} / {mysteries.length} solved
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}

export default PatientZero;
