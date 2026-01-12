// src/components/connect/SpeedNetworking.tsx
// 5-minute speed networking sessions with conversation prompts

import { useState, useEffect, useCallback } from 'react';
import type { AttendeeProfile, UserProfile } from '../../types/connect';
import { roleLabels, topicLabels, getConversationStarters, mockAttendees } from '../../data/connect-data';
import { UserPlus, SkipForward, MessageCircle, Star, Play, Pause, RotateCcw, Check, Coffee, MapPin, Briefcase } from 'lucide-react';

interface SpeedNetworkingProps {
  userProfile: UserProfile;
  onConnect: (attendeeId: string, rating: number) => void;
  onSkip: (attendeeId: string) => void;
  connectedIds: Set<string>;
  skippedIds: Set<string>;
}

export function SpeedNetworking({
  userProfile,
  onConnect,
  onSkip,
  connectedIds,
  skippedIds,
}: SpeedNetworkingProps) {
  const [currentMatch, setCurrentMatch] = useState<AttendeeProfile | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Get next unmatched attendee
  const getNextMatch = useCallback(() => {
    const available = mockAttendees.filter(a =>
      a.id !== userProfile.id &&
      !connectedIds.has(a.id) &&
      !skippedIds.has(a.id)
    );

    if (available.length > 0) {
      // Randomize for variety
      const randomIndex = Math.floor(Math.random() * available.length);
      return available[randomIndex];
    }
    return null;
  }, [userProfile.id, connectedIds, skippedIds]);

  // Timer logic
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  // Format time as M:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Get timer color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining > 120) return 'from-green-500 to-emerald-600';
    if (timeRemaining > 60) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  // Find a match
  const findMatch = () => {
    const match = getNextMatch();
    setCurrentMatch(match);
    setTimeRemaining(300);
    setIsActive(false);
    setRating(0);
  };

  // Start session
  const startSession = () => {
    setIsActive(true);
  };

  // Pause session
  const pauseSession = () => {
    setIsActive(false);
  };

  // End session and show rating
  const endSession = () => {
    setIsActive(false);
    setShowRating(true);
  };

  // Submit rating and connect
  const submitRating = () => {
    if (currentMatch && rating > 0) {
      onConnect(currentMatch.id, rating);
      setSessionsCompleted(prev => prev + 1);
    }
    setShowRating(false);
    setRating(0);
    findMatch();
  };

  // Skip current match
  const skipMatch = () => {
    if (currentMatch) {
      onSkip(currentMatch.id);
    }
    setIsActive(false);
    findMatch();
  };

  // No match available
  if (!currentMatch && connectedIds.size + skippedIds.size >= mockAttendees.length - 1) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
        <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Check size={40} className="text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Amazing networking!</h3>
        <p className="text-slate-600 mb-4">
          You've met everyone available. Check your connections to follow up!
        </p>
        <div className="text-3xl font-bold text-purple-600">
          {sessionsCompleted} sessions completed
        </div>
      </div>
    );
  }

  // Ready to find match
  if (!currentMatch) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <UserPlus size={40} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Network?</h3>
        <p className="text-slate-600 mb-6">
          We'll match you with another attendee for a 5-minute conversation
        </p>

        {sessionsCompleted > 0 && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <span className="text-purple-700 font-medium">
              🎉 {sessionsCompleted} sessions completed
            </span>
          </div>
        )}

        <button
          onClick={findMatch}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
        >
          <UserPlus size={20} />
          Find My Match
        </button>
      </div>
    );
  }

  // Active session
  return (
    <div className="space-y-4">
      {/* Timer Header */}
      <div className={`bg-gradient-to-r ${getTimerColor()} rounded-2xl p-6 text-center text-white shadow-lg`}>
        <div className="text-sm opacity-80 mb-1">
          {isActive ? 'Time Remaining' : timeRemaining === 300 ? 'Ready to Start' : 'Paused'}
        </div>
        <div className="text-5xl font-mono font-bold mb-2">
          {formatTime(timeRemaining)}
        </div>
        {timeRemaining <= 60 && timeRemaining > 0 && isActive && (
          <div className="text-sm animate-pulse">⏰ Wrap up your conversation!</div>
        )}
        {timeRemaining === 0 && (
          <div className="text-sm">Time's up! Rate your conversation below.</div>
        )}
      </div>

      {/* Match Profile */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with avatar */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {currentMatch.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white truncate">{currentMatch.name}</h3>
              <div className="text-purple-300 font-medium">
                {roleLabels[currentMatch.role]}
                {currentMatch.eis_class_year && ` • Class of ${currentMatch.eis_class_year}`}
              </div>
              <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                <MapPin size={14} />
                <span>{currentMatch.home_state}</span>
                <span>•</span>
                <Briefcase size={14} />
                <span className="truncate">{currentMatch.assignment_location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Topics */}
          <div className="flex flex-wrap gap-2 mb-4">
            {currentMatch.topics.map(topic => (
              <span
                key={topic}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
              >
                {topicLabels[topic]}
              </span>
            ))}
            {currentMatch.open_to_coffee && (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full flex items-center gap-1">
                <Coffee size={14} />
                Open to coffee
              </span>
            )}
          </div>

          {/* Bio */}
          {currentMatch.bio && (
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {currentMatch.bio}
            </p>
          )}

          {/* Conversation Starters */}
          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-800 mb-3">
              <MessageCircle size={16} />
              Conversation Starters
            </div>
            <ul className="space-y-2">
              {getConversationStarters(currentMatch.role).map((starter, i) => (
                <li key={i} className="text-sm text-purple-700 flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  {starter}
                </li>
              ))}
            </ul>
          </div>

          {/* Controls */}
          {!showRating && (
            <div className="space-y-3">
              {!isActive && timeRemaining === 300 ? (
                <button
                  onClick={startSession}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Start 5-Minute Session
                </button>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={isActive ? pauseSession : startSession}
                      className="py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-200"
                    >
                      {isActive ? <Pause size={18} /> : <Play size={18} />}
                      {isActive ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={() => {
                        setTimeRemaining(300);
                        setIsActive(false);
                      }}
                      className="py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-200"
                    >
                      <RotateCcw size={18} />
                      Reset
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={skipMatch}
                      className="py-3 border-2 border-slate-300 text-slate-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-50"
                    >
                      <SkipForward size={18} />
                      Skip
                    </button>
                    <button
                      onClick={endSession}
                      className="py-3 bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700"
                    >
                      <Check size={18} />
                      End & Connect
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-scale-in">
            <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
              How was your conversation?
            </h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              with {currentMatch.name}
            </p>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`transition-colors ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-slate-500 mb-6 h-5">
              {rating === 0 && 'Tap to rate'}
              {rating === 1 && 'Not a great fit'}
              {rating === 2 && 'It was okay'}
              {rating === 3 && 'Good conversation'}
              {rating === 4 && 'Really enjoyed it!'}
              {rating === 5 && 'Amazing connection! ⭐'}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowRating(false);
                  setRating(0);
                }}
                className="py-3 border-2 border-slate-300 text-slate-600 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={rating === 0}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  rating > 0
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default SpeedNetworking;
