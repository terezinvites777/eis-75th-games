// src/components/command/TutorialOverlay.tsx
// Tutorial for first-time Outbreak Command players

import { useState } from 'react';
import { X, Target, DollarSign, MapPin, Clock, CheckCircle, Zap, Play, AlertTriangle } from 'lucide-react';

interface TutorialOverlayProps {
  onDismiss: () => void;
  scenarioName: string;
}

const TUTORIAL_STEPS = [
  {
    title: "Your Mission",
    icon: Target,
    content: "Contain the outbreak before cases exceed the critical threshold. Identify the source of the outbreak and reduce transmission to win. If cases or deaths climb too high, the response fails.",
  },
  {
    title: "Press ▶ Play to Start",
    icon: Play,
    content: "After this tutorial, read the mission briefing and tap \"Start Response.\" The game begins PAUSED — you must press the ▶ Play button in the top-left corner to start the clock. Time only moves when Play is active.",
  },
  {
    title: "Alerts Pause the Game",
    icon: AlertTriangle,
    content: "Random events (media inquiries, supply shortages, new clusters) will pop up and pause the game automatically. Read the alert, choose your response, then press ▶ Play again to resume. The clock stays frozen until you press Play.",
  },
  {
    title: "Take Action",
    icon: Zap,
    content: "Use the action panel on the right to deploy responses — field teams, lab testing, quarantines, and more. Each action costs budget and takes several days to complete. Watch the progress bars to see when actions finish.",
  },
  {
    title: "Manage Resources",
    icon: DollarSign,
    content: "Every action costs money. If your budget runs out, you can't deploy new responses. Prioritize high-impact actions early. The stats panel on the left tracks your budget, cases, deaths, and R₀.",
  },
  {
    title: "Watch the Map",
    icon: MapPin,
    content: "Red circles on the map show outbreak locations. Larger circles mean more cases. The outbreak spreads to new states over time — act fast to contain it before it goes nationwide.",
  },
  {
    title: "Use Pause to Plan",
    icon: Clock,
    content: "Press ⏸ Pause any time to freeze the clock and plan your next move without pressure. Use ⏩ Fast Forward to speed up time while waiting for actions to complete. Remember: after every alert, press ▶ Play to resume!",
  },
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
