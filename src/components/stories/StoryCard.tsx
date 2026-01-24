// src/components/stories/StoryCard.tsx
import type { FeaturedStory } from '../../types/stories';
import { Play, Calendar, MapPin, User } from 'lucide-react';

interface StoryCardProps {
  story: FeaturedStory;
  onPlay: (story: FeaturedStory) => void;
}

// Extract video ID from YouTube embed URL and create thumbnail URL
function getYouTubeThumbnail(videoUrl: string | null): string | null {
  if (!videoUrl) return null;

  // Extract video ID from embed URL (format: https://www.youtube.com/embed/VIDEO_ID)
  const match = videoUrl.match(/\/embed\/([^?]+)/);
  if (match && match[1]) {
    // Use hqdefault for good quality without being too large
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
}

export function StoryCard({ story, onPlay }: StoryCardProps) {
  const thumbnailUrl = getYouTubeThumbnail(story.video_url);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      {/* Thumbnail */}
      <div
        className="relative h-48 bg-slate-800 cursor-pointer group"
        onClick={() => onPlay(story)}
      >
        {/* YouTube thumbnail or placeholder */}
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={story.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play size={28} className="text-slate-800 ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Decade badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full shadow">
          {story.decade}
        </div>

        {/* Duration badge if available */}
        {story.video_duration && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
            {story.video_duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800">{story.title}</h3>

        <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <User size={14} />
            {story.officer_name}
          </span>
          {story.eis_class_year && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              Class of {story.eis_class_year}
            </span>
          )}
          {story.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {story.location}
            </span>
          )}
        </div>

        <p className="mt-3 text-sm text-slate-600 line-clamp-2">
          {story.description}
        </p>

        <button
          onClick={() => onPlay(story)}
          className="mt-4 w-full py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
        >
          <Play size={16} />
          Watch Story
        </button>
      </div>
    </div>
  );
}
