// src/types/stories.ts
// 75 Years, 75 Stories types

export type Decade = '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s';

export interface FeaturedStory {
  id: string;
  decade: Decade;
  title: string;
  officer_name: string;
  eis_class_year: number;
  video_url: string | null;  // Can be null if no video
  video_duration?: string;   // Optional duration like "1:28:52"
  thumbnail_url: string;
  description: string;
  outbreak_name?: string;
  location?: string;
  source?: string;           // Source attribution
}

export interface DecadeInfo {
  decade: Decade;
  title: string;
  description: string;
  key_events: string[];
  featured_story_ids: string[];
}

export interface UserMemory {
  id: string;
  decade: Decade;
  text: string;
  submitted_by: string;
  eis_class_year?: number;
  approved: boolean;
  created_at: string;
}
