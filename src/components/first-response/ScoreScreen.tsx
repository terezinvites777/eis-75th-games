// src/components/first-response/ScoreScreen.tsx
// Results screen with score breakdown and teaching moment

import { Trophy, Target, Clock, Zap, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { GameMode } from '../../types/first-response';

interface ScoreScreenProps {
  mode: GameMode;
  score: number;
  maxScore: number;
  totalTime: number;
  wrongTaps: number;
  teachingMoment: string;
  // Suit Up specific
  donningTime?: number;
  doffingTime?: number;
  donningErrors?: number;
  doffingErrors?: number;
  // First Response specific
  correctSteps?: number;
  totalSteps?: number;
  timeRemaining?: number;
  onPlayAgain: () => void;
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

export function ScoreScreen({
  mode,
  score,
  maxScore,
  totalTime,
  wrongTaps,
  teachingMoment,
  donningTime,
  doffingTime,
  donningErrors,
  doffingErrors,
  correctSteps,
  totalSteps,
  timeRemaining,
  onPlayAgain,
}: ScoreScreenProps) {
  const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const isGreat = accuracy >= 80;
  const isGood = accuracy >= 50;

  return (
    <div className="max-w-md mx-auto px-4 py-6 animate-slideUp">
      {/* Result header */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-3 ${
          isGreat ? 'bg-green-100 text-green-600 ring-2 ring-green-300'
          : isGood ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-300'
          : 'bg-red-100 text-red-600 ring-2 ring-red-300'
        }`}>
          {isGreat ? <Trophy size={36} /> : <Target size={36} />}
        </div>
        <h2 className="text-2xl font-bold text-slate-800" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
          {isGreat ? 'Excellent Response!' : isGood ? 'Good Effort!' : 'Keep Practicing!'}
        </h2>
        <p className="text-slate-600 mt-1 text-sm font-medium">
          {mode === 'suit-up' ? 'PPE Donning & Doffing Complete' : 'Investigation Sequence Complete'}
        </p>
      </div>

      {/* Time */}
      <div className="flex items-center justify-center gap-2 mb-4 text-slate-700">
        <Clock size={18} className="text-slate-500" />
        <span className="text-lg font-bold font-mono">{formatTime(totalTime)}</span>
      </div>

      {/* Score breakdown */}
      <div className="bg-white/95 rounded-xl p-5 mb-4 border border-slate-200 shadow-lg">
        <div className="space-y-3">
          {mode === 'suit-up' ? (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                  <Zap size={16} className="text-blue-500" /> Donning
                </span>
                <span className="text-sm text-slate-500">
                  {formatTime(donningTime ?? 0)} / {donningErrors ?? 0} error{(donningErrors ?? 0) !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                  <Zap size={16} className="text-red-500" /> Doffing
                </span>
                <span className="text-sm text-slate-500">
                  {formatTime(doffingTime ?? 0)} / {doffingErrors ?? 0} error{(doffingErrors ?? 0) !== 1 ? 's' : ''}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                  <Target size={16} className="text-green-500" /> Steps Correct
                </span>
                <span className="font-bold text-slate-900">{correctSteps} / {totalSteps}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                  <Clock size={16} className="text-blue-500" /> Time Remaining
                </span>
                <span className="font-bold text-slate-900">{timeRemaining}s</span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              Wrong Taps
            </span>
            <span className={`font-bold ${wrongTaps === 0 ? 'text-green-600' : 'text-red-600'}`}>
              {wrongTaps}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900">Score</span>
            <span className="text-2xl font-bold text-amber-600">{score} / {maxScore}</span>
          </div>
        </div>
      </div>

      {/* Teaching moment */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm">
        <h3 className="text-sm font-bold text-blue-800 mb-1">Did You Know?</h3>
        <p className="text-sm text-blue-900 leading-relaxed">{teachingMoment}</p>
      </div>

      {/* Post-game note for Mode 2 */}
      {mode === 'first-response' && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 mb-4 text-center">
          <p className="text-xs text-slate-600 italic">
            In practice, these steps often overlap — but knowing the framework keeps the investigation on track.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onPlayAgain}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
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
