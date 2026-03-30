// src/data/first-response-data.ts
// First Response game data — PPE sequences and Outbreak Investigation steps
// Source: CDC Infection Control Appendix A (PPE), CDC Field Epi Manual Ch. 2 (Investigation)

// ============================================================
// MODE 1: SUIT UP — PPE DONNING & DOFFING
// ============================================================

export interface PPEItem {
  id: string;
  name: string;
  shortName: string;
  icon: string;         // Emoji for MVP; replace with SVG/illustration later
  hintText: string;     // Shown after wrong tap
  contaminationWarning?: string;  // Shown during doffing phase
}

export interface PPESequence {
  phase: 'donning' | 'doffing';
  title: string;
  subtitle: string;
  items: PPEItem[];     // In correct order
  timeLimit: number;    // Seconds
  basePoints: number;
  penaltyPerWrongTap: number;   // Points deducted
  timePenaltyPerWrongTap: number; // Seconds added to elapsed time
}

// CDC Standard Donning Sequence
// Source: CDC "Sequence for Putting on Personal Protective Equipment (PPE)"
// https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-figure.html
export const PPE_DONNING: PPESequence = {
  phase: 'donning',
  title: 'SUIT UP',
  subtitle: 'Donning Sequence',
  timeLimit: 30,
  basePoints: 100,
  penaltyPerWrongTap: 10,
  timePenaltyPerWrongTap: 2,
  items: [
    {
      id: 'gown',
      name: 'Gown',
      shortName: 'Gown',
      icon: '🥼',
      hintText: 'Gown goes on first — fully cover torso from neck to knees, arms to end of wrist. Fasten at neck and waist.',
    },
    {
      id: 'mask',
      name: 'Mask or Respirator',
      shortName: 'Mask',
      icon: '😷',
      hintText: 'Mask or respirator goes on second — secure ties at middle of head and neck, fit to nose bridge, fit-check.',
    },
    {
      id: 'goggles',
      name: 'Goggles or Face Shield',
      shortName: 'Goggles',
      icon: '🥽',
      hintText: 'Eye protection goes on third — place on face and adjust to fit.',
    },
    {
      id: 'gloves',
      name: 'Gloves',
      shortName: 'Gloves',
      icon: '🧤',
      hintText: 'Gloves go on last — use non-sterile for isolation, extend to cover wrist of gown.',
    },
  ],
};

// CDC Standard Doffing Sequence
// Source: Same CDC Appendix A
// CRITICAL: Doffing order is NOT the reverse of donning!
// Gloves first (most contaminated), mask last (respiratory protection)
export const PPE_DOFFING: PPESequence = {
  phase: 'doffing',
  title: 'DECONTAMINATE',
  subtitle: 'Doffing Sequence',
  timeLimit: 45,
  basePoints: 150,  // Higher because doffing is harder and more critical
  penaltyPerWrongTap: 15,
  timePenaltyPerWrongTap: 3,
  items: [
    {
      id: 'gloves',
      name: 'Gloves',
      shortName: 'Gloves',
      icon: '🧤',
      hintText: 'Gloves come off FIRST — they are the most contaminated item.',
      contaminationWarning: '⚠️ Outside of gloves are contaminated! Grasp outside of glove with opposite gloved hand; peel off.',
    },
    {
      id: 'goggles',
      name: 'Goggles or Face Shield',
      shortName: 'Goggles',
      icon: '🥽',
      hintText: 'Eye protection comes off second — handle by the clean headband or ear pieces only.',
      contaminationWarning: '⚠️ Outside of goggles or face shield are contaminated! Handle by "clean" headband or ear pieces.',
    },
    {
      id: 'gown',
      name: 'Gown',
      shortName: 'Gown',
      icon: '🥼',
      hintText: 'Gown comes off third — unfasten ties, peel away from shoulders, turn inside out, roll into bundle.',
      contaminationWarning: '⚠️ Gown front and sleeves are contaminated! Unfasten neck, then waist ties. Pull from each shoulder, turn inside out.',
    },
    {
      id: 'mask',
      name: 'Mask or Respirator',
      shortName: 'Mask',
      icon: '😷',
      hintText: 'Mask comes off LAST — it maintains respiratory protection while removing other contaminated items.',
      contaminationWarning: '⚠️ Front of mask/respirator is contaminated — DO NOT TOUCH! Grasp ONLY bottom then top ties/elastics and remove.',
    },
    {
      id: 'hand-hygiene',
      name: 'Perform Hand Hygiene',
      shortName: 'Hand Hygiene',
      icon: '🧼',
      hintText: 'ALWAYS perform hand hygiene immediately after removing all PPE!',
      contaminationWarning: '✅ Perform hand hygiene immediately after removing all PPE!',
    },
  ],
};

