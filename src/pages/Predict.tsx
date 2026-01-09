// src/pages/Predict.tsx
// Predict the Outbreak - Epidemiological forecasting game

import { useState } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { EpiCurveChart } from '../components/predict/EpiCurveChart';
import { PredictionForm } from '../components/predict/PredictionForm';
import { predictionScenarios, calculatePredictionScore } from '../data/predict-data';
import type { PredictionScenario } from '../types/predict';
import { ArrowLeft, Trophy, Target, BarChart3 } from 'lucide-react';

export function Predict() {
  const [selectedScenario, setSelectedScenario] = useState<PredictionScenario | null>(null);
  const [predictions, setPredictions] = useState<Record<string, { peak_week: number; total_cases: number; score: number }>>({});
  const [showResult, setShowResult] = useState(false);

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

  // Scenario detail view
  if (selectedScenario) {
    const existingPrediction = predictions[selectedScenario.id];

    return (
      <GameShell
        theme="detective"
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
      theme="detective"
      heroTitle="Predict the Outbreak"
      heroSubtitle="Test your epidemiological forecasting skills"
      backPath="/"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Intro */}
        <div className="bg-white/95 rounded-xl p-6 shadow-lg mb-6">
          <p className="text-slate-700 leading-relaxed">
            Can you predict how an outbreak will unfold? Study the early epidemic curve,
            then forecast the peak week and total cases. The closer your prediction,
            the higher your score!
          </p>
        </div>

        {/* Scenario List */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target size={20} />
          Available Scenarios
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
          <div className="mt-6 bg-amber-500/90 text-white rounded-xl p-4 flex items-center justify-between">
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

export default Predict;
