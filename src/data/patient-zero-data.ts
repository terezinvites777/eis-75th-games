// src/data/patient-zero-data.ts
// Where in the World is Patient Zero? mystery data

import type { MysteryDefinition } from '../types/patient-zero';

export const mysteries: MysteryDefinition[] = [
  // ============================================
  // 75th ANNIVERSARY FEATURED MYSTERY
  // ============================================
  {
    id: '75th-anniversary-grand',
    title: 'The 75th Anniversary Case',
    isFeatured: true,
    coordinates: { lat: 39.95, lng: -75.16 }, // Philadelphia
    solution: {
      outbreak: "Legionnaires' Disease",
      year: 1976,
      location: 'Philadelphia, Pennsylvania',
      pathogen: 'Legionella pneumophila',
      source: 'Bellevue-Stratford Hotel cooling tower',
      patient_zero_context: 'American Legion convention attendees celebrating the nation\'s bicentennial',
      eis_officers_involved: [
        'David Fraser (Lead Investigator)',
        'Joseph McDade (Discovered the pathogen)',
        'Charles Shepard',
        'And 17 other EIS Officers',
      ],
    },
    clues: [
      // Day 1 AM
      {
        day: 1,
        time: 'am',
        content: 'The year is significant - the entire nation was celebrating. Red, white, and blue decorations everywhere. America\'s 200th birthday.',
        hint_level: 'vague',
      },
      // Day 1 PM
      {
        day: 1,
        time: 'pm',
        content: 'A large gathering of patriots - men who served their country - came together at a grand historic hotel in a major East Coast city.',
        hint_level: 'vague',
      },
      // Day 2 AM
      {
        day: 2,
        time: 'am',
        content: '182 became ill. 29 died. Most victims were older men, many with military backgrounds. A mysterious pneumonia was striking attendees.',
        hint_level: 'moderate',
      },
      // Day 2 PM
      {
        day: 2,
        time: 'pm',
        content: 'Standard bacterial cultures found nothing. This was no ordinary pneumonia. Scientists were baffled for months. The pathogen was unknown to science.',
        hint_level: 'moderate',
      },
      // Day 3 AM
      {
        day: 3,
        time: 'am',
        content: 'The CDC deployed 20 EIS officers - the largest team in program history at that time. Cases clustered among those who spent time in the hotel lobby.',
        hint_level: 'specific',
      },
      // Day 3 PM
      {
        day: 3,
        time: 'pm',
        content: 'Six months after the outbreak, Joseph McDade finally isolated a new bacterium from lung tissue. It thrived in warm water - like that found in air conditioning systems.',
        hint_level: 'specific',
      },
    ],
    historicalContext: `This outbreak transformed public health forever. It led to:
    - Discovery of an entirely new bacterial species (Legionella pneumophila)
    - New understanding of environmental transmission routes
    - Water system regulations in buildings worldwide
    - The Bellevue-Stratford Hotel closing permanently

    This investigation exemplifies why EIS exists: to solve the unsolvable and protect the public from threats we don't even know exist yet.`,
    impactStats: {
      totalCases: 182,
      deaths: 29,
      statesAffected: 23,
      eisOfficersDeployed: 20,
      monthsToIdentify: 6,
    },
  },

  // ============================================
  // STANDARD MYSTERIES
  // ============================================
  {
    id: 'hantavirus-1993',
    title: 'The Four Corners Killer',
    coordinates: { lat: 36.99, lng: -109.05 }, // Four Corners region
    solution: {
      outbreak: 'Hantavirus Pulmonary Syndrome',
      year: 1993,
      location: 'Four Corners region (NM, AZ, CO, UT)',
      pathogen: 'Sin Nombre virus',
      source: 'Deer mice population explosion following El Niño rains',
      patient_zero_context: 'Young, healthy Navajo residents in rural areas',
      eis_officers_involved: ['Jay Butler', 'Jeffrey Duchin'],
    },
    clues: [
      {
        day: 1,
        time: 'am',
        content: 'May 1993: Young, previously healthy adults in the American Southwest are dying suddenly of respiratory failure.',
        hint_level: 'vague',
      },
      {
        day: 1,
        time: 'pm',
        content: 'Victims come from rural areas where four states meet. Many live in remote areas with traditional lifestyles.',
        hint_level: 'vague',
      },
      {
        day: 2,
        time: 'am',
        content: 'Local healers recall similar deaths in the past. Navajo elders speak of a connection to abundant rainfall and rodents.',
        hint_level: 'moderate',
      },
      {
        day: 2,
        time: 'pm',
        content: 'Following heavy El Niño rains, the pinon nut harvest was exceptional. Small mammal populations exploded tenfold.',
        hint_level: 'moderate',
      },
      {
        day: 3,
        time: 'am',
        content: 'Victims had contact with mouse droppings during spring cleaning of homes and outbuildings. Inhalation is suspected.',
        hint_level: 'specific',
      },
      {
        day: 3,
        time: 'pm',
        content: 'A previously unknown virus, related to Korean hemorrhagic fever virus, is isolated from deer mice near victims\' homes.',
        hint_level: 'specific',
      },
    ],
    impactStats: {
      totalCases: 48,
      deaths: 27,
      statesAffected: 4,
    },
  },
  {
    id: 'toxic-shock-1980',
    title: 'The Menstrual Mystery',
    coordinates: { lat: 39.83, lng: -98.58 }, // Geographic center of US (nationwide)
    solution: {
      outbreak: 'Toxic Shock Syndrome',
      year: 1980,
      location: 'Nationwide (USA)',
      pathogen: 'Staphylococcus aureus (TSST-1 toxin)',
      source: 'Super-absorbent tampons (Rely brand)',
      patient_zero_context: 'Young menstruating women using new high-absorbency tampons',
      eis_officers_involved: ['Kathryn Shands', 'Dan Hightower'],
    },
    clues: [
      {
        day: 1,
        time: 'am',
        content: '1980: Reports surge of young women experiencing sudden high fever, rash, low blood pressure, and multi-organ failure.',
        hint_level: 'vague',
      },
      {
        day: 1,
        time: 'pm',
        content: 'Cases are predominantly healthy women in their teens and twenties. Most cases occur monthly in a predictable pattern.',
        hint_level: 'vague',
      },
      {
        day: 2,
        time: 'am',
        content: 'EIS officers Kathryn Shands and team notice cases cluster during a specific week of patients\' monthly cycles.',
        hint_level: 'moderate',
      },
      {
        day: 2,
        time: 'pm',
        content: 'Interviews reveal a common factor: patients were using a new consumer product advertised as "super absorbent" for extended periods.',
        hint_level: 'moderate',
      },
      {
        day: 3,
        time: 'am',
        content: 'Laboratory analysis finds Staphylococcus aureus producing a powerful toxin. The synthetic material creates an ideal bacterial environment.',
        hint_level: 'specific',
      },
      {
        day: 3,
        time: 'pm',
        content: 'Procter & Gamble\'s Rely brand identified as highest risk. Product is voluntarily recalled after EIS investigation.',
        hint_level: 'specific',
      },
    ],
    impactStats: {
      totalCases: 812,
      deaths: 38,
      statesAffected: 50,
    },
  },
];

