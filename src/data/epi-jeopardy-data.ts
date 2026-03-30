// src/data/epi-jeopardy-data.ts
// Epi Jeopardy — Head-to-Head Trivia Game
// Two players race to answer EIS/epidemiology trivia on a split-screen touch display

// ============================================================
// TYPES
// ============================================================

export interface TriviaQuestion {
  id: string;
  category: CategoryId;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;          // 100, 200, 300, 400, 500
  question: string;
  options: [string, string, string, string];  // Always 4 options
  correctIndex: number;    // 0-3
  explanation: string;     // Shown after both players answer or time expires
}

export type CategoryId =
  | 'outbreak-history'
  | 'pathogens'
  | 'epi-methods'
  | 'famous-investigations'
  | 'global-health';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;          // Hex color for category header
  description: string;
}

export interface PlayerState {
  id: 'player1' | 'player2';
  label: string;
  score: number;
  streak: number;
  answeredCorrect: number;
  answeredWrong: number;
  currentAnswer: number | null;   // Index of selected option, null if not yet answered
  answerTime: number | null;      // Milliseconds from question display to answer
  isLocked: boolean;              // True after tapping an answer
}

export interface RoundState {
  questionIndex: number;
  totalQuestions: number;
  currentQuestion: TriviaQuestion;
  timeRemaining: number;         // Seconds
  phase: 'category-reveal' | 'question' | 'result' | 'final-score';
  player1: PlayerState;
  player2: PlayerState;
}

// ============================================================
// CATEGORIES
// ============================================================

export const CATEGORIES: Category[] = [
  {
    id: 'outbreak-history',
    name: 'Outbreak History',
    icon: '📜',
    color: '#B8860B',
    description: '75 years of EIS investigations',
  },
  {
    id: 'pathogens',
    name: 'Know Your Pathogen',
    icon: '🦠',
    color: '#dc2626',
    description: 'Bacteria, viruses, and the diseases they cause',
  },
  {
    id: 'epi-methods',
    name: 'Epi Methods',
    icon: '📊',
    color: '#0057B8',
    description: 'Tools and techniques of field epidemiology',
  },
  {
    id: 'famous-investigations',
    name: 'Famous Investigations',
    icon: '🔍',
    color: '#7A2A7E',
    description: 'Landmark cases that changed public health',
  },
  {
    id: 'global-health',
    name: 'Global Health',
    icon: '🌍',
    color: '#0d9488',
    description: 'Worldwide outbreaks and eradication efforts',
  },
];

// ============================================================
// GAME CONFIGURATION
// ============================================================

export const GAME_CONFIG = {
  questionsPerRound: 10,        // Total questions in a full game
  timePerQuestion: 12,          // Seconds to answer each question
  pointsForSpeed: true,         // Faster correct answer gets bonus
  speedBonusMax: 50,            // Max bonus points for fastest answer
  streakBonusThreshold: 3,      // Streak of 3+ correct = bonus multiplier
  streakBonusMultiplier: 1.5,   // 1.5x points during a streak
  categoryRevealTime: 2,        // Seconds to show category before question
  resultDisplayTime: 4,         // Seconds to show result before next question
  finalScoreDisplayTime: 15,    // Seconds before auto-reset to attract
};

// ============================================================
// QUESTION BANK
// ============================================================

