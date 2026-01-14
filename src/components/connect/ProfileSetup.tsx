// src/components/connect/ProfileSetup.tsx
// Multi-step profile creation for EpiConnect

import { useState } from 'react';
import type { UserProfile, Topic, AttendeeRole, LookingFor } from '../../types/connect';
import { topicLabels, US_STATES, lookingForLabels } from '../../data/connect-data';
import { Camera, User, MapPin, Heart, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: Partial<UserProfile>;
}

const roleOptions: { value: AttendeeRole; label: string; icon: string; description: string }[] = [
  { value: 'incoming', label: 'Incoming EIS', icon: '🌟', description: 'Starting EIS in 2025' },
  { value: 'second_year', label: '2nd Year EIS', icon: '📈', description: 'Currently in year 2' },
  { value: 'alumni', label: 'EIS Alumni', icon: '🎓', description: 'Completed EIS program' },
  { value: 'supervisor', label: 'Supervisor', icon: '⭐', description: 'Supervising EIS officers' },
];

export function ProfileSetup({ onComplete, initialProfile }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    role: 'incoming',
    home_state: '',
    assignment_location: '',
    topics: [],
    bio: '',
    looking_for: [],
    open_to_coffee: true,
    ...initialProfile,
  });

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleComplete = () => {
    // Generate a unique ID
    const completeProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: profile.name || 'Anonymous',
      email: profile.email || 'user@cdc.gov',
      role: profile.role || 'incoming',
      eis_class_year: profile.eis_class_year,
      home_state: profile.home_state || 'Georgia',
      assignment_location: profile.assignment_location || 'CDC Atlanta',
      topics: profile.topics || [],
      bio: profile.bio,
      looking_for: profile.looking_for || [],
      open_to_coffee: profile.open_to_coffee ?? true,
    };
    onComplete(completeProfile);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return profile.name && profile.role;
      case 2:
        return profile.home_state && profile.assignment_location;
      case 3:
        return (profile.topics?.length || 0) > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        backgroundImage: "url('/images/textures/old-antique-vintage-paper-pattern-texture-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-lg mx-auto">
        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-[#b8860b]' : 'bg-[#d4c4a4]'
              }`}
            />
          ))}
        </div>

        {/* Step indicator */}
        <div className="text-center mb-6">
          <span className="text-[#5c4030] text-sm font-medium">Step {step} of 4</span>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Let's set up your profile
            </h2>

            {/* Photo placeholder */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#f3e6cc] flex items-center justify-center overflow-hidden border-4 border-[#d4c4a4]">
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-[#b8860b]" />
                )}
              </div>
              <p className="text-sm text-slate-500 mt-2">Photo (optional)</p>
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={e => updateProfile({ name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#b8860b] focus:border-[#b8860b]"
                placeholder="Dr. Jane Smith"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={e => updateProfile({ email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#b8860b] focus:border-[#b8860b]"
                placeholder="jane.smith@cdc.gov"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map(role => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => updateProfile({ role: role.value })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      profile.role === role.value
                        ? 'border-[#b8860b] bg-[#faf5eb]'
                        : 'border-slate-200 hover:border-[#d4af37]'
                    }`}
                  >
                    <span className="text-2xl">{role.icon}</span>
                    <div className="font-medium mt-1">{role.label}</div>
                    <div className="text-xs text-slate-500">{role.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#f3e6cc] rounded-lg">
                <MapPin size={24} className="text-[#8b6914]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Where are you from?</h2>
            </div>

            {/* Home state */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Home State
              </label>
              <select
                value={profile.home_state || ''}
                onChange={e => updateProfile({ home_state: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#b8860b] focus:border-[#b8860b]"
              >
                <option value="">Select state...</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Assignment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current/Upcoming Assignment
              </label>
              <input
                type="text"
                value={profile.assignment_location || ''}
                onChange={e => updateProfile({ assignment_location: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#b8860b] focus:border-[#b8860b]"
                placeholder="CDC Atlanta, Texas DSHS, etc."
              />
            </div>

            {/* EIS Class Year */}
            {(profile.role === 'incoming' || profile.role === 'second_year' || profile.role === 'alumni') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  EIS Class Year
                </label>
                <input
                  type="number"
                  value={profile.eis_class_year || ''}
                  onChange={e => updateProfile({ eis_class_year: parseInt(e.target.value) || undefined })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#b8860b] focus:border-[#b8860b]"
                  placeholder="2025"
                  min={1951}
                  max={2026}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              What are your interests?
            </h2>
            <p className="text-slate-600 mb-6">Select up to 3 topic areas</p>

            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(topicLabels) as [Topic, string][]).map(([topic, label]) => {
                const isSelected = profile.topics?.includes(topic);
                const canSelect = (profile.topics?.length || 0) < 3 || isSelected;

                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      if (!canSelect) return;
                      const topics = profile.topics || [];
                      if (isSelected) {
                        updateProfile({ topics: topics.filter(t => t !== topic) });
                      } else {
                        updateProfile({ topics: [...topics, topic] });
                      }
                    }}
                    disabled={!canSelect}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#b8860b] bg-[#faf5eb]'
                        : canSelect
                        ? 'border-slate-200 hover:border-[#d4af37]'
                        : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{label}</span>
                      {isSelected && <Check size={16} className="text-[#8b6914]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-center text-sm text-slate-500">
              {profile.topics?.length || 0}/3 selected
            </div>
          </div>
        )}

        {/* Step 4: Networking Preferences */}
        {step === 4 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#f3e6cc] rounded-lg">
                <Heart size={24} className="text-[#8b6914]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Almost done!</h2>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Short Bio
              </label>
              <textarea
                value={profile.bio || ''}
                onChange={e => updateProfile({ bio: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#b8860b] focus:border-[#b8860b] h-24 resize-none"
                placeholder="Tell others about yourself..."
                maxLength={200}
              />
              <p className="text-xs text-slate-500 mt-1">
                {(profile.bio?.length || 0)}/200 characters
              </p>
            </div>

            {/* What are you looking for? */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                What are you looking for?
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(lookingForLabels) as [LookingFor, string][]).map(([key, label]) => {
                  const isSelected = profile.looking_for?.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        const current = profile.looking_for || [];
                        if (isSelected) {
                          updateProfile({ looking_for: current.filter(v => v !== key) });
                        } else {
                          updateProfile({ looking_for: [...current, key] });
                        }
                      }}
                      className={`px-4 py-2 rounded-full transition-all ${
                        isSelected
                          ? 'bg-[#b8860b] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Open to coffee chats */}
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={profile.open_to_coffee ?? true}
                onChange={e => updateProfile({ open_to_coffee: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-[#8b6914] focus:ring-[#b8860b]"
              />
              <div>
                <div className="font-medium">☕ Open to coffee chats</div>
                <div className="text-sm text-slate-500">Let others know you're available to meet</div>
              </div>
            </label>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 bg-white/20 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          )}
          <button
            onClick={() => step < 4 ? setStep(step + 1) : handleComplete()}
            disabled={!canProceed()}
            className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              canProceed()
                ? 'bg-white text-[#705812] hover:bg-[#faf5eb]'
                : 'bg-white/30 text-white/60 cursor-not-allowed'
            }`}
          >
            {step < 4 ? (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <User size={18} />
                Complete Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
