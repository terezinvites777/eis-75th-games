// src/components/connect/AttendeeCard.tsx
import type { AttendeeProfile } from '../../types/connect';
import { topicLabels, roleLabels, roleColors } from '../../data/connect-data';
import { MapPin, Briefcase, GraduationCap, UserPlus, Check, Coffee, Sparkles } from 'lucide-react';

interface AttendeeCardProps {
  attendee: AttendeeProfile;
  onConnect?: (id: string) => void;
  isConnected?: boolean;
  showFullBio?: boolean;
  matchReasons?: string[];
  compact?: boolean;
}

export function AttendeeCard({
  attendee,
  onConnect,
  isConnected,
  showFullBio,
  matchReasons,
  compact,
}: AttendeeCardProps) {
  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow border border-slate-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            {attendee.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-800 truncate">{attendee.name}</h4>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${roleColors[attendee.role]}`}>
                {roleLabels[attendee.role]}
              </span>
              {attendee.eis_class_year && (
                <span className="text-xs">'{String(attendee.eis_class_year).slice(-2)}</span>
              )}
            </div>
          </div>

          {isConnected && (
            <div className="p-2 bg-green-100 rounded-full">
              <Check size={16} className="text-green-600" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {attendee.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{attendee.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${roleColors[attendee.role]}`}>
                {roleLabels[attendee.role]}
              </span>
              {attendee.eis_class_year && (
                <span className="text-slate-300 text-xs flex items-center gap-1">
                  <GraduationCap size={12} />
                  {attendee.eis_class_year}
                </span>
              )}
              {attendee.open_to_coffee && (
                <span className="text-amber-300 text-xs flex items-center gap-1">
                  <Coffee size={12} />
                  Coffee
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Match reasons */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-3 p-2 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-1.5 text-purple-700 text-xs font-medium mb-1">
              <Sparkles size={12} />
              Why you might connect
            </div>
            <div className="flex flex-wrap gap-1">
              {matchReasons.map((reason, i) => (
                <span key={i} className="text-xs text-purple-600">
                  {reason}{i < matchReasons.length - 1 ? ' •' : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location info */}
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400 flex-shrink-0" />
            <span>From {attendee.home_state}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{attendee.assignment_location}</span>
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mt-3">
          {attendee.topics.map(topic => (
            <span
              key={topic}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
            >
              {topicLabels[topic]}
            </span>
          ))}
        </div>

        {/* Bio */}
        {attendee.bio && (
          <p className={`mt-3 text-sm text-slate-500 ${showFullBio ? '' : 'line-clamp-2'}`}>
            {attendee.bio}
          </p>
        )}

        {/* Connect button */}
        {onConnect && (
          <button
            onClick={() => !isConnected && onConnect(attendee.id)}
            disabled={isConnected}
            className={`
              mt-4 w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
              ${isConnected
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 active:scale-[0.98]'
              }
            `}
          >
            {isConnected ? (
              <>
                <Check size={18} />
                Connected
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Connect
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
