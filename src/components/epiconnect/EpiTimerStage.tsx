// src/components/epiconnect/EpiTimerStage.tsx
// Ceremonial timer stage for Speed Networking

import type { ReactNode } from 'react';

interface EpiTimerStageProps {
  minutes: number;
  seconds: number;
  label?: string;
  rules?: string;
  actions?: ReactNode;
}

export function EpiTimerStage({
  minutes,
  seconds,
  label = 'Speed Round',
  rules,
  actions,
}: EpiTimerStageProps) {
  const totalSeconds = minutes * 60 + seconds;
  const timeClass =
    totalSeconds <= 30
      ? 'epi-timerStage__time--danger'
      : totalSeconds <= 60
      ? 'epi-timerStage__time--warning'
      : '';

  const formatTime = (m: number, s: number) => {
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="epi-timerStage">
      <div className="epi-timerStage__label">{label}</div>
      <div className={`epi-timerStage__time ${timeClass}`}>
        {formatTime(minutes, seconds)}
      </div>
      {rules && <div className="epi-timerStage__rules">{rules}</div>}
      {actions && <div className="epi-timerStage__actions">{actions}</div>}
    </div>
  );
}

export default EpiTimerStage;