export const QUESTIONS: TriviaQuestion[] = [
  // ─────────────────────────────────────────────
  // OUTBREAK HISTORY (10 questions)
  // ─────────────────────────────────────────────
  {
    id: 'oh-1',
    category: 'outbreak-history',
    difficulty: 'easy',
    points: 100,
    question: 'In what year was the Epidemic Intelligence Service (EIS) founded?',
    options: ['1946', '1951', '1955', '1962'],
    correctIndex: 1,
    explanation: 'Dr. Alexander Langmuir founded the EIS in 1951 as a sentinel program against biological warfare threats during the Cold War.',
  },
  {
    id: 'oh-2',
    category: 'outbreak-history',
    difficulty: 'easy',
    points: 100,
    question: 'The Cutter Incident of 1955 involved a safety failure in which vaccine?',
    options: ['Smallpox', 'Measles', 'Polio', 'Influenza'],
    correctIndex: 2,
    explanation: 'Improperly inactivated polio vaccine from Cutter Laboratories caused 40,000 cases of polio. EIS officers traced the source in weeks.',
  },
  {
    id: 'oh-3',
    category: 'outbreak-history',
    difficulty: 'medium',
    points: 200,
    question: 'Legionnaires\' Disease was first identified after an outbreak at what type of event in 1976?',
    options: ['A hospital conference', 'An American Legion convention', 'A military base exercise', 'A state fair'],
    correctIndex: 1,
    explanation: 'The 1976 outbreak at an American Legion convention in Philadelphia led to the discovery of Legionella pneumophila — the first new pathogen identified by CDC.',
  },
  {
    id: 'oh-4',
    category: 'outbreak-history',
    difficulty: 'medium',
    points: 200,
    question: 'The first CDC MMWR report on what would become known as AIDS was published in what year?',
    options: ['1978', '1981', '1983', '1985'],
    correctIndex: 1,
    explanation: 'The first report was published June 5, 1981, describing clusters of Pneumocystis pneumonia in young men in Los Angeles.',
  },
  {
    id: 'oh-5',
    category: 'outbreak-history',
    difficulty: 'medium',
    points: 300,
    question: 'The 1993 Four Corners hantavirus outbreak was traced to which animal reservoir?',
    options: ['Bats', 'Prairie dogs', 'Deer mice', 'Raccoons'],
    correctIndex: 2,
    explanation: 'Sin Nombre virus was identified in deer mice populations. The investigation established global surveillance frameworks for rodent-borne pathogens.',
  },
  {
    id: 'oh-6',
    category: 'outbreak-history',
    difficulty: 'hard',
    points: 400,
    question: 'In the 2001 anthrax letter attacks, which exposure route caused the most fatalities?',
    options: ['Cutaneous anthrax from skin contact', 'Inhalation anthrax at postal facilities', 'Gastrointestinal anthrax from contaminated food', 'Injection anthrax from contaminated needles'],
    correctIndex: 1,
    explanation: 'Inhalation anthrax from aerosolized spores during mail sorting at postal facilities was the deadliest form. Five people died; EIS officers developed the first bioterrorism protocols.',
  },
  {
    id: 'oh-7',
    category: 'outbreak-history',
    difficulty: 'easy',
    points: 100,
    question: 'How many outbreak investigations have EIS officers conducted over 75 years?',
    options: ['About 500', 'Over 1,000', 'Over 4,000', 'Over 10,000'],
    correctIndex: 2,
    explanation: 'EIS officers have conducted more than 4,000 investigations across over 165 countries since 1951.',
  },
  {
    id: 'oh-8',
    category: 'outbreak-history',
    difficulty: 'hard',
    points: 400,
    question: 'The 1993 Jack in the Box E. coli outbreak led to what specific food safety standard?',
    options: ['Mandatory pasteurization of milk', 'The 160°F ground beef cooking temperature', 'Banning raw sprouts in restaurants', 'Mandatory hand washing signs'],
    correctIndex: 1,
    explanation: 'The outbreak killed four children and sickened hundreds. EIS investigation led directly to USDA regulations establishing 160°F as the safe internal temperature for ground beef.',
  },
  {
    id: 'oh-9',
    category: 'outbreak-history',
    difficulty: 'medium',
    points: 300,
    question: 'EIS officer Dr. Alice Wang\'s investigation of what crisis confirmed dangerous lead exposure in children?',
    options: ['East Palestine, Ohio train derailment', 'Flint, Michigan water crisis', 'Camp Lejeune water contamination', 'Newark, New Jersey lead pipes'],
    correctIndex: 1,
    explanation: 'Dr. Wang confirmed that thousands of Flint children were exposed to lead after the city switched water sources without corrosion control treatment in 2014.',
  },
  {
    id: 'oh-10',
    category: 'outbreak-history',
    difficulty: 'hard',
    points: 500,
    question: 'Who founded the EIS and what was his original role at CDC?',
    options: ['Jonas Salk — Director of Vaccine Research', 'Alexander Langmuir — Chief Epidemiologist', 'William Foege — Director of CDC', 'David Sencer — Surgeon General'],
    correctIndex: 1,
    explanation: 'Dr. Alexander Langmuir served as CDC\'s Chief Epidemiologist and founded the EIS to create a rapid-response corps of trained disease detectives.',
  },

  // ─────────────────────────────────────────────
  // PATHOGENS (10 questions)
  // ─────────────────────────────────────────────
  {
    id: 'pa-1',
    category: 'pathogens',
    difficulty: 'easy',
    points: 100,
    question: 'Salmonella is most commonly transmitted through which route?',
    options: ['Airborne droplets', 'Contaminated food or water', 'Mosquito bites', 'Direct skin contact'],
    correctIndex: 1,
    explanation: 'Salmonella is a foodborne pathogen most commonly transmitted through contaminated eggs, poultry, meat, and produce.',
  },
  {
    id: 'pa-2',
    category: 'pathogens',
    difficulty: 'easy',
    points: 100,
    question: 'Which type of organism causes tuberculosis?',
    options: ['Virus', 'Bacterium', 'Fungus', 'Parasite'],
    correctIndex: 1,
    explanation: 'Tuberculosis is caused by Mycobacterium tuberculosis, a slow-growing bacterium that primarily affects the lungs.',
  },
  {
    id: 'pa-3',
    category: 'pathogens',
    difficulty: 'medium',
    points: 200,
    question: 'Ebola virus is classified as which type of virus?',
    options: ['Retrovirus', 'Filovirus', 'Coronavirus', 'Flavivirus'],
    correctIndex: 1,
    explanation: 'Ebola is a filovirus, named for its distinctive filament-like shape visible under electron microscopy.',
  },
  {
    id: 'pa-4',
    category: 'pathogens',
    difficulty: 'medium',
    points: 200,
    question: 'Which mosquito genus is the primary vector for Zika, dengue, and yellow fever?',
    options: ['Anopheles', 'Culex', 'Aedes', 'Mansonia'],
    correctIndex: 2,
    explanation: 'Aedes mosquitoes (particularly Aedes aegypti) transmit Zika, dengue, yellow fever, and chikungunya viruses.',
  },
  {
    id: 'pa-5',
    category: 'pathogens',
    difficulty: 'medium',
    points: 300,
    question: 'What is the basic reproduction number (R0) a measure of?',
    options: ['How quickly a pathogen mutates', 'How many people one infected person will infect on average', 'The case fatality rate of a disease', 'The incubation period in days'],
    correctIndex: 1,
    explanation: 'R0 represents the average number of secondary infections produced by one infected individual in a fully susceptible population.',
  },
  {
    id: 'pa-6',
    category: 'pathogens',
    difficulty: 'hard',
    points: 400,
    question: 'Prions cause disease by inducing what process in normal proteins?',
    options: ['Oxidative damage to cell membranes', 'Misfolding of normal prion proteins', 'Insertion of viral DNA into the genome', 'Blocking neurotransmitter receptors'],
    correctIndex: 1,
    explanation: 'Prions are misfolded proteins that cause normal proteins to refold abnormally, leading to fatal neurodegenerative diseases like CJD.',
  },
  {
    id: 'pa-7',
    category: 'pathogens',
    difficulty: 'easy',
    points: 100,
    question: 'Which pathogen causes COVID-19?',
    options: ['SARS-CoV-1', 'MERS-CoV', 'SARS-CoV-2', 'Influenza A H1N1'],
    correctIndex: 2,
    explanation: 'COVID-19 is caused by SARS-CoV-2, a novel coronavirus first identified in late 2019.',
  },
  {
    id: 'pa-8',
    category: 'pathogens',
    difficulty: 'hard',
    points: 400,
    question: 'Legionella pneumophila thrives in what specific environment?',
    options: ['Soil contaminated with bird droppings', 'Warm water systems like cooling towers', 'Raw shellfish from coastal waters', 'Improperly stored grain products'],
    correctIndex: 1,
    explanation: 'Legionella thrives in warm water (77-113°F) in human-made systems like cooling towers, hot tubs, and large plumbing systems.',
  },
  {
    id: 'pa-9',
    category: 'pathogens',
    difficulty: 'medium',
    points: 300,
    question: 'Which of these diseases has been fully eradicated in humans?',
    options: ['Polio', 'Smallpox', 'Measles', 'Malaria'],
    correctIndex: 1,
    explanation: 'Smallpox remains the only human infectious disease to be fully eradicated, declared by WHO in 1980 after a global surveillance-containment campaign.',
  },
  {
    id: 'pa-10',
    category: 'pathogens',
    difficulty: 'hard',
    points: 500,
    question: 'Antimicrobial resistance is accelerated by all of the following EXCEPT:',
    options: ['Overuse of antibiotics in livestock', 'Patients not completing antibiotic courses', 'Using narrow-spectrum targeted antibiotics', 'Prescribing antibiotics for viral infections'],
    correctIndex: 2,
    explanation: 'Narrow-spectrum antibiotics target specific pathogens and actually help reduce resistance compared to broad-spectrum antibiotics that kill beneficial bacteria.',
  },

  // ─────────────────────────────────────────────
  // EPI METHODS (10 questions)
  // ─────────────────────────────────────────────
  {
    id: 'em-1',
    category: 'epi-methods',
    difficulty: 'easy',
    points: 100,
    question: 'An "epi curve" displays what information?',
    options: ['Geographic spread of cases on a map', 'Number of cases over time', 'Survival rates by age group', 'Cost of outbreak response'],
    correctIndex: 1,
    explanation: 'An epidemic curve (epi curve) is a histogram showing the number of new cases over time, revealing the pattern and progression of an outbreak.',
  },
  {
    id: 'em-2',
    category: 'epi-methods',
    difficulty: 'easy',
    points: 100,
    question: 'What does a "case definition" establish in an outbreak investigation?',
    options: ['The budget for the investigation', 'Standard criteria for identifying who has the disease', 'The legal liability of the source', 'The number of investigators needed'],
    correctIndex: 1,
    explanation: 'A case definition establishes standard criteria — including person, place, time, and clinical information — for consistently identifying cases in an outbreak.',
  },
  {
    id: 'em-3',
    category: 'epi-methods',
    difficulty: 'medium',
    points: 200,
    question: 'In a case-control study, what are "controls"?',
    options: ['People who have the disease being studied', 'People who are similar to cases but do NOT have the disease', 'Healthcare workers managing the outbreak', 'Laboratory samples used for comparison'],
    correctIndex: 1,
    explanation: 'Controls are individuals without the disease who are compared with cases to identify differences in exposures that might explain why cases got sick.',
  },
  {
    id: 'em-4',
    category: 'epi-methods',
    difficulty: 'medium',
    points: 300,
    question: 'What is "shoe-leather epidemiology"?',
    options: ['Using GPS to track disease spread', 'Conducting fieldwork by going door-to-door to interview cases', 'Analyzing large datasets with computer models', 'Testing environmental samples in laboratories'],
    correctIndex: 1,
    explanation: 'Shoe-leather epidemiology refers to the hands-on fieldwork of going to where patients are, interviewing them, and gathering evidence in person — the hallmark of EIS work.',
  },
  {
    id: 'em-5',
    category: 'epi-methods',
    difficulty: 'medium',
    points: 200,
    question: 'A "line listing" in an outbreak investigation is:',
    options: ['A list of all possible pathogens', 'A spreadsheet where each row is one case with key details', 'A ranked list of suspected food sources', 'A chain-of-command organizational chart'],
    correctIndex: 1,
    explanation: 'A line listing is a table where each row represents a single case and columns capture key variables like onset date, symptoms, demographics, and exposures.',
  },
  {
    id: 'em-6',
    category: 'epi-methods',
    difficulty: 'hard',
    points: 400,
    question: 'What is the primary purpose of "ring vaccination" during an outbreak?',
    options: ['Vaccinate the entire population of a country', 'Vaccinate only contacts and contacts-of-contacts around each case', 'Vaccinate healthcare workers first, then the public', 'Vaccinate only children under age 5'],
    correctIndex: 1,
    explanation: 'Ring vaccination creates a buffer of immune individuals around each case, breaking transmission chains without requiring mass vaccination. It was key to smallpox eradication.',
  },
  {
    id: 'em-7',
    category: 'epi-methods',
    difficulty: 'easy',
    points: 100,
    question: 'What does "contact tracing" involve?',
    options: ['Testing water supplies for contamination', 'Identifying and monitoring people who had contact with infected persons', 'Tracing the genetic sequence of a pathogen', 'Tracking shipments of contaminated food products'],
    correctIndex: 1,
    explanation: 'Contact tracing identifies people who were in contact with an infected person, monitors them for symptoms, and can break chains of transmission.',
  },
  {
    id: 'em-8',
    category: 'epi-methods',
    difficulty: 'hard',
    points: 400,
    question: 'An odds ratio greater than 1.0 in a case-control study suggests:',
    options: ['The exposure is protective against the disease', 'There is no association between exposure and disease', 'The exposure is associated with increased risk of disease', 'The study has insufficient sample size'],
    correctIndex: 2,
    explanation: 'An odds ratio > 1.0 means cases were more likely to have been exposed than controls, suggesting the exposure increases risk. An OR < 1.0 suggests protection.',
  },
  {
    id: 'em-9',
    category: 'epi-methods',
    difficulty: 'medium',
    points: 300,
    question: 'Whole-genome sequencing (WGS) helps outbreak investigations by:',
    options: ['Identifying the nationality of infected patients', 'Determining the exact genetic fingerprint to link cases to a common source', 'Predicting how long a patient will be sick', 'Measuring the amount of pathogen in the environment'],
    correctIndex: 1,
    explanation: 'WGS provides precise genetic data that can confirm whether cases share the same strain, link them to a common source, and distinguish outbreak strains from background infections.',
  },
  {
    id: 'em-10',
    category: 'epi-methods',
    difficulty: 'hard',
    points: 500,
    question: 'The "attack rate" in a foodborne outbreak investigation measures:',
    options: ['How quickly the pathogen spreads through a population', 'The proportion of people exposed to a food item who became ill', 'The number of new cases per day', 'The mortality rate among hospitalized patients'],
    correctIndex: 1,
    explanation: 'The attack rate is the proportion of people who ate a specific food and became ill, compared with those who did not eat it — used to identify the implicated food item.',
  },

  // ─────────────────────────────────────────────
  // FAMOUS INVESTIGATIONS (10 questions)
  // ─────────────────────────────────────────────
  {
    id: 'fi-1',
    category: 'famous-investigations',
    difficulty: 'easy',
    points: 100,
    question: 'John Snow\'s 1854 cholera investigation in London is famous for identifying what source?',
    options: ['Contaminated milk from a local dairy', 'The Broad Street water pump', 'Sewage from the Thames River', 'Imported fruit from India'],
    correctIndex: 1,
    explanation: 'John Snow mapped cholera deaths and traced them to a contaminated water pump on Broad Street — a founding moment in epidemiology.',
  },
  {
    id: 'fi-2',
    category: 'famous-investigations',
    difficulty: 'medium',
    points: 200,
    question: 'CDC\'s investigation of folic acid and neural tube defects led to what public health action?',
    options: ['Mandatory genetic screening for pregnant women', 'Fortification of grain products with folic acid', 'A nationwide prenatal vitamin distribution program', 'Banning certain pesticides near farms'],
    correctIndex: 1,
    explanation: 'CDC found that folic acid could reduce neural tube defects by up to 70%, leading to mandatory folic acid fortification of grain products in the United States.',
  },
  {
    id: 'fi-3',
    category: 'famous-investigations',
    difficulty: 'medium',
    points: 300,
    question: 'During the early AIDS epidemic, EIS officers relied primarily on what method before any diagnostic test existed?',
    options: ['Animal model studies', 'Mass serological screening', 'Case interviews and cluster analysis', 'Environmental sampling'],
    correctIndex: 2,
    explanation: 'Without a blood test, EIS officers used intensive case interviews and cluster analysis — classical shoe-leather epidemiology — to identify transmission patterns.',
  },
  {
    id: 'fi-4',
    category: 'famous-investigations',
    difficulty: 'hard',
    points: 400,
    question: 'The SARS outbreak of 2003 was contained primarily through which strategy?',
    options: ['Rapid vaccine development and deployment', 'Contact tracing and quarantine protocols', 'International travel bans', 'Mass antibiotic treatment'],
    correctIndex: 1,
    explanation: 'Without a vaccine or treatment, SARS was contained through aggressive contact tracing, quarantine, and infection control — classical public health measures at modern scale.',
  },
  {
    id: 'fi-5',
    category: 'famous-investigations',
    difficulty: 'easy',
    points: 100,
    question: 'The 2014-2016 West African Ebola epidemic was the largest outbreak of Ebola in which region?',
    options: ['Central Africa', 'East Africa', 'West Africa', 'Southern Africa'],
    correctIndex: 2,
    explanation: 'The epidemic primarily affected Sierra Leone, Liberia, and Guinea in West Africa, killing more than 11,000 people over nearly two years.',
  },
  {
    id: 'fi-6',
    category: 'famous-investigations',
    difficulty: 'medium',
    points: 200,
    question: 'The H1N1 "swine flu" pandemic of 2009 was notable for affecting which age group most severely?',
    options: ['Elderly over 65', 'Children under 2', 'Healthy young adults', 'Immunocompromised patients only'],
    correctIndex: 2,
    explanation: 'Unlike seasonal flu, the 2009 H1N1 pandemic disproportionately affected healthy young adults, an unusual age pattern that heightened concern.',
  },
  {
    id: 'fi-7',
    category: 'famous-investigations',
    difficulty: 'hard',
    points: 500,
    question: 'Ignaz Semmelweis demonstrated in the 1840s that what simple intervention dramatically reduced maternal mortality?',
    options: ['Sterilizing surgical instruments', 'Handwashing with chlorinated lime solution', 'Isolating sick patients in separate wards', 'Administering quinine to all patients'],
    correctIndex: 1,
    explanation: 'Semmelweis showed that handwashing with chlorinated lime by physicians dramatically reduced puerperal fever deaths — decades before germ theory was established.',
  },
  {
    id: 'fi-8',
    category: 'famous-investigations',
    difficulty: 'medium',
    points: 300,
    question: 'The 2019 EVALI outbreak was linked to what product?',
    options: ['Contaminated vaping/e-cigarette products', 'Imported herbal supplements', 'Energy drinks with undisclosed ingredients', 'Prescription opioid medications'],
    correctIndex: 0,
    explanation: 'E-cigarette or Vaping product use-Associated Lung Injury (EVALI) was primarily linked to vitamin E acetate in THC-containing vaping products.',
  },
  {
    id: 'fi-9',
    category: 'famous-investigations',
    difficulty: 'easy',
    points: 200,
    question: 'Typhoid Mary (Mary Mallon) is a famous example of what epidemiological concept?',
    options: ['A superspreader event', 'An asymptomatic carrier', 'A zoonotic spillover', 'An index case'],
    correctIndex: 1,
    explanation: 'Mary Mallon was an asymptomatic carrier of Salmonella typhi who infected dozens of people while working as a cook — demonstrating that healthy individuals can transmit disease.',
  },
  {
    id: 'fi-10',
    category: 'famous-investigations',
    difficulty: 'hard',
    points: 400,
    question: 'The Tuskegee Syphilis Study, exposed in 1972, led directly to what major reform?',
    options: ['The creation of the FDA', 'The establishment of Institutional Review Boards (IRBs) for human research', 'The founding of the EIS program', 'The passage of the Clean Water Act'],
    correctIndex: 1,
    explanation: 'Public outrage over the Tuskegee study led to the National Research Act of 1974 and the establishment of IRBs to protect human subjects in research.',
  },

  // ─────────────────────────────────────────────
  // GLOBAL HEALTH (10 questions)
  // ─────────────────────────────────────────────
  {
    id: 'gh-1',
    category: 'global-health',
    difficulty: 'easy',
    points: 100,
    question: 'Which disease is targeted by the Global Polio Eradication Initiative?',
    options: ['Measles', 'Malaria', 'Polio', 'Tuberculosis'],
    correctIndex: 2,
    explanation: 'The Global Polio Eradication Initiative, launched in 1988, has reduced polio cases by over 99%. Only a handful of countries still report wild poliovirus.',
  },
  {
    id: 'gh-2',
    category: 'global-health',
    difficulty: 'easy',
    points: 100,
    question: 'What does WHO stand for?',
    options: ['World Hospital Organization', 'World Health Organization', 'Western Hemisphere Operations', 'Worldwide Hygiene Oversight'],
    correctIndex: 1,
    explanation: 'The World Health Organization is the United Nations agency responsible for international public health, headquartered in Geneva, Switzerland.',
  },
  {
    id: 'gh-3',
    category: 'global-health',
    difficulty: 'medium',
    points: 200,
    question: 'The last naturally occurring case of smallpox was in which country?',
    options: ['India', 'Bangladesh', 'Somalia', 'Ethiopia'],
    correctIndex: 2,
    explanation: 'Ali Maow Maalin of Somalia contracted the last natural case of smallpox on October 26, 1977. WHO declared global eradication in 1980.',
  },
  {
    id: 'gh-4',
    category: 'global-health',
    difficulty: 'medium',
    points: 300,
    question: 'Which disease kills the most people worldwide each year among infectious diseases (as of recent WHO data)?',
    options: ['HIV/AIDS', 'Tuberculosis', 'Malaria', 'Influenza'],
    correctIndex: 1,
    explanation: 'Tuberculosis remains the world\'s deadliest infectious disease, killing approximately 1.3 million people per year according to recent WHO reports.',
  },
  {
    id: 'gh-5',
    category: 'global-health',
    difficulty: 'medium',
    points: 200,
    question: 'The term "One Health" refers to the interconnection between:',
    options: ['Physical health and mental health', 'Human health, animal health, and environmental health', 'Primary care and hospital care', 'Traditional medicine and modern medicine'],
    correctIndex: 1,
    explanation: 'One Health recognizes that the health of people, animals, and the environment are closely linked — critical for understanding zoonotic diseases and antimicrobial resistance.',
  },
  {
    id: 'gh-6',
    category: 'global-health',
    difficulty: 'hard',
    points: 400,
    question: 'International Health Regulations (IHR) require countries to report which category of health events to WHO?',
    options: ['Only confirmed outbreaks of listed diseases', 'Any public health event that may constitute a concern of international concern', 'Only events involving more than 100 cases', 'Only bioterrorism-related events'],
    correctIndex: 1,
    explanation: 'IHR (2005) requires countries to report any event that may constitute a Public Health Emergency of International Concern (PHEIC), regardless of cause or source.',
  },
  {
    id: 'gh-7',
    category: 'global-health',
    difficulty: 'easy',
    points: 100,
    question: 'Malaria is transmitted by which type of insect?',
    options: ['Ticks', 'Fleas', 'Mosquitoes', 'Sandflies'],
    correctIndex: 2,
    explanation: 'Malaria is transmitted through the bites of infected female Anopheles mosquitoes, primarily in tropical and subtropical regions.',
  },
  {
    id: 'gh-8',
    category: 'global-health',
    difficulty: 'hard',
    points: 400,
    question: 'The concept of "herd immunity" threshold depends primarily on which factor?',
    options: ['The population density of the area', 'The basic reproduction number (R0) of the pathogen', 'The age distribution of the population', 'The availability of treatment facilities'],
    correctIndex: 1,
    explanation: 'Herd immunity threshold = 1 - (1/R0). A disease with R0 of 5 requires 80% immunity to prevent sustained transmission. Higher R0 = higher threshold needed.',
  },
  {
    id: 'gh-9',
    category: 'global-health',
    difficulty: 'medium',
    points: 300,
    question: 'Which program trains field epidemiologists internationally, modeled after the EIS?',
    options: ['Doctors Without Borders', 'Field Epidemiology Training Programs (FETPs)', 'The Global Fund', 'PEPFAR'],
    correctIndex: 1,
    explanation: 'FETPs operate in over 80 countries and are modeled directly on the CDC EIS program, training local epidemiologists in surveillance and outbreak response.',
  },
  {
    id: 'gh-10',
    category: 'global-health',
    difficulty: 'hard',
    points: 500,
    question: 'What percentage of emerging infectious diseases in humans are estimated to be zoonotic in origin?',
    options: ['About 25%', 'About 50%', 'About 75%', 'About 90%'],
    correctIndex: 2,
    explanation: 'Approximately 75% of emerging infectious diseases are zoonotic — originating in animals before crossing to humans — highlighting the importance of One Health approaches.',
  },
];

