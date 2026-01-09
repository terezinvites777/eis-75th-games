// src/pages/CommandHub.tsx
// Hub for Outbreak Command game mode

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Users, DollarSign, Clock, Lock, ChevronRight, Construction } from 'lucide-react';
import { GameShell } from '../components/layout/GameShell';

const missions = [
  {
    id: 'food-processing',
    title: 'Food Processing Plant Outbreak',
    description: 'A multi-state Salmonella outbreak linked to a food processing facility',
    difficulty: 'easy' as const,
    turns: 8,
    setting: 'Georgia, USA',
    pathogen: 'Salmonella',
    available: true,
  },
  {
    id: 'hospital-cre',
    title: 'Hospital CRE Response',
    description: 'Carbapenem-resistant Enterobacteriaceae spreading in an ICU',
    difficulty: 'medium' as const,
    turns: 10,
    setting: 'Los Angeles, CA',
    pathogen: 'CRE',
    available: true,
  },
  {
    id: 'respiratory-novel',
    title: 'Novel Respiratory Pathogen',
    description: 'Unknown respiratory illness emerging in a metropolitan area',
    difficulty: 'hard' as const,
    turns: 12,
    setting: 'Seattle, WA',
    pathogen: 'Unknown',
    available: false,
  },
  {
    id: 'international-response',
    title: 'International Outbreak Response',
    description: 'Coordinate response to a rapidly spreading outbreak across borders',
    difficulty: 'expert' as const,
    turns: 15,
    setting: 'West Africa',
    pathogen: 'Viral Hemorrhagic Fever',
    available: false,
  },
];

const difficultyConfig = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-700', icon: '🟢' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  hard: { label: 'Hard', color: 'bg-orange-100 text-orange-700', icon: '🟠' },
  expert: { label: 'Expert', color: 'bg-red-100 text-red-700', icon: '🔴' },
};

export function CommandHub() {
  const navigate = useNavigate();

  return (
    <GameShell 
      theme="command" 
      heroTitle="Outbreak Command" 
      heroSubtitle="Lead the response to emerging threats"
      backPath="/"
    >
      <div className="p-5 space-y-6">
        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel bg-blue-50 border-blue-200"
        >
          <div className="flex items-center gap-3">
            <Construction size={24} className="text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">Coming Soon</h3>
              <p className="text-sm text-blue-600">
                Outbreak Command is currently under development. Check back at the Summit!
              </p>
            </div>
          </div>
        </motion.div>

        {/* How to Play */}
        <div className="panel">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[var(--cdc-blue)]/10">
              <Target size={20} className="text-[var(--cdc-blue)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How to Play</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Choose a scenario from EIS history</li>
                <li>2. Manage limited resources each turn</li>
                <li>3. Make critical decisions under pressure</li>
                <li>4. Balance competing priorities to contain the outbreak</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Resource Legend */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-50">
            <DollarSign size={16} className="text-green-600" />
            <span className="text-gray-600">Budget</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-50">
            <Users size={16} className="text-blue-600" />
            <span className="text-gray-600">Personnel</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-50">
            <Target size={16} className="text-purple-600" />
            <span className="text-gray-600">Trust</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-50">
            <Clock size={16} className="text-orange-600" />
            <span className="text-gray-600">Time</span>
          </div>
        </div>

        {/* Mission List */}
        <div className="space-y-4">
          <div className="section-header">
            <span className="section-title">Available Scenarios</span>
            <div className="section-header-line" />
          </div>

          <div className="space-y-3">
            {missions.map((mission, index) => {
              const config = difficultyConfig[mission.difficulty];

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div
                    className={`game-card ${!mission.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => mission.available && navigate(`/command/${mission.id}`)}
                  >
                    {/* Status */}
                    <div className="absolute top-3 right-3">
                      {!mission.available ? (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <Lock size={16} className="text-gray-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <ChevronRight size={18} className="text-blue-600" />
                        </div>
                      )}
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                        {config.icon} {config.label}
                      </span>
                      <span className="text-xs text-gray-500">{mission.turns} turns</span>
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-gray-900 mb-1 pr-10">
                      {mission.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {mission.setting}
                    </p>
                    <p className="text-sm text-gray-600">
                      {mission.description}
                    </p>

                    {!mission.available && (
                      <p className="text-xs text-gray-400 mt-3">
                        Complete previous scenarios to unlock
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
}

export default CommandHub;
