// src/components/connect/AttendeeCard.tsx
import type { AttendeeProfile } from '../../types/connect';
import { topicLabels } from '../../data/connect-data';
import { MapPin, Briefcase, GraduationCap, UserPlus, Check } from 'lucide-react';

interface AttendeeCardProps {
  attendee: AttendeeProfile;
  onConnect?: (id: string) => void;
  isConnected?: boolean;
  showFullBio?: boolean;
}

const roleColors = {
  incoming: 'bg-blue-100 text-blue-700 border-blue-300',
  second_year: 'bg-green-100 text-green-700 border-green-300',
  alumni: 'bg-purple-100 text-purple-700 border-purple-300',
  supervisor: 'bg-amber-100 text-amber-700 border-amber-300',
};

const roleLabels = {
  incoming: 'Incoming EIS',
  second_year: '2nd Year EIS',
  alumni: 'Alumni',
  supervisor: 'Supervisor',
};

export function AttendeeCard({ attendee, onConnect, isConnected, showFullBio }: AttendeeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
            {attendee.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{attendee.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${roleColors[attendee.role]}`}>
                {roleLabels[attendee.role]}
              </span>
              {attendee.eis_class_year && (
                <span className="text-slate-300 text-xs flex items-center gap-1">
                  <GraduationCap size={12} />
                  {attendee.eis_class_year}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Location info */}
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400" />
            <span>From {attendee.home_state}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-slate-400" />
            <span>{attendee.assignment_location}</span>
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
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98'
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
