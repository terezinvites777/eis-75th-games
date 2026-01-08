import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Users, DollarSign, Clock } from 'lucide-react';
import { MobileFrame } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useGameStore } from '../store/gameStore';

const missions = [
  {
    id: 'mission-1',
    title: 'Foodborne Outbreak',
    description: 'A multi-state E. coli outbreak linked to a popular restaurant chain',
    difficulty: 'easy' as const,
    turns: 8,
    available: true,
  },
  {
    id: 'mission-2',
    title: 'Novel Respiratory Virus',
    description: 'An unknown respiratory illness emerging in a major metropolitan area',
    difficulty: 'medium' as const,
    turns: 12,
    available: true,
  },
  {
    id: 'mission-3',
    title: 'Global Pandemic Response',
    description: 'Coordinate international response to a rapidly spreading pathogen',
    difficulty: 'hard' as const,
    turns: 15,
    available: false,
  },
];

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export function CommandHub() {
  const navigate = useNavigate();
  const { completedMissions } = useGameStore();

  return (
    <MobileFrame>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Outbreak Command</h1>
            <p className="text-gray-500">Lead the response</p>
          </div>
        </div>

        {/* How to play */}
        <Card className="bg-purple-50 border-purple-200">
          <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <Target size={18} />
            How to Play
          </h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>1. Choose a mission scenario</li>
            <li>2. Manage resources: budget, personnel, time, and public trust</li>
            <li>3. Make critical decisions each turn</li>
            <li>4. Balance competing priorities to contain the outbreak</li>
          </ul>
        </Card>

        {/* Resource icons legend */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="flex flex-col items-center gap-1">
            <DollarSign size={16} className="text-green-600" />
            <span className="text-gray-600">Budget</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users size={16} className="text-blue-600" />
            <span className="text-gray-600">Personnel</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Target size={16} className="text-purple-600" />
            <span className="text-gray-600">Trust</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Clock size={16} className="text-orange-600" />
            <span className="text-gray-600">Time</span>
          </div>
        </div>

        {/* Mission list */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Available Missions</h2>

          {missions.map((mission, index) => {
            const isCompleted = completedMissions.includes(mission.id);

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  hoverable={mission.available}
                  className={`${!mission.available ? 'opacity-50' : ''}`}
                  onClick={() => mission.available && navigate(`/command/${mission.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[mission.difficulty]}`}>
                        {mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1)}
                      </span>
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                          Completed
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{mission.turns} turns</span>
                  </div>

                  <h3 className="font-bold text-gray-900">{mission.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{mission.description}</p>

                  {!mission.available && (
                    <p className="text-xs text-gray-400 mt-2">
                      Complete previous missions to unlock
                    </p>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MobileFrame>
  );
}
