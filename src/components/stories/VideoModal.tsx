// src/components/stories/VideoModal.tsx
import type { FeaturedStory } from '../../types/stories';
import { X, MapPin, User } from 'lucide-react';

interface VideoModalProps {
  story: FeaturedStory;
  onClose: () => void;
}

export function VideoModal({ story, onClose }: VideoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{story.title}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <User size={14} />
                {story.officer_name}
              </span>
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {story.decade}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Video */}
        <div className="aspect-video bg-black">
          {/* Placeholder since we don't have real videos */}
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-lg opacity-80">Video Coming Soon</p>
              <p className="text-sm opacity-60 mt-2">
                In production, this would embed the actual video content
              </p>
            </div>
          </div>
          {/* Real video would be:
          <iframe
            src={story.video_url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          */}
        </div>

        {/* Description */}
        <div className="p-4">
          <p className="text-slate-700 leading-relaxed">{story.description}</p>

          {(story.outbreak_name || story.location) && (
            <div className="flex flex-wrap gap-3 mt-4">
              {story.outbreak_name && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  {story.outbreak_name}
                </span>
              )}
              {story.location && (
                <span className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                  <MapPin size={14} />
                  {story.location}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
