// src/components/patient-zero/CountdownTimer.tsx
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
      <div className="flex items-center gap-2 text-green-600 font-medium animate-pulse">
        <AlertCircle size={18} />
        <span>Available now!</span>
      </div>
    );
  }

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 10;

  if (variant === 'compact') {
    return (
      <div className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-sm
        ${isUrgent ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}
      `}>
        <Clock size={14} />
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    );
  }

  return (
    <div className={`
      rounded-xl px-4 py-3 inline-flex items-center gap-4
      ${isUrgent || variant === 'urgent'
        ? 'bg-red-900/90 border border-red-700'
        : 'bg-slate-800/90 border border-slate-700'
      }
    `}>
      {isUrgent ? (
        <Zap size={20} className="text-red-400 animate-pulse" />
      ) : (
        <Clock size={20} className="text-amber-400" />
      )}
      <div>
        <div className={`text-xs uppercase tracking-wide ${isUrgent ? 'text-red-300' : 'text-slate-400'}`}>
          {label}
        </div>
        <div className={`font-mono text-lg font-bold ${isUrgent ? 'text-red-100' : 'text-white'}`}>
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