// Safe work practices — shown as tips between phases
export const SAFE_WORK_PRACTICES = [
  'Keep hands away from face.',
  'Work from clean to dirty.',
  'Limit surfaces touched.',
  'Change gloves when torn or heavily contaminated.',
  'Perform hand hygiene.',
];

// ============================================================
// MODE 2: FIRST RESPONSE — OUTBREAK INVESTIGATION SEQUENCING
// ============================================================

export interface InvestigationStep {
  id: string;
  order: number;         // 1-10
  label: string;         // Short card label
  fullName: string;      // Full step name
  description: string;   // 1-line description
  icon: string;          // Emoji for MVP
}

export interface OutbreakScenario {
  id: string;
  title: string;
  type: 'foodborne' | 'respiratory' | 'vector-borne' | 'bioterrorism';
  briefing: string;      // 2-3 sentences max
  icon: string;
}

// CDC 10-Step Outbreak Investigation Framework
// Source: CDC Field Epidemiology Manual, Chapter 2 "Conducting a Field Investigation"
// Source: CDC EIS Course / EPICC framework
// Source: Outbreak Investigations: The 10-Step Approach (Moore, NC DPH)
export const INVESTIGATION_STEPS: InvestigationStep[] = [
  {
    id: 'prepare',
    order: 1,
    label: 'Prepare for\nField Work',
    fullName: 'Prepare for Field Work',
    description: 'Assemble investigation team, gather supplies, review background information.',
    icon: '🎒',
  },
  {
    id: 'confirm-outbreak',
    order: 2,
    label: 'Confirm the\nOutbreak',
    fullName: 'Establish Existence of an Outbreak',
    description: 'Verify that observed cases exceed the expected baseline for this population.',
    icon: '📊',
  },
  {
    id: 'verify-diagnosis',
    order: 3,
    label: 'Verify the\nDiagnosis',
    fullName: 'Verify the Diagnosis',
    description: 'Confirm clinical findings and laboratory results; rule out laboratory error.',
    icon: '🔬',
  },
  {
    id: 'case-definition',
    order: 4,
    label: 'Define\nthe Case',
    fullName: 'Construct a Case Definition',
    description: 'Establish standard criteria — person, place, time, and clinical information.',
    icon: '📋',
  },
  {
    id: 'find-cases',
    order: 5,
    label: 'Find Cases\n& Line List',
    fullName: 'Find Cases Systematically',
    description: 'Active case finding through records, interviews, and fieldwork. Develop line listing.',
    icon: '🔍',
  },
  {
    id: 'descriptive-epi',
    order: 6,
    label: 'Describe:\nTime/Place/Person',
    fullName: 'Perform Descriptive Epidemiology',
    description: 'Characterize the outbreak by time (epi curve), place (spot map), and person (demographics).',
    icon: '📈',
  },
  {
    id: 'develop-hypotheses',
    order: 7,
    label: 'Develop\nHypotheses',
    fullName: 'Develop Hypotheses',
    description: 'Generate testable hypotheses about the source and mode of transmission.',
    icon: '💡',
  },
  {
    id: 'test-hypotheses',
    order: 8,
    label: 'Test\nHypotheses',
    fullName: 'Evaluate Hypotheses',
    description: 'Conduct analytic studies (case-control, cohort) and additional laboratory testing.',
    icon: '⚗️',
  },
  {
    id: 'control-measures',
    order: 9,
    label: 'Implement\nControls',
    fullName: 'Implement Control Measures',
    description: 'Deploy targeted interventions based on evidence gathered in the investigation.',
    icon: '🛡️',
  },
  {
    id: 'communicate',
    order: 10,
    label: 'Communicate\nFindings',
    fullName: 'Communicate Findings',
    description: 'Prepare MMWR report, brief stakeholders, issue press communications.',
    icon: '📢',
  },
];

