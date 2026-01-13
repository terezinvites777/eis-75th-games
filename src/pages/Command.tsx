// src/pages/Command.tsx
// Outbreak Command - Epidemic response strategy game

import { useState } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { ScenarioCard } from '../components/command/ScenarioCard';
import { CommandGame } from '../components/command/CommandGame';
import { commandScenarios } from '../data/command-scenarios';
import type { CommandScenario } from '../types/command';

export function Command() {
  const [selectedScenario, setSelectedScenario] = useState<CommandScenario | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<Record<string, number>>({});

  const handleSelectScenario = (id: string) => {
    const scenario = commandScenarios.find(s => s.id === id);
    if (scenario) {
      setSelectedScenario(scenario);
    }
  };

  const handleGameComplete = (won: boolean, score: number) => {
    if (won && selectedScenario) {
      setCompletedScenarios(prev => ({
        ...prev,
        [selectedScenario.id]: Math.max(prev[selectedScenario.id] || 0, score),
      }));
    }
  };

  const handleBack = () => {
    setSelectedScenario(null);
  };

  // Show game if scenario selected
  if (selectedScenario) {
    return (
      <GameShell
        theme="command"
        heroTitle={selectedScenario.title}
        heroSubtitle="Outbreak Command"
        showNav={true}
      >
        <CommandGame
          scenario={selectedScenario}
          onComplete={handleGameComplete}
          onBack={handleBack}
        />
      </GameShell>
    );
  }

  // Show scenario selection
  return (
    <GameShell
      theme="command"
      heroTitle="Outbreak Command"
      heroSubtitle="Lead response operations under pressure!"
      backPath="/"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Intro */}
        <div className="bg-white/95 rounded-xl p-6 shadow-lg mb-6">
          <p className="text-slate-700 leading-relaxed">
            Take command of outbreak response operations. Make critical decisions, allocate
            resources, and lead your team through real-world epidemic scenarios. Each choice
            matters as you work to contain the outbreak before it's too late.
          </p>
        </div>

        {/* Scenario Grid */}
        <h2 className="text-xl font-bold text-white mb-4 text-shadow">Select a Scenario</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {commandScenarios.map(scenario => (
            <div key={scenario.id} className="relative">
              <ScenarioCard scenario={scenario} onSelect={handleSelectScenario} />
              {completedScenarios[scenario.id] && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
                  {completedScenarios[scenario.id]} pts
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        {Object.keys(completedScenarios).length > 0 && (
          <div className="mt-6 bg-slate-800/80 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-300">Scenarios Completed</div>
                <div className="text-2xl font-bold">
                  {Object.keys(completedScenarios).length} / {commandScenarios.length}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-300">Total Score</div>
                <div className="text-2xl font-bold text-amber-400">
                  {Object.values(completedScenarios).reduce((a, b) => a + b, 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}

export default Command;
