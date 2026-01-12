// src/components/command/TutorialOverlay.tsx
// Tutorial for first-time Outbreak Command players

import { useState } from 'react';
import { X, Target, DollarSign, MapPin, Clock, CheckCircle, Zap } from 'lucide-react';

interface TutorialOverlayProps {
  onDismiss: () => void;
  scenarioName: string;
}

const TUTORIAL_STEPS = [
  {
    title: "Your Mission",
    icon: Target,
    content: "Contain the outbreak before cases exceed the threshold. Identify the source and reduce transmission to win.",
  },
  {
    title: "Watch the Map",
    icon: MapPin,
    content: "Red circles show outbreak locations. Larger circles = more cases. Watch for spread to new states as time passes.",
  },
  {
    title: "Manage Resources",
    icon: DollarSign,
    content: "Each action costs money and takes time. Budget wisely - if you run out of funds, the response fails.",
  },
  {
    title: "Take Action",
    icon: Zap,
    content: "Click 'Execute Action' to deploy responses. Some take multiple days to complete. Watch the progress bars.",
  },
  {
    title: "Time Matters",
    icon: Clock,
    content: "The outbreak grows each day. Act fast! Use the pause button (⏸️) to plan your next move without pressure.",
  }
];

export function TutorialOverlay({ onDismiss, scenarioName }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);
  const currentStep = TUTORIAL_STEPS[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">How to Play</h2>
            <button
              onClick={onDismiss}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close tutorial"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-blue-100 mt-1">{scenarioName}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
              <Icon size={28} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {step + 1}. {currentStep.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {currentStep.content}
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {TUTORIAL_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === step
                    ? 'bg-blue-600 scale-110'
                    : idx < step
                      ? 'bg-blue-300'
                      : 'bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            )}
            {step < TUTORIAL_STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onDismiss}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Start Response!
              </button>
            )}
          </div>
        </div>

        {/* Skip option */}
        <div className="border-t border-slate-200 p-4 text-center bg-slate-50">
          <button
            onClick={onDismiss}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Skip tutorial (I know how to play)
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorialOverlay;
