// src/pages/Predict.tsx
// Predict the Outbreak - Epidemiological forecasting game with live challenge

import { useState } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { EpiCurveChart } from '../components/predict/EpiCurveChart';
import { PredictionForm, EnhancedPredictionForm } from '../components/predict/PredictionForm';
import { CurveDrawer } from '../components/predict/CurveDrawer';
import { EpiContext } from '../components/predict/EpiContext';
import { CountdownTimer } from '../components/patient-zero/CountdownTimer';
import { predictionScenarios, calculatePredictionScore } from '../data/predict-data';
import {
  MYSTERY_OUTBREAK_2026,
  getVisibleData,
  getCurrentDay,
  getNextDataRelease,
  isResultsRevealed,
  calculateEnhancedScore,
  DEV_MODE,
} from '../data/predict-schedule';
import type { PredictionScenario, DataPoint, EnhancedPrediction } from '../types/predict';
import type { EnhancedScoreBreakdown } from '../data/predict-schedule';
import {
  ArrowLeft,
  Trophy,
  Target,
  BarChart3,
  Sparkles,
  Calendar,
  Zap,
  TrendingUp,
  Radio,
} from 'lucide-react';

export function Predict() {
  const [selectedScenario, setSelectedScenario] = useState<PredictionScenario | null>(null);
  const [predictions, setPredictions] = useState<Record<string, { peak_week: number; total_cases: number; score: number }>>({});
  const [showResult, setShowResult] = useState(false);

  // Live challenge state
  const [showLiveChallenge, setShowLiveChallenge] = useState(false);
  const [currentDay, setCurrentDay] = useState(getCurrentDay());
  const [livePrediction, setLivePrediction] = useState<EnhancedPrediction | null>(null);
  const [liveScore, setLiveScore] = useState<EnhancedScoreBreakdown | null>(null);
  // Drawn curve - collected for future curve-based scoring
  const [, setDrawnCurve] = useState<DataPoint[]>([]);

  // Get visible data for live challenge
  const visibleLiveData = getVisibleData(MYSTERY_OUTBREAK_2026, currentDay);
  const nextRelease = getNextDataRelease(MYSTERY_OUTBREAK_2026);
  const resultsRevealed = isResultsRevealed(MYSTERY_OUTBREAK_2026);

  // Dev mode day advancement
  const advanceDay = () => {
    if (DEV_MODE && currentDay < 4) {
      setCurrentDay(prev => prev + 1);
    }
  };

  const handleSelectScenario = (scenario: PredictionScenario) => {
    setSelectedScenario(scenario);
    setShowResult(false);
  };

  const handleSubmitPrediction = (prediction: { peak_week: number; total_cases: number }) => {
    if (!selectedScenario) return;

    const score = calculatePredictionScore(
      prediction,
      { peak_week: selectedScenario.peak_week, total_cases: selectedScenario.total_cases }
    );

    setPredictions(prev => ({
      ...prev,
      [selectedScenario.id]: { ...prediction, score },
    }));

    setShowResult(true);
  };

  // Handle live challenge prediction
  const handleLivePrediction = (prediction: EnhancedPrediction) => {
    setLivePrediction(prediction);

    // Calculate score
    const breakdown = calculateEnhancedScore(prediction, MYSTERY_OUTBREAK_2026, currentDay);
    setLiveScore(breakdown);
  };

  // Live Challenge View
  if (showLiveChallenge) {
    return (
      <GameShell
        theme="predict"
        heroTitle="Mystery Outbreak 2026"
        heroSubtitle="Live Conference Challenge"
        showNav={false}
      >
        <div className="px-4 py-6 max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setShowLiveChallenge(false)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Scenarios
          </button>

          {/* Live badge */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Radio size={24} className="text-white" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
              <div>
                <div className="text-white font-bold">LIVE CHALLENGE</div>
                <div className="text-red-100 text-sm">New data releases throughout the conference</div>
              </div>
            </div>
            {DEV_MODE && currentDay < 4 && (
              <button
                onClick={advanceDay}
                className="px-3 py-1.5 bg-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/30"
              >
                Skip to Day {currentDay + 1}
              </button>
            )}
          </div>

          {/* Data Progress */}
          <div className="bg-slate-800/80 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white">
                <Calendar size={18} className="text-blue-400" />
                <span className="font-semibold">Day {currentDay} of 4</span>
              </div>
              <span className="text-slate-400 text-sm">
                {visibleLiveData.length} weeks of data available
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                style={{ width: `${(visibleLiveData.length / MYSTERY_OUTBREAK_2026.full_data.length) * 100}%` }}
              />
            </div>
            {nextRelease && !resultsRevealed && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-slate-400 text-sm">Next data release:</span>
                <CountdownTimer
                  targetDate={nextRelease}
                  label="New Data"
                  variant="compact"
                  onComplete={() => setCurrentDay(getCurrentDay())}
                />
              </div>
            )}
          </div>

          {/* Scenario Info */}
          <div className="bg-white/95 rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              {MYSTERY_OUTBREAK_2026.title}
            </h2>
            <p className="text-slate-600 mt-2">{MYSTERY_OUTBREAK_2026.description}</p>
            <div className="flex gap-3 mt-4">
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                {MYSTERY_OUTBREAK_2026.pathogen}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                {MYSTERY_OUTBREAK_2026.location}
              </span>
            </div>
          </div>

          {/* Epidemiological Context */}
          <div className="mb-6">
            <EpiContext
              data={visibleLiveData}
              pathogen={resultsRevealed ? 'Novel Respiratory Virus' : undefined}
              transmissionRoute={MYSTERY_OUTBREAK_2026.transmission_route}
              incubationPeriod={MYSTERY_OUTBREAK_2026.incubation_period}
            />
          </div>

          {/* Curve Drawer */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp size={20} />
              Draw Your Epidemic Curve
            </h3>
            <CurveDrawer
              historicalData={visibleLiveData}
              maxWeek={20}
              maxCases={Math.max(...visibleLiveData.map(d => d.cases)) * 6}
              onCurveChange={setDrawnCurve}
            />
          </div>

          {/* Standard Chart View */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <BarChart3 size={20} />
              Surveillance Data
            </h3>
            <EpiCurveChart
              historicalData={visibleLiveData}
              actualData={resultsRevealed ? MYSTERY_OUTBREAK_2026.full_data.slice(visibleLiveData.length) : undefined}
              showActual={resultsRevealed}
              height={220}
            />
          </div>

          {/* Prediction Form or Results */}
          {liveScore && livePrediction ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <Trophy size={48} className="mx-auto text-amber-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-800">Prediction Submitted!</h3>
                <div className="text-3xl font-bold text-amber-600 mt-2">
                  {liveScore.totalScore} points
                </div>
                {liveScore.earlyBonus.multiplier > 1 && (
                  <div className="text-green-600 text-sm mt-1 flex items-center justify-center gap-1">
                    <Zap size={14} />
                    Includes {liveScore.earlyBonus.multiplier}x early bonus!
                  </div>
                )}
              </div>

              {/* Score Breakdown */}
              <div className="space-y-2 mb-6">
                <ScoreRow label="Peak Week" points={liveScore.peakWeek.points} max={liveScore.peakWeek.maxPoints} predicted={`Week ${livePrediction.peak_week}`} actual={`Week ${MYSTERY_OUTBREAK_2026.peak_week}`} />
                <ScoreRow label="Peak Cases" points={liveScore.peakCases.points} max={liveScore.peakCases.maxPoints} predicted={livePrediction.peak_cases.toLocaleString()} actual={MYSTERY_OUTBREAK_2026.peak_cases.toLocaleString()} />
                <ScoreRow label="Total Cases" points={liveScore.totalCases.points} max={liveScore.totalCases.maxPoints} predicted={livePrediction.total_cases.toLocaleString()} actual={MYSTERY_OUTBREAK_2026.total_cases.toLocaleString()} />
                <ScoreRow label="Duration" points={liveScore.duration.points} max={liveScore.duration.maxPoints} predicted={`${livePrediction.duration_weeks} weeks`} actual={`${MYSTERY_OUTBREAK_2026.full_data.length} weeks`} />
                {livePrediction.r0_estimate && (
                  <ScoreRow label="R₀ Estimate" points={liveScore.r0Bonus.points} max={liveScore.r0Bonus.maxPoints} predicted={livePrediction.r0_estimate.toFixed(1)} actual={MYSTERY_OUTBREAK_2026.r0_estimate.toFixed(1)} />
                )}
              </div>

              <button
                onClick={() => {
                  setLivePrediction(null);
                  setLiveScore(null);
                }}
                className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-900"
              >
                Update Prediction
              </button>
            </div>
          ) : (
            <EnhancedPredictionForm
              visibleData={visibleLiveData}
              onSubmit={handleLivePrediction}
              dayNumber={currentDay}
            />
          )}
        </div>
      </GameShell>
    );
  }

  // Scenario detail view
  if (selectedScenario) {
    const existingPrediction = predictions[selectedScenario.id];

    return (
      <GameShell
        theme="predict"
        heroTitle="Predict the Outbreak"
        heroSubtitle={selectedScenario.title}
        showNav={false}
      >
        <div className="px-4 py-6 max-w-2xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Scenarios
          </button>

          {/* Scenario info */}
          <div className="bg-white/95 rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-slate-800">{selectedScenario.title}</h2>
            <p className="text-slate-600 mt-2">{selectedScenario.description}</p>
            <div className="flex gap-3 mt-4">
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                {selectedScenario.pathogen}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                {selectedScenario.location}
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <BarChart3 size={20} />
              Epidemic Curve
            </h3>
            <EpiCurveChart
              historicalData={selectedScenario.historical_data}
              actualData={showResult ? selectedScenario.actual_outcome : undefined}
              showActual={showResult}
              height={250}
            />
          </div>

          {/* Prediction Form or Results */}
          {showResult && existingPrediction ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <Trophy size={48} className="mx-auto text-amber-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-800">Prediction Results</h3>
                <div className="text-3xl font-bold text-amber-600 mt-2">
                  {existingPrediction.score} points
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-slate-500">Your Peak Week</div>
                  <div className="text-2xl font-bold text-blue-600">Week {existingPrediction.peak_week}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Actual: Week {selectedScenario.peak_week}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-slate-500">Your Total Cases</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {existingPrediction.total_cases.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Actual: {selectedScenario.total_cases.toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedScenario(null)}
                className="mt-6 w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-900"
              >
                Try Another Scenario
              </button>
            </div>
          ) : (
            <PredictionForm
              scenario={selectedScenario}
              onSubmit={handleSubmitPrediction}
            />
          )}
        </div>
      </GameShell>
    );
  }

  // Scenario selection view
  const totalScore = Object.values(predictions).reduce((sum, p) => sum + p.score, 0);

  return (
    <GameShell
      theme="predict"
      heroTitle="Predict the Outbreak"
      heroSubtitle="Test your epidemiological forecasting skills"
      backPath="/"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Live Challenge Banner */}
        <div
          onClick={() => setShowLiveChallenge(true)}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-1 shadow-xl mb-6 cursor-pointer hover:shadow-2xl transition-shadow"
        >
          <div className="bg-slate-900/95 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Sparkles size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="text-red-400 text-sm font-semibold uppercase tracking-wide">
                    Live Conference Challenge
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mystery Outbreak 2026</h3>
                <p className="text-slate-400 text-sm mb-4">
                  A novel pathogen is emerging. New surveillance data released daily during the conference. Can you predict how it will unfold?
                </p>

                {/* Progress indicator */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2 transition-all"
                      style={{ width: `${(currentDay / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-slate-400 text-sm">Day {currentDay}/4</span>
                </div>

                <div className="flex items-center gap-4">
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg">
                    Enter Challenge
                  </button>
                  {currentDay <= 2 && (
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <Zap size={14} />
                      {currentDay === 1 ? '2x' : '1.5x'} early prediction bonus active!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Countdown to next data */}
            {nextRelease && currentDay < 4 && (
              <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                <span className="text-slate-400 text-sm">Next data release:</span>
                <CountdownTimer
                  targetDate={nextRelease}
                  label="New Data"
                  variant="compact"
                  onComplete={() => setCurrentDay(getCurrentDay())}
                />
              </div>
            )}
          </div>
        </div>

        {/* Intro */}
        <div className="bg-white/95 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Target size={20} className="text-blue-600" />
            How It Works
          </h2>
          <div className="space-y-2 text-slate-700 text-sm">
            <p>📊 <strong>Study:</strong> Analyze the early epidemic curve and available data</p>
            <p>🎯 <strong>Predict:</strong> Forecast when the outbreak will peak and total cases</p>
            <p>⏰ <strong>Early Bonus:</strong> Submit early for score multipliers (Day 1: 2x, Day 2: 1.5x)</p>
            <p>🏆 <strong>Score:</strong> Points based on accuracy - the closer your prediction, the higher your score!</p>
          </div>
        </div>

        {/* Practice Scenarios */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          Practice Scenarios
        </h2>

        <div className="space-y-4">
          {predictionScenarios.map(scenario => {
            const prediction = predictions[scenario.id];
            const isComplete = !!prediction;

            return (
              <div
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario)}
                className={`
                  bg-white rounded-xl shadow-lg p-5 border-2 cursor-pointer transition-all hover:shadow-xl
                  ${isComplete ? 'border-green-300' : 'border-transparent hover:border-blue-300'}
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{scenario.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{scenario.description}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        {scenario.pathogen}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                        {scenario.location}
                      </span>
                    </div>
                  </div>

                  {isComplete && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-600">{prediction.score}</div>
                      <div className="text-xs text-slate-500">points</div>
                    </div>
                  )}
                </div>

                {/* Mini chart preview */}
                <div className="mt-4 h-16 bg-slate-50 rounded-lg flex items-end px-2 gap-1">
                  {scenario.historical_data.map((d, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-400 rounded-t"
                      style={{
                        height: `${(d.cases / Math.max(...scenario.historical_data.map(x => x.cases))) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Score */}
        {Object.keys(predictions).length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <Trophy size={28} />
              <div>
                <div className="text-sm opacity-80">Total Score</div>
                <div className="text-2xl font-bold">{totalScore} pts</div>
              </div>
            </div>
            <div className="text-sm opacity-80">
              {Object.keys(predictions).length} / {predictionScenarios.length} completed
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}

// Helper component for score breakdown row
function ScoreRow({
  label,
  points,
  max,
  predicted,
  actual,
}: {
  label: string;
  points: number;
  max: number;
  predicted: string;
  actual: string;
}) {
  const percentage = (points / max) * 100;
  const isGood = percentage >= 50;

  return (
    <div className={`rounded-lg border p-3 ${isGood ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className={`font-bold ${isGood ? 'text-green-600' : 'text-amber-600'}`}>
          +{points} / {max}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>You: {predicted}</span>
        <span>Actual: {actual}</span>
      </div>
    </div>
  );
}

export default Predict;
