// src/components/outbreak-network/ScoreScreen.tsx
// Results screen with score breakdown and teaching moment

import { Trophy, Target, Zap, Clock, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NetworkScore } from '../../data/outbreak-network-data';

interface ScoreScreenProps {
  score: NetworkScore;
  factoid: string;
  highScore: number;
  isNewHighScore: boolean;
  elapsedSeconds: number;
  onPlayAgain: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ScoreScreen({ score, factoid, highScore, isNewHighScore, elapsedSeconds, onPlayAgain }: ScoreScreenProps) {
  return (
    <div className="max-w-md mx-auto px-4 py-6 animate-slideUp">
      {/* Result header */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-3 ${
          score.correct
            ? 'bg-green-100 text-green-600 ring-2 ring-green-300'
            : 'bg-red-100 text-red-600 ring-2 ring-red-300'
        }`}>
          {score.correct ? <Trophy size={36} /> : <Target size={36} />}
        </div>
        <h2 className="text-2xl font-bold text-slate-800" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
          {score.correct ? 'Patient Zero Found!' : 'Wrong Suspect'}
        </h2>
        <p className="text-slate-600 mt-1 text-sm font-medium">
          {score.correct
            ? 'Excellent contact tracing work!'
            : 'The transmission chain told a different story.'}
        </p>
      </div>

      {/* Time */}
      <div className="flex items-center justify-center gap-2 mb-4 text-slate-700">
        <Clock size={18} className="text-slate-500" />
        <span className="text-lg font-bold font-mono">{formatTime(elapsedSeconds)}</span>
      </div>

      {/* Score breakdown */}
      <div className="bg-white/95 rounded-xl p-5 mb-4 border border-slate-200 shadow-lg">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              <Target size={16} className="text-blue-500" /> Accuracy
            </span>
            <span className="font-bold text-slate-900">{score.basePoints} pts</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              <Zap size={16} className="text-amber-500" /> Efficiency Bonus
            </span>
            <span className="font-bold text-slate-900">+{score.efficiencyBonus} pts</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              <Clock size={16} className="text-green-500" /> Speed Bonus
            </span>
            <span className="font-bold text-slate-900">+{score.timeBonus} pts</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900">Total Score</span>
            <span className="text-2xl font-bold text-amber-600">{score.totalScore}</span>
          </div>
        </div>

        {isNewHighScore && (
          <div className="mt-3 bg-amber-50 border border-amber-300 rounded-lg p-2 text-center">
            <span className="text-amber-700 text-sm font-bold">New High Score!</span>
          </div>
        )}

        {!isNewHighScore && highScore > 0 && (
          <div className="mt-3 text-center text-xs text-slate-500 font-medium">
            High Score: {highScore}
          </div>
        )}
      </div>

      {/* Teaching moment */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm">
        <h3 className="text-sm font-bold text-blue-800 mb-1">Did You Know?</h3>
        <p className="text-sm text-blue-900 leading-relaxed">{factoid}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onPlayAgain}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
        >
          <RotateCcw size={18} />
          Play Again
        </button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
        >
          <Home size={18} />
        </Link>
      </div>
    </div>
  );
}
