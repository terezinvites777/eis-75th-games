// src/data/command-scenarios.ts
// Outbreak Command game scenarios

import type { CommandScenario } from '../types/command';

export const commandScenarios: CommandScenario[] = [
  {
    id: 'salmonella-2024',
    title: 'Salmonella Surge',
    subtitle: 'Multi-state foodborne outbreak',
    difficulty: 'easy',
    pathogen: {
      name: 'Salmonella enteritidis',
      transmission: 'Contaminated food products',
      r0: 0,
      fatality_rate: 0.001,
    },
    initial_state: {
      cases: 45,
      budget: 500000,
      personnel: 8,
    },
    initial_locations: [
      { state: 'TX', cases: 18, lat: 31.0, lng: -100.0 },
      { state: 'OK', cases: 12, lat: 35.5, lng: -97.5 },
      { state: 'AR', cases: 15, lat: 34.8, lng: -92.2 },
    ],
    briefing: `A cluster of Salmonella enteritidis infections has been identified across Texas, Oklahoma, and Arkansas. Initial interviews suggest a common food source. Your mission: identify the source and contain the outbreak before it spreads further.`,
    available_actions: [
      {
        id: 'case-interviews',
        name: 'Intensive Case Interviews',
        cost: 25000,
        duration: 2,
        effect: '+30% source ID chance',
        description: 'Deploy teams to conduct detailed food history interviews with all confirmed cases.',
      },
      {
        id: 'lab-analysis',
        name: 'Enhanced Lab Analysis',
        cost: 50000,
        duration: 3,
        effect: '+40% source ID chance',
        description: 'Rush whole-genome sequencing to identify outbreak strain patterns.',
      },
      {
        id: 'trace-back',
        name: 'Supply Chain Traceback',
        cost: 75000,
        duration: 4,
        effect: 'Identifies distributor',
        description: 'Work with FDA to trace implicated products through distribution networks.',
      },
      {
        id: 'public-notice',
        name: 'Public Health Notice',
        cost: 15000,
        duration: 1,
        effect: '-20% new cases',
        description: 'Issue advisory warning consumers about suspected products.',
      },
      {
        id: 'recall',
        name: 'Product Recall',
        cost: 100000,
        duration: 2,
        effect: '-50% new cases, source contained',
        description: 'Coordinate voluntary recall with manufacturer (requires source ID).',
      },
    ],
    events: [
      {
        day: 3,
        title: 'Media Inquiry',
        description: 'Local news is asking about the outbreak. How do you respond?',
        choices: [
          { label: 'Full transparency', effect: { budget: -10000 } },
          { label: 'Limited statement', effect: {} },
        ],
      },
      {
        day: 5,
        title: 'New State Reports',
        description: 'Louisiana reports 8 matching cases.',
        effect: {
          cases: 8,
          outbreak_locations: [{ state: 'LA', cases: 8, lat: 30.9, lng: -91.1 }],
        },
      },
    ],
    win_state: {
      source_identified: true,
      cases_below: 150,
    },
    lose_state: {
      cases_above: 500,
      budget_below: 0,
    },
  },
  {
    id: 'legionella-hotel',
    title: 'Hotel Outbreak',
    subtitle: 'Legionnaires\' disease cluster',
    difficulty: 'medium',
    pathogen: {
      name: 'Legionella pneumophila',
      transmission: 'Contaminated water aerosols',
      r0: 0,
      fatality_rate: 0.1,
    },
    initial_state: {
      cases: 12,
      budget: 400000,
      personnel: 6,
    },
    initial_locations: [
      { state: 'GA', cases: 12, lat: 33.75, lng: -84.39 },
    ],
    briefing: `Twelve cases of Legionnaires' disease have been linked to guests at a major Atlanta hotel. Three patients are in ICU. The hotel hosts a conference next week with 2,000 expected attendees. Time is critical.`,
    available_actions: [
      {
        id: 'water-sampling',
        name: 'Water System Sampling',
        cost: 30000,
        duration: 2,
        effect: '+50% source ID chance',
        description: 'Collect samples from cooling towers, hot water systems, decorative fountains.',
      },
      {
        id: 'guest-survey',
        name: 'Guest Survey',
        cost: 20000,
        duration: 2,
        effect: '+25% source ID chance',
        description: 'Contact recent guests to identify additional cases and exposure patterns.',
      },
      {
        id: 'emergency-treatment',
        name: 'Water System Treatment',
        cost: 80000,
        duration: 1,
        effect: 'Stops new exposures',
        description: 'Emergency hyperchlorination of hotel water systems.',
      },
      {
        id: 'hotel-closure',
        name: 'Recommend Closure',
        cost: 0,
        duration: 1,
        effect: 'Stops new exposures, -$200k legal risk',
        description: 'Recommend hotel temporarily close pending investigation.',
      },
      {
        id: 'press-conference',
        name: 'Joint Press Conference',
        cost: 5000,
        duration: 1,
        effect: 'Public awareness',
        description: 'Hold press conference with hotel management and health officials.',
      },
    ],
    events: [
      {
        day: 2,
        title: 'ICU Death',
        description: 'One of the ICU patients has died. Family is considering legal action.',
        effect: { deaths: 1, budget: -50000 },
      },
      {
        day: 4,
        title: 'Conference Decision',
        description: 'Conference organizers ask for your recommendation.',
        choices: [
          { label: 'Recommend cancellation', effect: { budget: -100000 } },
          { label: 'Proceed with precautions', effect: { cases: 5 } },
        ],
      },
    ],
    win_state: {
      source_identified: true,
      cases_below: 50,
    },
    lose_state: {
      deaths_above: 5,
      cases_above: 100,
    },
  },
  {
    id: 'measles-community',
    title: 'Measles in Metro',
    subtitle: 'Undervaccinated community outbreak',
    difficulty: 'hard',
    pathogen: {
      name: 'Measles virus',
      transmission: 'Airborne/respiratory',
      r0: 15,
      fatality_rate: 0.002,
    },
    initial_state: {
      cases: 8,
      budget: 600000,
      personnel: 10,
    },
    initial_locations: [
      { state: 'WA', cases: 8, lat: 45.63, lng: -122.67 },
    ],
    briefing: `Eight confirmed measles cases in Clark County, Washington, centered in a community with vaccine exemption rates above 20%. The index case visited multiple public locations while infectious. With measles' R0 of 15, rapid action is essential.`,
    available_actions: [
      {
        id: 'contact-tracing',
        name: 'Aggressive Contact Tracing',
        cost: 40000,
        duration: 1,
        effect: 'Identifies 80% contacts',
        description: 'Deploy full team to trace all contacts at exposure sites.',
      },
      {
        id: 'vaccination-clinic',
        name: 'Emergency Vaccination Clinics',
        cost: 100000,
        duration: 3,
        effect: '-30% susceptible population',
        description: 'Set up free MMR vaccination clinics in affected areas.',
      },
      {
        id: 'school-exclusion',
        name: 'School Exclusion Order',
        cost: 10000,
        duration: 1,
        effect: '-40% child transmission',
        description: 'Exclude unvaccinated students from schools for 21 days.',
      },
      {
        id: 'pep-campaign',
        name: 'Post-Exposure Prophylaxis',
        cost: 50000,
        duration: 2,
        effect: '-25% secondary cases',
        description: 'Offer MMR or immune globulin to exposed contacts within 72 hours.',
      },
      {
        id: 'community-outreach',
        name: 'Community Outreach',
        cost: 30000,
        duration: 2,
        effect: '+15% vaccination uptake',
        description: 'Partner with community leaders for culturally appropriate education.',
      },
    ],
    events: [
      {
        day: 2,
        title: 'Hospital Exposure',
        description: 'A case visited the ER while infectious. 50 people potentially exposed.',
        effect: { cases: 3 },
      },
      {
        day: 5,
        title: 'Anti-Vaccine Rally',
        description: 'Organized protest against school exclusion order.',
        choices: [
          { label: 'Maintain exclusion', effect: { budget: -20000 } },
          { label: 'Modify policy', effect: { cases: 10 } },
        ],
      },
      {
        day: 8,
        title: 'Pediatric ICU Case',
        description: 'Infant too young for vaccination develops measles encephalitis.',
        effect: { deaths: 1 },
      },
    ],
    win_state: {
      r_below: 1,
      cases_below: 75,
    },
    lose_state: {
      cases_above: 200,
      deaths_above: 3,
    },
  },
  {
    id: 'novel-respiratory',
    title: 'Unknown Pathogen',
    subtitle: 'Novel respiratory illness',
    difficulty: 'expert',
    pathogen: {
      name: 'Novel Coronavirus',
      transmission: 'Respiratory droplets/aerosols',
      r0: 2.5,
      fatality_rate: 0.02,
    },
    initial_state: {
      cases: 5,
      budget: 800000,
      personnel: 12,
    },
    initial_locations: [
      { state: 'CA', cases: 3, lat: 37.77, lng: -122.42 },
      { state: 'WA', cases: 2, lat: 47.61, lng: -122.33 },
    ],
    briefing: `Five cases of severe pneumonia with an unknown etiology have been identified in travelers returning from abroad. Two are healthcare workers. Initial testing rules out influenza and known coronaviruses. CDC lab is working on identification. The situation is evolving rapidly.`,
    available_actions: [
      {
        id: 'cdc-lab',
        name: 'Priority CDC Lab Analysis',
        cost: 100000,
        duration: 3,
        effect: 'Pathogen identification',
        description: 'Rush samples to CDC for novel pathogen identification.',
      },
      {
        id: 'isolation-protocols',
        name: 'Enhanced Isolation Protocols',
        cost: 50000,
        duration: 1,
        effect: '-30% HCW infections',
        description: 'Implement airborne precautions at all treating facilities.',
      },
      {
        id: 'travel-screening',
        name: 'Airport Health Screening',
        cost: 200000,
        duration: 2,
        effect: 'Identifies imported cases',
        description: 'Deploy screeners at major airports for flights from affected regions.',
      },
      {
        id: 'surge-capacity',
        name: 'Hospital Surge Planning',
        cost: 150000,
        duration: 3,
        effect: '+50% treatment capacity',
        description: 'Activate emergency hospital surge protocols.',
      },
      {
        id: 'risk-communication',
        name: 'Risk Communication Campaign',
        cost: 75000,
        duration: 2,
        effect: 'Reduces panic, +10% compliance',
        description: 'Launch coordinated public messaging about symptoms and precautions.',
      },
      {
        id: 'contact-quarantine',
        name: 'Contact Quarantine',
        cost: 100000,
        duration: 1,
        effect: '-40% secondary transmission',
        description: 'Implement 14-day quarantine for all close contacts.',
      },
    ],
    events: [
      {
        day: 2,
        title: 'Healthcare Worker Infected',
        description: 'A nurse caring for patients tests positive.',
        effect: { cases: 1, personnel: -1 },
      },
      {
        day: 4,
        title: 'Pathogen Identified',
        description: 'CDC confirms novel coronavirus. Developing specific tests now.',
        effect: {},
      },
      {
        day: 6,
        title: 'Community Transmission',
        description: 'Case with no travel history identified. Community spread confirmed.',
        effect: { cases: 8 },
      },
      {
        day: 8,
        title: 'National Emergency',
        description: 'HHS declares public health emergency. Additional resources available.',
        choices: [
          { label: 'Request federal support', effect: { budget: 500000, personnel: 20 } },
          { label: 'Maintain state control', effect: {} },
        ],
      },
    ],
    win_state: {
      r_below: 1,
      source_identified: true,
    },
    lose_state: {
      cases_above: 1000,
      deaths_above: 20,
    },
  },
];

export function getScenarioById(id: string): CommandScenario | undefined {
  return commandScenarios.find(s => s.id === id);
}

export function getScenariosByDifficulty(difficulty: CommandScenario['difficulty']): CommandScenario[] {
  return commandScenarios.filter(s => s.difficulty === difficulty);
}