// Outbreak Scenarios for Mode 2
export const OUTBREAK_SCENARIOS: OutbreakScenario[] = [
  {
    id: 'foodborne',
    title: 'Foodborne Outbreak',
    type: 'foodborne',
    briefing: 'Reports of gastrointestinal illness among attendees of a large catered event. Multiple emergency departments across two counties are reporting cases with similar symptoms.',
    icon: '🍽️',
  },
  {
    id: 'respiratory',
    title: 'Respiratory Outbreak',
    type: 'respiratory',
    briefing: 'A cluster of severe pneumonia cases has emerged in a long-term care facility. Three residents have been hospitalized in the past 48 hours with rapidly progressing symptoms.',
    icon: '🫁',
  },
  {
    id: 'vector-borne',
    title: 'Vector-Borne Outbreak',
    type: 'vector-borne',
    briefing: 'Unusual clusters of febrile illness with rash in a coastal community following heavy rainfall and flooding. Local physicians suspect mosquito-borne disease.',
    icon: '🦟',
  },
  {
    id: 'bioterrorism',
    title: 'Bioterrorism Suspicion',
    type: 'bioterrorism',
    briefing: 'An unusual cluster of inhalation anthrax cases has been identified among postal workers at a regional sorting facility. No natural source is apparent.',
    icon: '☣️',
  },
];

// Mode 2 scoring constants
export const MODE2_CONFIG = {
  timeLimit: 90,         // seconds
  pointsPerCorrect: 10,
  timePenaltyPerWrong: 5, // seconds deducted from remaining time
  wrongTapPointPenalty: 5,
};

// ============================================================
// SCORING UTILITIES
// ============================================================

export interface GameResult {
  mode: 'suit-up' | 'first-response';
  totalTime: number;      // seconds elapsed
  wrongTaps: number;
  score: number;
  maxScore: number;
  accuracy: number;       // 0-1
  // Mode 1 specific
  donningTime?: number;
  doffingTime?: number;
  donningErrors?: number;
  doffingErrors?: number;
  // Mode 2 specific
  scenarioId?: string;
  stepsCorrectOnFirstTap?: number;
}

export function calculateSuitUpScore(
  donningElapsed: number,
  donningErrors: number,
  doffingElapsed: number,
  doffingErrors: number,
): { donningScore: number; doffingScore: number; totalScore: number } {
  const donningScore = Math.max(0,
    PPE_DONNING.basePoints
    - Math.floor(donningElapsed * 2)
    - (donningErrors * PPE_DONNING.penaltyPerWrongTap)
  );
  const doffingScore = Math.max(0,
    PPE_DOFFING.basePoints
    - Math.floor(doffingElapsed * 2)
    - (doffingErrors * PPE_DOFFING.penaltyPerWrongTap)
  );
  return {
    donningScore,
    doffingScore,
    totalScore: donningScore + doffingScore,
  };
}

export function calculateFirstResponseScore(
  timeRemaining: number,
  correctFirstTaps: number,
  _totalSteps: number,
  wrongTaps: number,
): number {
  const accuracyScore = correctFirstTaps * MODE2_CONFIG.pointsPerCorrect;
  const timeBonus = Math.floor(timeRemaining);  // 1 point per second remaining
  const wrongPenalty = wrongTaps * MODE2_CONFIG.wrongTapPointPenalty;
  return Math.max(0, accuracyScore + timeBonus - wrongPenalty);
}

// ============================================================
// POST-GAME TEACHING MOMENTS
// ============================================================

export const PPE_TEACHING_MOMENTS = [
  'Doffing order is NOT the reverse of donning — gloves come off first because they are the most contaminated.',
  'The mask stays on last during doffing to maintain respiratory protection while removing other contaminated items.',
  'In the 2014 Ebola response, strict PPE protocols prevented a single transmission to healthcare workers who followed CDC guidance.',
  'Hand hygiene after doffing is not optional — it is the final and critical step that protects you and your colleagues.',
  'During the COVID-19 pandemic, improper doffing was identified as a leading cause of healthcare worker infections.',
];

export const INVESTIGATION_TEACHING_MOMENTS = [
  'In practice, these 10 steps often overlap — but knowing the framework keeps the investigation on track.',
  'EIS officers have used this framework in over 4,000 outbreak investigations across 165+ countries.',
  'Step 6 — descriptive epidemiology — is where most outbreaks reveal their secrets. The epi curve tells the story.',
  'Control measures don\'t always wait for step 9. Preliminary actions are often taken as soon as initial findings emerge.',
  'Communication is listed last, but effective outbreak communication begins on Day 1 and continues throughout.',
];

// Helper: shuffle an array (Fisher-Yates)
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Helper: get random element
export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
