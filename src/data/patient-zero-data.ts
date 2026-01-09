// src/data/patient-zero-data.ts
// Where in the World is Patient Zero? mystery data

import type { MysteryDefinition } from '../types/patient-zero';

export const mysteries: MysteryDefinition[] = [
  {
    id: 'legionnaires-1976',
    title: 'The Philadelphia Mystery',
    solution: {
      outbreak: 'Legionnaires\' Disease',
      year: 1976,
      location: 'Philadelphia, Pennsylvania',
      pathogen: 'Legionella pneumophila',
      source: 'Air conditioning cooling tower at Bellevue-Stratford Hotel',
      patient_zero_context: 'American Legion convention attendees staying at the hotel',
      eis_officers_involved: ['David Fraser', 'Joseph McDade', 'Charles Shepard'],
    },
    clues: [
      {
        day: 1,
        time: 'am',
        content: 'July 1976: A large patriotic gathering brings thousands to a major East Coast city for the nation\'s bicentennial celebration.',
        hint_level: 'vague',
      },
      {
        day: 1,
        time: 'pm',
        content: 'Within days of returning home, attendees from multiple states begin experiencing severe pneumonia. Death toll rises rapidly.',
        hint_level: 'vague',
      },
      {
        day: 2,
        time: 'am',
        content: 'EIS officers note that most cases stayed at the same historic hotel. Indoor exposure seems likely.',
        hint_level: 'moderate',
      },
      {
        day: 2,
        time: 'pm',
        content: 'Standard bacterial cultures are negative. This is no ordinary pneumonia. The pathogen is unknown to science.',
        hint_level: 'moderate',
      },
      {
        day: 3,
        time: 'am',
        content: 'Investigation focuses on the hotel\'s ventilation system. Cases cluster among those who spent time in the lobby.',
        hint_level: 'specific',
      },
      {
        day: 3,
        time: 'pm',
        content: 'Six months later, CDC microbiologist Joseph McDade identifies a new bacterium in lung tissue samples. It thrives in warm water systems.',
        hint_level: 'specific',
      },
    ],
  },
  {
    id: 'hantavirus-1993',
    title: 'The Four Corners Killer',
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
  },
  {
    id: 'toxic-shock-1980',
    title: 'The Menstrual Mystery',
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
  },
];

export function getMysteryById(id: string): MysteryDefinition | undefined {
  return mysteries.find(m => m.id === id);
}

export function getCluesForDay(mystery: MysteryDefinition, day: number): typeof mystery.clues {
  return mystery.clues.filter(c => c.day <= day);
}

// Calculate score based on when theory was submitted
export function calculateTheoryScore(
  theory: { outbreak_name: string; year: number; location: string; pathogen: string },
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

  // Day bonus: earlier submissions get more points
  const dayMultiplier = daySubmitted === 1 ? 2.0 : daySubmitted === 2 ? 1.5 : 1.0;

  return Math.floor(score * dayMultiplier);
}
