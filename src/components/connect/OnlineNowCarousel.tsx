// src/components/connect/OnlineNowCarousel.tsx
// Instagram-style horizontal scroll of "online" users

import type { AttendeeProfile } from '../../types/connect';

interface OnlineNowCarouselProps {
  attendees: AttendeeProfile[];
  onSelect: (id: string) => void;
  connectedIds: Set<string>;
}

export function OnlineNowCarousel({ attendees, onSelect, connectedIds }: OnlineNowCarouselProps) {
  // Simulate "online" users - in production this would be real-time
  // For now, show first 8 unconnected attendees as "online"
  const onlineUsers = attendees
    .filter(a => !connectedIds.has(a.id))
    .slice(0, 8);

  if (onlineUsers.length === 0) return null;

  return (
    <div className="panel mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </div>
        <span className="text-sm font-medium text-slate-700">Online Now</span>
        <span className="text-xs text-slate-400">({onlineUsers.length} attendees)</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {onlineUsers.map(user => {
          const initials = user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();

          const roleColor = {
            incoming: 'from-blue-400 to-blue-600',
            second_year: 'from-green-400 to-green-600',
            alumni: 'from-purple-400 to-purple-600',
            supervisor: 'from-amber-400 to-amber-600',
          }[user.role];

          return (
            <button
              key={user.id}
              onClick={() => onSelect(user.id)}
              className="flex flex-col items-center gap-2 min-w-[72px] group"
            >
              <div className="relative">
                {/* Gradient ring - Instagram style */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${roleColor} p-0.5 group-hover:scale-105 transition-transform`}>
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-base font-semibold text-slate-700">
                      {initials}
                    </span>
                  </div>
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <p className="text-xs font-medium text-slate-600 truncate max-w-[72px] group-hover:text-purple-600">
                {user.name.split(' ')[0]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OnlineNowCarousel;
