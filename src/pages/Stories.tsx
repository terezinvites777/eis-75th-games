// src/pages/Stories.tsx
// 75 Years, 75 Stories - Video gallery and memory sharing

import { useState } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { DecadeCard } from '../components/stories/DecadeCard';
import { StoryCard } from '../components/stories/StoryCard';
import { MemoryForm } from '../components/stories/MemoryForm';
import { VideoModal } from '../components/stories/VideoModal';
import { decadeInfo, featuredStories, getStoriesByDecade } from '../data/stories-data';
import type { FeaturedStory, Decade } from '../types/stories';
import { Film, BookOpen, Sparkles } from 'lucide-react';

export function Stories() {
  const [selectedDecade, setSelectedDecade] = useState<Decade | null>(null);
  const [activeStory, setActiveStory] = useState<FeaturedStory | null>(null);
  const [view, setView] = useState<'browse' | 'share'>('browse');

  const handleDecadeClick = (decade: Decade) => {
    setSelectedDecade(selectedDecade === decade ? null : decade);
  };

  const handlePlayStory = (story: FeaturedStory) => {
    setActiveStory(story);
  };

  const handleCloseVideo = () => {
    setActiveStory(null);
  };

  const handleMemorySubmit = (memory: { decade: Decade; memory_text: string }) => {
    // In production, this would save to Supabase
    console.log('Memory submitted:', memory);
  };

  const currentStories = selectedDecade
    ? getStoriesByDecade(selectedDecade)
    : featuredStories;

  return (
    <GameShell
      theme="default"
      heroTitle="75 Years, 75 Stories"
      heroSubtitle="Celebrating the history of EIS"
      backPath="/"
    >
      {/* Video Modal */}
      {activeStory && (
        <VideoModal story={activeStory} onClose={handleCloseVideo} />
      )}

      <div className="px-4 py-6 max-w-6xl mx-auto">
        {/* View Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setView('browse')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              view === 'browse'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'text-stone-700 border border-amber-200/50'
            }`}
            style={view !== 'browse' ? {
              background: 'linear-gradient(180deg, #f5e6c8 0%, #ead4a8 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
            } : undefined}
          >
            <Film size={18} />
            Watch Stories
          </button>
          <button
            onClick={() => setView('share')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              view === 'share'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'text-stone-700 border border-amber-200/50'
            }`}
            style={view !== 'share' ? {
              background: 'linear-gradient(180deg, #f5e6c8 0%, #ead4a8 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
            } : undefined}
          >
            <Sparkles size={18} />
            Share Memory
          </button>
        </div>

        {view === 'browse' ? (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Decade Timeline */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <BookOpen size={20} />
                Browse by Decade
              </h2>

              {decadeInfo.map(decade => (
                <DecadeCard
                  key={decade.decade}
                  decade={decade}
                  isActive={selectedDecade === decade.decade}
                  storiesCount={getStoriesByDecade(decade.decade).length}
                  onClick={() => handleDecadeClick(decade.decade)}
                />
              ))}

              {selectedDecade && (
                <button
                  onClick={() => setSelectedDecade(null)}
                  className="w-full py-2 text-white/80 hover:text-white text-sm underline"
                >
                  Show all decades
                </button>
              )}
            </div>

            {/* Stories Grid */}
            <div className="lg:col-span-8">
              {selectedDecade && (
                <div className="bg-white/95 rounded-xl p-4 mb-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    {decadeInfo.find(d => d.decade === selectedDecade)?.title}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {decadeInfo.find(d => d.decade === selectedDecade)?.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {decadeInfo.find(d => d.decade === selectedDecade)?.key_events.map((event, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {currentStories.length === 0 ? (
                  <div className="col-span-2 bg-white/95 rounded-xl p-8 text-center">
                    <div className="text-4xl mb-3">📽️</div>
                    <p className="text-slate-600">No stories available for this decade yet.</p>
                  </div>
                ) : (
                  currentStories.map(story => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onPlay={handlePlayStory}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <MemoryForm onSubmit={handleMemorySubmit} />
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 bg-slate-800/80 rounded-xl p-6 grid grid-cols-3 gap-4 text-center text-white">
          <div>
            <div className="text-3xl font-bold text-amber-400">75</div>
            <div className="text-sm text-slate-300">Years of EIS</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">4,000+</div>
            <div className="text-sm text-slate-300">Officers Trained</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">10,000+</div>
            <div className="text-sm text-slate-300">Investigations</div>
          </div>
        </div>
      </div>
    </GameShell>
  );
}

export default Stories;
