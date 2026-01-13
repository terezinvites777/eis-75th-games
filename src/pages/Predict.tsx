// src/pages/Predict.tsx
// Predict the Outbreak - Epidemiological forecasting game with live challenge
// Styled to match Disease Detective aesthetic

import { useState } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { EpiCurveChart } from '../components/predict/EpiCurveChart';
import { PredictionForm, EnhancedPredictionForm } from '../components/predict/PredictionForm';
import { CurveDrawer } from '../components/predict/CurveDrawer';
import { EpiStatsBar } from '../components/predict/EpiStatsBar';
import { LiveChallengeBanner } from '../components/predict/LiveChallengeBanner';
import { Confetti } from '../components/patient-zero/Confetti';
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
  Activity,
  RotateCcw,
  Zap,
  AlertCircle,
  MapPin,
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
  // Confetti celebration
  const [showConfetti, setShowConfetti] = useState(false);

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

    // Trigger confetti celebration!
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  // Live Challenge View
  if (showLiveChallenge) {
    return (
      <GameShell
        theme="predict"
        heroTitle="Mystery Outbreak 2026"
        heroSubtitle="Live Conference Challenge"
        showNav={true}
      >
        {/* Confetti celebration */}
        <Confetti active={showConfetti} />

        <div className="px-4 py-6 max-w-3xl mx-auto animate-slide-up">
          {/* Back button */}
          <button
            onClick={() => setShowLiveChallenge(false)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Scenarios
          </button>

          {/* Live Challenge Banner - Compact */}
          <LiveChallengeBanner
            day={currentDay}
            totalDays={4}
            weeksAvailable={visibleLiveData.length}
            nextRelease={nextRelease}
            onSkipDay={DEV_MODE ? advanceDay : undefined}
            isCompact
          />

          {/* Scenario Info Card */}
          <div className="panel relative overflow-hidden mt-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]" />
            <div className="flex items-start gap-3 pt-1">
              <div className="p-2 rounded-lg bg-[var(--theme-surface)]">
                <Sparkles size={20} className="text-[var(--theme-primary)]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-800">{MYSTERY_OUTBREAK_2026.title}</h2>
                <p className="text-slate-600 text-sm mt-1">{MYSTERY_OUTBREAK_2026.description}</p>
                <div className="flex gap-2 mt-3">
                  <span className="pill" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                    <AlertCircle size={12} />
                    {MYSTERY_OUTBREAK_2026.pathogen}
                  </span>
                  <span className="pill">
                    <MapPin size={12} />
                    {MYSTERY_OUTBREAK_2026.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Epi Stats Bar */}
          <EpiStatsBar data={visibleLiveData} className="mt-4" variant="dark" />

          {/* MAIN FEATURE: Curve Drawer */}
          <div className="mt-4">
            <CurveDrawer
              historicalData={visibleLiveData}
              maxWeek={20}
              maxCases={Math.max(...visibleLiveData.map(d => d.cases)) * 6}
              onCurveChange={setDrawnCurve}
            />
          </div>

          {/* Show actual outcome after results revealed */}
          {resultsRevealed && (
            <div className="mt-4 panel relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <div className="section-header mb-3 pt-1">
                <Activity size={16} className="text-green-600" />
                <span className="section-title text-green-700">Actual Outbreak Data Revealed!</span>
              </div>
              <EpiCurveChart
                historicalData={visibleLiveData}
                actualData={MYSTERY_OUTBREAK_2026.full_data.slice(visibleLiveData.length)}
                showActual={true}
                height={180}
              />
            </div>
          )}

          {/* Prediction Form or Results */}
          <div className="mt-6">
            {liveScore && livePrediction ? (
              <div className="panel relative overflow-hidden">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

                <div className="text-center mb-6 pt-2">
                  <div className="relative inline-block">
                    <Trophy size={56} className="text-amber-500 drop-shadow-lg animate-score-pop" />
                    <div className="absolute -inset-3 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mt-3">Prediction Submitted!</h3>
                  <div className="text-4xl font-bold text-gradient-gold mt-2 animate-score-pop">
                    {liveScore.totalScore} points
                  </div>
                  {liveScore.earlyBonus.multiplier > 1 && (
                    <div className="mt-2">
                      <span className="pill pill-gold">
                        <Zap size={14} />
                        Includes {liveScore.earlyBonus.multiplier}x early bonus!
                      </span>
                    </div>
                  )}
                </div>

                {/* Score Breakdown */}
                <div className="space-y-2 mb-6 stagger-children">
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
                  className="btn-emboss btn-emboss-primary btn-emboss-lg w-full"
                >
                  <RotateCcw size={18} />
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
        showNav={true}
      >
        <div className="px-4 py-6 max-w-2xl mx-auto animate-slide-up">
          {/* Back button */}
          <button
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Scenarios
          </button>

          {/* Scenario info */}
          <div className="panel relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]" />
            <div className="pt-1">
              <h2 className="text-xl font-bold text-slate-800">{selectedScenario.title}</h2>
              <p className="text-slate-600 mt-2">{selectedScenario.description}</p>
              <div className="flex gap-2 mt-4">
                <span className="pill" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  {selectedScenario.pathogen}
                </span>
                <span className="pill">
                  {selectedScenario.location}
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6">
            <div className="section-header mb-3">
              <BarChart3 size={18} className="text-[var(--theme-primary)]" />
              <span className="section-title">Epidemic Curve</span>
              <div className="section-header-line" />
            </div>
            <div className="panel !p-4">
              <EpiCurveChart
                historicalData={selectedScenario.historical_data}
                actualData={showResult ? selectedScenario.actual_outcome : undefined}
                showActual={showResult}
                height={250}
              />
            </div>
          </div>

          {/* Prediction Form or Results */}
          <div className="mt-6">
            {showResult && existingPrediction ? (
              <div className="panel relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                <div className="text-center mb-6 pt-2">
                  <Trophy size={48} className="mx-auto text-amber-500 mb-3 animate-score-pop" />
                  <h3 className="text-xl font-bold text-slate-800">Prediction Results</h3>
                  <div className="text-3xl font-bold text-gradient-gold mt-2 animate-score-pop">
                    {existingPrediction.score} points
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="stat-card">
                    <div className="stat-value text-[var(--theme-primary)]">Week {existingPrediction.peak_week}</div>
                    <div className="stat-label">Your Peak Week</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Actual: Week {selectedScenario.peak_week}
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value text-amber-600">
                      {existingPrediction.total_cases.toLocaleString()}
                    </div>
                    <div className="stat-label">Your Total Cases</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Actual: {selectedScenario.total_cases.toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedScenario(null)}
                  className="btn-emboss btn-emboss-primary btn-emboss-lg w-full mt-6"
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
      <div className="px-4 py-6 max-w-4xl mx-auto animate-slide-up">
        {/* Live Challenge Banner */}
        <LiveChallengeBanner
          day={currentDay}
          totalDays={4}
          weeksAvailable={visibleLiveData.length}
          nextRelease={nextRelease}
          onClick={() => setShowLiveChallenge(true)}
        />

        {/* How It Works */}
        <div className="panel mt-6">
          <div className="section-header mb-3">
            <Target size={18} className="text-[var(--theme-primary)]" />
            <span className="section-title">How It Works</span>
            <div className="section-header-line" />
          </div>
          <div className="space-y-2 text-slate-700 text-sm">
            <p>📊 <strong>Study:</strong> Analyze the early epidemic curve and available data</p>
            <p>🎯 <strong>Predict:</strong> Forecast when the outbreak will peak and total cases</p>
            <p>⏰ <strong>Early Bonus:</strong> Submit early for score multipliers (Day 1: 2x, Day 2: 1.5x)</p>
            <p>🏆 <strong>Score:</strong> Points based on accuracy - the closer your prediction, the higher your score!</p>
          </div>
        </div>

        {/* Practice Scenarios */}
        <div className="mt-6">
          <div className="section-header mb-4">
            <BarChart3 size={18} className="text-[var(--theme-primary)]" />
            <span className="section-title">Practice Scenarios</span>
            <div className="section-header-line" />
          </div>

          <div className="space-y-4 stagger-children">
            {predictionScenarios.map(scenario => {
              const prediction = predictions[scenario.id];
              const isComplete = !!prediction;

              return (
                <div
                  key={scenario.id}
                  onClick={() => handleSelectScenario(scenario)}
                  className={`game-card ${isComplete ? 'border-green-300' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{scenario.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{scenario.description}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="pill text-xs" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                          {scenario.pathogen}
                        </span>
                        <span className="pill text-xs">
                          {scenario.location}
                        </span>
                      </div>
                    </div>

                    {isComplete && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gradient-gold">{prediction.score}</div>
                        <div className="text-xs text-slate-500">points</div>
                      </div>
                    )}
                  </div>

                  {/* Mini chart preview */}
                  <div className="mt-4 h-16 bg-[var(--theme-surface)] rounded-lg flex items-end px-2 gap-1">
                    {scenario.historical_data.map((d, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[var(--theme-primary)] rounded-t opacity-60"
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
        </div>

        {/* Total Score */}
        {Object.keys(predictions).length > 0 && (
          <div className="mt-6 panel-themed flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={28} className="text-amber-500" />
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Total Score</div>
                <div className="text-2xl font-bold text-gradient-gold">{totalScore} pts</div>
              </div>
            </div>
            <div className="pill">
              {Object.keys(predictions).length} / {predictionScenarios.length} completed
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}

// Helper component for score breakdown row - light theme with brand styling
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
    <div className={`stat-card !p-3 ${isGood ? '!border-green-200' : '!border-amber-200'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <div className="flex items-center gap-2">
          <div className="progress-bar h-1.5 w-16">
            <div
              className={`h-full rounded-full ${isGood ? 'bg-green-500' : 'bg-amber-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className={`font-bold text-sm ${isGood ? 'text-green-600' : 'text-amber-600'}`}>
            +{points}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--theme-primary)]">You: {predicted}</span>
        <span className="text-slate-400">Actual: {actual}</span>
      </div>
    </div>
  );
}

export default Predict;
