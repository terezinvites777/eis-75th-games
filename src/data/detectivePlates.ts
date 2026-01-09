// src/data/detectivePlates.ts
// Phase plate image mappings for Disease Detective narrative stages

export type DetectivePhase =
  | 'caseSelect'
  | 'briefing'
  | 'evidence'
  | 'analysis'
  | 'diagnosis'
  | 'reveal';

// Each phase gets a unique narrative background plate
export const DETECTIVE_PLATES: Record<DetectivePhase, string> = {
  // Case Select: "You're in the archive" - Desk overview, folders, manila envelopes
  caseSelect: '/images/plates/detective/Case-Select.png',

  // Briefing: "You receive the call" - Phone memo, stamped letter
  briefing: '/images/plates/detective/Briefing.png',

  // Evidence: "Files open" - Folder spreads, paper stacks
  evidence: '/images/plates/detective/Evidence.png',

  // Analysis: "Connecting dots" - Map pins, scribbles, strings
  analysis: '/images/plates/detective/Analysis.png',

  // Diagnosis: "Decision moment" - Single illuminated clipboard
  diagnosis: '/images/plates/detective/Diagnosis.png',

  // Reveal: "Legacy moment" - Gold framed EIS plaque
  reveal: '/images/plates/detective/Legacy.png',
};

// Narrative descriptions for each phase (used for alt text)
export const DETECTIVE_PHASE_NARRATIVE: Record<DetectivePhase, string> = {
  caseSelect: "You're in the archive - Desk overview with case folders and manila envelopes",
  briefing: "You receive the call - Phone memo with stamped urgent letter on your desk",
  evidence: "Files open - Folder spreads and paper stacks revealing investigation clues",
  analysis: "Connecting dots - Map pins, red strings, and scribbled notes on the board",
  diagnosis: "Decision moment - Single illuminated clipboard awaiting your diagnosis",
  reveal: "Legacy moment - Gold framed EIS plaque commemorating the case resolution",
};
