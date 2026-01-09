// src/types/detective.ts
// Disease Detective Game Types

export type Era = '1950s' | '1980s' | '2010s';

export type ClueType = 
  | 'epidemiologic' 
  | 'laboratory' 
  | 'environmental' 
  | 'clinical' 
  | 'timeline' 
  | 'historical';

export type BriefingType = 'email' | 'phone' | 'alert' | 'memo';

export interface Briefing {
  type: BriefingType;
  from: string;
  to?: string;
  subject: string;
  timestamp?: string;
  content: string;
  urgency?: 'routine' | 'urgent' | 'critical';
}

export interface Clue {
  id: string;
  order: number;
  type: ClueType;
  title: string;
  content: string;
  source?: string;
  isCritical: boolean;
  pointCost: number;
  revealHint?: string;
}

export interface DiagnosisOption {
  id: string;
  pathogen?: string;
  source?: string;
  label: string;
  description: string;
}

export interface CaseSolution {
  pathogenId: string;
  sourceId: string;
  pathogen: string;
  source: string;
  explanation: string;
  eisLegacy: string;
  realOutcome: string;
  caseFatality?: string;
  totalCases?: string;
  mmwrReference?: string;
}

export interface DetectiveCase {
  id: string;
  era: Era;
  year: number;
  title: string;           // Neutral title (no spoilers)
  subtitle: string;        // Location and date context
  teaser: string;          // Short hook for card display
  difficulty: 1 | 2 | 3;   // 1=easy, 2=medium, 3=hard
  timeLimit: number;       // seconds
  basePoints: number;
  
  briefing: Briefing;
  clues: Clue[];
  
  diagnosis: {
    pathogenOptions: DiagnosisOption[];
    sourceOptions: DiagnosisOption[];
  };
  
  solution: CaseSolution;
  
  learningObjectives?: string[];
  historicalContext?: string;
}

export interface CaseProgress {
  caseId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  revealedClues: string[];
  selectedPathogen: string | null;
  selectedSource: string | null;
  timeSpent: number;
  score: number;
  attempts: number;
  completedAt?: Date;
}

// Era metadata for UI
export interface EraInfo {
  era: Era;
  title: string;
  subtitle: string;
  years: string;
  description: string;
  icon: string;
  caseCount: number;
  theme: {
    primary: string;
    secondary: string;
    gradient: string;
  };
}

export const ERA_INFO: Record<Era, EraInfo> = {
  '1950s': {
    era: '1950s',
    title: 'Shoe Leather Era',
    subtitle: 'The Birth of Disease Detection',
    years: '1951-1965',
    description: 'When EIS officers pioneered field epidemiology with notebooks, phones, and determination.',
    icon: '🔬',
    caseCount: 3,
    theme: {
      primary: '#B8860B',
      secondary: '#D4AF37',
      gradient: 'from-amber-500 to-yellow-600',
    },
  },
  '1980s': {
    era: '1980s',
    title: 'Laboratory Revolution',
    subtitle: 'New Tools for New Threats',
    years: '1980-1995',
    description: 'The era of PFGE, new pathogen discovery, and consumer product investigations.',
    icon: '🧬',
    caseCount: 3,
    theme: {
      primary: '#0057B8',
      secondary: '#0077B6',
      gradient: 'from-blue-500 to-cyan-600',
    },
  },
  '2010s': {
    era: '2010s',
    title: 'Genomic Age',
    subtitle: 'Global Health Security',
    years: '2005-2020',
    description: 'Whole genome sequencing, social media surveillance, and pandemic preparedness.',
    icon: '🌍',
    caseCount: 4,
    theme: {
      primary: '#7A2A7E',
      secondary: '#A66BB6',
      gradient: 'from-purple-500 to-pink-600',
    },
  },
};