// ============================================================
// SCORING UTILITIES
// ============================================================

export function calculateQuestionPoints(
  basePoints: number,
  answerTimeMs: number,
  isCorrect: boolean,
  streak: number,
): number {
  if (!isCorrect) return 0;

  let points = basePoints;

  // Speed bonus: faster answer = more bonus (max 50 pts)
  const timeSeconds = answerTimeMs / 1000;
  if (timeSeconds < GAME_CONFIG.timePerQuestion) {
    const speedFraction = 1 - (timeSeconds / GAME_CONFIG.timePerQuestion);
    points += Math.floor(speedFraction * GAME_CONFIG.speedBonusMax);
  }

  // Streak multiplier
  if (streak >= GAME_CONFIG.streakBonusThreshold) {
    points = Math.floor(points * GAME_CONFIG.streakBonusMultiplier);
  }

  return points;
}

export function selectRoundQuestions(count: number = GAME_CONFIG.questionsPerRound): TriviaQuestion[] {
  // Select questions spread across categories and difficulties
  const shuffled = shuffleArray([...QUESTIONS]);

  // Try to get at least 2 from each category
  const selected: TriviaQuestion[] = [];
  const categories = CATEGORIES.map(c => c.id);

  for (const cat of categories) {
    const catQuestions = shuffled.filter(q => q.category === cat && !selected.includes(q));
    selected.push(...catQuestions.slice(0, 2));
  }

  // Fill remaining slots with random questions not yet selected
  const remaining = shuffled.filter(q => !selected.includes(q));
  while (selected.length < count && remaining.length > 0) {
    selected.push(remaining.shift()!);
  }

  // Shuffle the final selection so categories aren't grouped
  return shuffleArray(selected).slice(0, count);
}

// ============================================================
// LOCAL STORAGE
// ============================================================

const HIGH_SCORE_KEY = 'epi-jeopardy-highscore';
const GAMES_PLAYED_KEY = 'epi-jeopardy-games-played';

export function getHighScore(): number {
  try { return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10); }
  catch { return 0; }
}

export function setHighScore(score: number): void {
  if (score > getHighScore()) {
    try { localStorage.setItem(HIGH_SCORE_KEY, score.toString()); }
    catch { /* kiosk may block */ }
  }
}

export function incrementGamesPlayed(): number {
  try {
    const count = parseInt(localStorage.getItem(GAMES_PLAYED_KEY) || '0', 10) + 1;
    localStorage.setItem(GAMES_PLAYED_KEY, count.toString());
    return count;
  } catch { return 0; }
}

// ============================================================
// UTILITIES
// ============================================================

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
