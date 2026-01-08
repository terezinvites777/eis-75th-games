import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Star, Trophy } from 'lucide-react';
import { MobileFrame } from '../components/layout';
import { EraSelector } from '../components/game';
import { Card } from '../components/ui';
import type { Era } from '../types/game';
import { useGameStore } from '../store/gameStore';

export function DetectiveHub() {
  const navigate = useNavigate();
  const { completedCases, streak } = useGameStore();

  const handleSelectEra = (era: Era) => {
    navigate(`/detective/${era}`);
  };

  return (
    <MobileFrame showNavigation={true}>
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
            <h1 className="text-2xl font-bold text-gray-900">Disease Detective</h1>
            <p className="text-gray-500">Solve outbreak mysteries</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card padding="sm" className="text-center">
              <Search className="w-5 h-5 mx-auto mb-1 text-cdc-blue" />
              <p className="text-lg font-bold text-gray-900">{completedCases.length}</p>
              <p className="text-xs text-gray-500">Cases Solved</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card padding="sm" className="text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <p className="text-lg font-bold text-gray-900">{streak}</p>
              <p className="text-xs text-gray-500">Win Streak</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card padding="sm" className="text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-500" />
              <p className="text-lg font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500">Eras</p>
            </Card>
          </motion.div>
        </div>

        {/* How to play */}
        <Card className="bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Search size={18} />
            How to Play
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>1. Choose an era from EIS history</li>
            <li>2. Review clues from real outbreak investigations</li>
            <li>3. Make your diagnosis before time runs out</li>
            <li>4. Learn how EIS officers solved the case</li>
          </ul>
        </Card>

        {/* Era selection */}
        <EraSelector
          onSelectEra={handleSelectEra}
          completedEras={[]}
        />
      </div>
    </MobileFrame>
  );
}
