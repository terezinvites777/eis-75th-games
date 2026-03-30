// src/components/patient-zero/CountdownTimer.tsx
// Countdown timer with brand styling

import { useState, useEffect } from 'react';
import { Clock, AlertCircle, Zap } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  label: string;
  onComplete?: () => void;
  variant?: 'default' | 'urgent' | 'compact';
}

export function CountdownTimer({ targetDate, label, onComplete, variant = 'default' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return null;

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const left = calculateTimeLeft();
      setTimeLeft(left);
      if (!left && onComplete) {
        onComplete();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (!timeLeft) {
    return (
      <div className="pill pill-themed animate-pulse">
        <AlertCircle size={14} />
        <span className="font-medium">Available now!</span>
      </div>
    );
  }

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 10;

  if (variant === 'compact') {
    return (
      <div className={`pill font-mono text-sm ${
        isUrgent ? 'bg-red-100 text-red-700 border-red-200' : ''
      }`}>
        <Clock size={14} />
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    );
  }

  return (
    <div className={`panel-themed inline-flex items-center gap-4 !p-3 ${
      isUrgent || variant === 'urgent'
        ? '!bg-red-50 !border-red-200'
        : ''
    }`}>
      {isUrgent ? (
        <div className="p-2 bg-red-100 rounded-lg">
          <Zap size={18} className="text-red-500 animate-pulse" />
        </div>
      ) : (
        <div className="p-2 bg-amber-100 rounded-lg">
          <Clock size={18} className="text-amber-500" />
        </div>
      )}
      <div>
        <div className={`stat-label !mt-0 ${isUrgent ? '!text-red-500' : ''}`}>
          {label}
        </div>
        <div className={`font-mono text-lg font-bold ${isUrgent ? 'text-red-700' : 'text-slate-800'}`}>
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
