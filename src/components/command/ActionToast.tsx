// src/components/command/ActionToast.tsx
// Toast notifications for action completion and game events

import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  effect?: string;
  duration?: number;
}

interface ActionToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

export function ActionToast({ toast, onDismiss }: ActionToastProps) {
  const { id, message, type, effect, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    warning: <AlertCircle className="text-amber-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
    error: <AlertCircle className="text-red-500" size={24} />,
  };

  const colors = {
    success: 'bg-green-50 border-green-300 shadow-green-100',
    warning: 'bg-amber-50 border-amber-300 shadow-amber-100',
    info: 'bg-blue-50 border-blue-300 shadow-blue-100',
    error: 'bg-red-50 border-red-300 shadow-red-100',
  };

  return (
    <div
      className={`${colors[type]} border-2 rounded-xl shadow-lg px-4 py-3
                  flex items-center gap-3 max-w-md animate-slide-in`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-800">{message}</div>
        {effect && (
          <div className="text-sm text-slate-600 mt-0.5 truncate">
            Effect: {effect}
          </div>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
        aria-label="Dismiss"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// Container for multiple toasts
interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ActionToast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export default ActionToast;
