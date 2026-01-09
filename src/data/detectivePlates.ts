// src/data/detectivePlates.ts
// Phase plate image mappings for Disease Detective narrative stages

export type DetectivePhase =
  | 'caseSelect'
  | 'briefing'
  | 'evidence'
  | 'analysis'
  | 'diagnosis'
  | 'reveal';

// Caption metadata for each phase
export type PlateMeta = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

// Each phase gets a unique narrative background plate with captions
export const DETECTIVE_PLATES: Record<DetectivePhase, PlateMeta> = {
  caseSelect: {
    src: '/images/plates/detective/Case-Select.png',
    alt: "Archive desk with case folders and manila envelopes",
    eyebrow: "The Archive",
    title: "Select Your Case",
    subtitle: "Choose an outbreak to investigate",
  },

  briefing: {
    src: '/images/plates/detective/Briefing.png',
    alt: "Phone memo with stamped urgent letter on desk",
    eyebrow: "Incoming Call",
    title: "Case Briefing",
    subtitle: "Review the initial report",
  },

  evidence: {
    src: '/images/plates/detective/Evidence.png',
    alt: "Folder spreads and paper stacks with investigation clues",
    eyebrow: "Files Open",
    title: "Examine Evidence",
    subtitle: "Study the epidemiological data",
  },

  analysis: {
    src: '/images/plates/detective/Analysis.png',
    alt: "Map board with pins, red strings, and scribbled notes",
    eyebrow: "Connecting Dots",
    title: "Analyze Patterns",
    subtitle: "Link the evidence together",
  },

  diagnosis: {
    src: '/images/plates/detective/Diagnosis.png',
    alt: "Illuminated clipboard awaiting diagnosis",
    eyebrow: "Decision Moment",
    title: "Make Your Diagnosis",
    subtitle: "What is causing this outbreak?",
  },

  reveal: {
    src: '/images/plates/detective/Legacy.png',
    alt: "Gold framed EIS plaque commemorating case resolution",
    eyebrow: "Case Closed",
    title: "Investigation Complete",
    subtitle: "Your legacy in epidemiology",
  },
};

// Legacy: simple path lookup (for backwards compatibility)
export const DETECTIVE_PLATE_PATHS: Record<DetectivePhase, string> = {
  caseSelect: DETECTIVE_PLATES.caseSelect.src,
  briefing: DETECTIVE_PLATES.briefing.src,
  evidence: DETECTIVE_PLATES.evidence.src,
  analysis: DETECTIVE_PLATES.analysis.src,
  diagnosis: DETECTIVE_PLATES.diagnosis.src,
  reveal: DETECTIVE_PLATES.reveal.src,
};
