// src/types/stories.ts
// 75 Years, 75 Stories types

export type Decade = '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s';

export interface FeaturedStory {
  id: string;
  decade: Decade;
  title: string;
  officer_name: string;
  eis_class_year: number;
  video_url: string;
  thumbnail_url: string;
  description: string;
  outbreak_name?: string;
  location?: string;
}

export interface UserMemory {
  id: string;
  user_id: string;
  submitted_at: string;
  decade: Decade;
  memory_text: string;
  photo_url?: string;
  is_approved: boolean;
  featured?: boolean;
}

export interface DecadeInfo {
  decade: Decade;
  title: string;
  description: string;
  key_events: string[];
  featured_story_ids: string[];
}