// Export featured mystery separately for easy access
export const featuredMystery = mysteries.find(m => m.isFeatured);

export function getMysteryById(id: string): MysteryDefinition | undefined {
  return mysteries.find(m => m.id === id);
}

export function getCluesForDay(mystery: MysteryDefinition, day: number): typeof mystery.clues {
  return mystery.clues.filter(c => c.day <= day);
}

// Calculate score based on when theory was submitted
export function calculateTheoryScore(
  theory: { outbreak_name: string; year: number; location: string; pathogen: string; source?: string },
  solution: MysteryDefinition['solution'],
  daySubmitted: number
): number {
  let score = 0;

  // Outbreak name match (case insensitive, partial matching)
  const outbreakMatch = solution.outbreak.toLowerCase().includes(theory.outbreak_name.toLowerCase()) ||
    theory.outbreak_name.toLowerCase().includes(solution.outbreak.toLowerCase());
  if (outbreakMatch) score += 250;

  // Year match (exact or within 2 years)
  const yearDiff = Math.abs(theory.year - solution.year);
  if (yearDiff === 0) score += 250;
  else if (yearDiff <= 2) score += 125;

  // Location match (partial)
  const locationMatch = solution.location.toLowerCase().includes(theory.location.toLowerCase()) ||
    theory.location.toLowerCase().includes(solution.location.toLowerCase());
  if (locationMatch) score += 250;

  // Pathogen match (partial)
  const pathogenMatch = solution.pathogen.toLowerCase().includes(theory.pathogen.toLowerCase()) ||
    theory.pathogen.toLowerCase().includes(solution.pathogen.toLowerCase());
  if (pathogenMatch) score += 250;

  // Source match (bonus, if provided)
  if (theory.source && solution.source) {
    const sourceMatch = solution.source.toLowerCase().includes(theory.source.toLowerCase()) ||
      theory.source.toLowerCase().includes(solution.source.toLowerCase());
    if (sourceMatch) score += 100;
  }

  // Day bonus: earlier submissions get more points
  const dayMultiplier = daySubmitted === 1 ? 2.0 : daySubmitted === 2 ? 1.5 : 1.0;

  return Math.floor(score * dayMultiplier);
}
