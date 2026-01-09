// src/data/detective/cases-1950s.ts
// Era 1: 1950s - "Shoe Leather Epidemiology"
// Based on real EIS case studies from F:\EIS Program\EPICC\Case Study Library

import type { DetectiveCase } from '../../types/detective';

export const cases1950s: DetectiveCase[] = [
  {
    id: 'oswego-1940',
    era: '1950s',
    year: 1940,
    title: 'The Church Supper Mystery',
    subtitle: 'Oswego County, New York',
    teaser: 'After a community church supper, dozens fall ill within hours. What caused this sudden outbreak?',
    difficulty: 1,
    timeLimit: 300,
    basePoints: 400,
    
    briefing: {
      type: 'phone',
      from: 'Dr. A.M. Rubin, Epidemiologist',
      subject: 'Urgent: GI Outbreak in Lycoming Village',
      timestamp: 'April 19, 1940 - 8:00 AM',
      urgency: 'urgent',
      content: `Good morning. I've just received a report from the local health officer in Lycoming, Oswego County. 

An outbreak of acute gastrointestinal illness occurred overnight. All known cases attended a church supper yesterday evening at the village church basement. Family members who didn't attend are not ill.

Of the approximately 80 people who attended, we've already identified over 40 cases. The supper began at 6 PM and ran until 11 PM. Food was potluck-style, contributed by congregation members.

Symptoms include nausea, vomiting, diarrhea, and abdominal pain. Onset was rapid - most became ill within hours. No fevers reported. All patients are recovering.

I'm heading to the field now to complete interviews. We need to identify the vehicle.`
    },
    
    clues: [
      {
        id: 'oswego-clue-1',
        order: 1,
        type: 'clinical',
        title: 'Clinical Presentation',
        content: 'All cases presented with acute onset of nausea, vomiting, diarrhea, and abdominal pain. NO FEVER was reported in any case. Onset occurred 2-8 hours after eating. All patients recovered within 24-30 hours. No bacteriologic specimens were collected.',
        isCritical: false,
        pointCost: 25,
        source: 'Field interviews with 75 attendees',
      },
      {
        id: 'oswego-clue-2',
        order: 2,
        type: 'epidemiologic',
        title: 'Attack Rate Analysis',
        content: 'Of 75 persons interviewed, 46 (61%) reported illness. The epidemic curve shows a tight clustering of onset times between 10 PM on April 18 and 2 AM on April 19 - consistent with a point-source exposure.',
        isCritical: true,
        pointCost: 50,
        source: 'Line listing analysis',
      },
      {
        id: 'oswego-clue-3',
        order: 3,
        type: 'epidemiologic',
        title: 'Food-Specific Attack Rates',
        content: `Analysis of 14 food items served:\n• Baked ham: 29/46 ill ate it (63%), but 17/29 well also ate it\n• Vanilla ice cream: 43/54 who ate it became ill (80%)\n• Chocolate ice cream: Only 25 people ate it, 23 became ill (92%)\n• Those who ate NO ice cream: 0/21 became ill (0%)`,
        isCritical: true,
        pointCost: 75,
        source: 'Case-control analysis of food histories',
      },
      {
        id: 'oswego-clue-4',
        order: 4,
        type: 'environmental',
        title: 'Ice Cream Preparation',
        content: 'The vanilla ice cream was homemade by a church member. It was prepared earlier in the day and stored in a washtub packed with ice and salt. The ice cream contained raw eggs. The chocolate ice cream was store-bought but served from the same table.',
        isCritical: true,
        pointCost: 50,
        source: 'Interview with food preparers',
      },
      {
        id: 'oswego-clue-5',
        order: 5,
        type: 'timeline',
        title: 'Incubation Period',
        content: 'The supper ran from 6 PM to 11 PM. Most attendees ate between 7-9 PM. Illness onset clustered between 10 PM April 18 and 2 AM April 19. Median incubation period: approximately 4 hours. This short incubation suggests a preformed toxin.',
        isCritical: true,
        pointCost: 75,
        source: 'Epidemic curve analysis',
      },
    ],
    
    diagnosis: {
      pathogenOptions: [
        { id: 'staph', pathogen: 'Staphylococcus aureus enterotoxin', label: 'Staphylococcal Food Poisoning', description: 'Preformed toxin causing rapid onset vomiting and diarrhea' },
        { id: 'salmonella', pathogen: 'Salmonella species', label: 'Salmonellosis', description: 'Bacterial infection with 12-72 hour incubation' },
        { id: 'norovirus', pathogen: 'Viral gastroenteritis', label: 'Viral Gastroenteritis', description: 'Highly contagious viral illness' },
        { id: 'bacillus', pathogen: 'Bacillus cereus', label: 'B. cereus Food Poisoning', description: 'Can cause rapid-onset vomiting (emetic type)' },
      ],
      sourceOptions: [
        { id: 'vanilla-ice', source: 'Homemade vanilla ice cream', label: 'Vanilla Ice Cream', description: 'Homemade with raw eggs, stored in washtub' },
        { id: 'ham', source: 'Baked ham', label: 'Baked Ham', description: 'Main dish served at the supper' },
        { id: 'potato-salad', source: 'Cabbage salad', label: 'Cabbage Salad', description: 'Cold prepared dish' },
        { id: 'water', source: 'Church water supply', label: 'Drinking Water', description: 'Village water served at supper' },
      ],
    },
    
    solution: {
      pathogenId: 'staph',
      sourceId: 'vanilla-ice',
      pathogen: 'Staphylococcus aureus enterotoxin',
      source: 'Homemade vanilla ice cream containing raw eggs',
      explanation: 'The 2-4 hour incubation period, lack of fever, and rapid recovery are classic for staphylococcal food poisoning. The preformed enterotoxin in contaminated food causes symptoms before the bacteria themselves can multiply. The food-specific attack rates showed a clear dose-response: 80% attack rate for vanilla ice cream, 0% for those who ate neither type of ice cream.',
      eisLegacy: 'The Oswego outbreak became the foundational case study for EIS training. Every EIS officer since 1951 has learned outbreak investigation using this case. It established the principles of calculating food-specific attack rates and constructing epidemic curves.',
      realOutcome: '46 of 75 (61%) attendees became ill. There were no deaths. The short incubation period and clinical presentation pointed to staphylococcal enterotoxin rather than an infectious agent.',
      totalCases: '46 cases',
      mmwrReference: 'This case predates MMWR but is documented in CDC\'s Case Studies in Applied Epidemiology No. 401-303',
    },
    
    learningObjectives: [
      'Calculate and interpret food-specific attack rates',
      'Construct and analyze an epidemic curve',
      'Distinguish preformed toxin illness from bacterial infection by incubation period',
      'Conduct systematic interviews to identify outbreak vehicle',
    ],
    
    historicalContext: 'This 1940 investigation was conducted before the EIS was formally established in 1951. It was later reconstructed as the first EIS training case study by Alexander Langmuir, founder of the EIS program. The systematic approach used here - interviews, line listings, attack rate calculations - became the template for field epidemiology training worldwide.',
  },

  {
    id: 'cutter-1955',
    era: '1950s',
    year: 1955,
    title: 'The Vaccine Paradox',
    subtitle: 'Berkeley, California',
    teaser: 'Children vaccinated against polio are developing the very disease they were meant to be protected from.',
    difficulty: 2,
    timeLimit: 360,
    basePoints: 500,
    
    briefing: {
      type: 'alert',
      from: 'Epidemic Intelligence Service',
      subject: 'URGENT: Paralytic Polio in Recently Vaccinated Children',
      timestamp: 'April 26, 1955',
      urgency: 'critical',
      content: `SITUATION CRITICAL

Reports are coming in from California of children developing paralytic poliomyelitis within 10 days of receiving the new Salk vaccine. The national vaccination program launched just two weeks ago following successful field trials.

Early reports suggest:
- Cases occurring 7-10 days post-vaccination
- Paralysis beginning in the vaccinated arm
- All identified cases received vaccine from the same manufacturer

Parents are panicking. Newspapers are calling for the program to be halted. We need rapid investigation to determine if this is coincidence or causation.

Your mission: Determine if the vaccine is causing these cases and identify the scope of the problem.`
    },
    
    clues: [
      {
        id: 'cutter-clue-1',
        order: 1,
        type: 'clinical',
        title: 'Clinical Pattern',
        content: 'Affected children developed paralysis 7-10 days after vaccination. Uniquely, the paralysis began in the arm where the injection was given, then spread to involve other limbs. This "ascending paralysis" pattern differs from typical wild polio.',
        isCritical: true,
        pointCost: 50,
        source: 'Case interviews and medical records',
      },
      {
        id: 'cutter-clue-2',
        order: 2,
        type: 'epidemiologic',
        title: 'Manufacturer Analysis',
        content: 'Cross-referencing lot numbers: ALL identified cases received vaccine manufactured by Cutter Laboratories in Berkeley. No cases have been reported in children who received vaccine from Parke-Davis, Eli Lilly, Wyeth, or Pitman-Moore.',
        isCritical: true,
        pointCost: 75,
        source: 'Lot number tracking across all 48 states',
      },
      {
        id: 'cutter-clue-3',
        order: 3,
        type: 'laboratory',
        title: 'Vaccine Testing',
        content: 'Emergency testing of remaining Cutter vaccine lots: LIVE, VIRULENT poliovirus detected in multiple batches. The formaldehyde inactivation process appears to have failed. Viral clumps may have protected some virus particles from inactivation.',
        isCritical: true,
        pointCost: 75,
        source: 'NIH Laboratory analysis',
      },
      {
        id: 'cutter-clue-4',
        order: 4,
        type: 'environmental',
        title: 'Manufacturing Process',
        content: 'Investigation of Cutter\'s facility reveals they used a different filtration method than other manufacturers. Their filters may have allowed clumped viral material to pass through, where the virus inside clumps was protected from the inactivating formaldehyde.',
        isCritical: false,
        pointCost: 50,
        source: 'Manufacturing inspection',
      },
      {
        id: 'cutter-clue-5',
        order: 5,
        type: 'timeline',
        title: 'Case Clustering',
        content: 'Cases are occurring in tight clusters corresponding to specific vaccine lot numbers. Some lots show zero cases, others show multiple cases in the same community. This lot-specific clustering argues against wild polio coincidence.',
        isCritical: true,
        pointCost: 50,
        source: 'Geographic and temporal analysis',
      },
    ],
    
    diagnosis: {
      pathogenOptions: [
        { id: 'live-vaccine', pathogen: 'Live poliovirus in improperly inactivated vaccine', label: 'Vaccine-Introduced Polio', description: 'Live virus surviving the inactivation process' },
        { id: 'wild-polio', pathogen: 'Wild poliovirus', label: 'Coincidental Wild Polio', description: 'Normal polio outbreak during vaccination campaign' },
        { id: 'vdpv', pathogen: 'Vaccine-derived poliovirus', label: 'Vaccine-Derived Mutation', description: 'Vaccine virus mutated to virulent form' },
        { id: 'immune', pathogen: 'Immune reaction', label: 'Autoimmune Response', description: 'Immune-mediated nerve damage from vaccine' },
      ],
      sourceOptions: [
        { id: 'cutter', source: 'Cutter Laboratories vaccine lots', label: 'Cutter Vaccine', description: 'Vaccine from Berkeley manufacturer' },
        { id: 'all-mfg', source: 'All vaccine manufacturers', label: 'All Vaccines', description: 'Systematic problem with Salk vaccine' },
        { id: 'community', source: 'Community transmission', label: 'Community Spread', description: 'Wild virus circulating in communities' },
        { id: 'handling', source: 'Local storage/handling errors', label: 'Local Handling', description: 'Improper vaccine storage at clinics' },
      ],
    },
    
    solution: {
      pathogenId: 'live-vaccine',
      sourceId: 'cutter',
      pathogen: 'Live poliovirus in improperly inactivated vaccine',
      source: 'Cutter Laboratories vaccine',
      explanation: 'The Cutter Incident was caused by inadequate inactivation of poliovirus during vaccine manufacturing. Unlike other manufacturers, Cutter\'s process allowed viral clumps to form that protected virus particles from the formaldehyde treatment. When injected, these live virus particles caused polio in vaccinated children.',
      eisLegacy: 'The Cutter Incident led to the creation of modern vaccine safety regulations. It established the need for manufacturer-specific lot tracking, independent quality testing, and post-licensure surveillance. The Vaccine Adverse Event Reporting System (VAERS) traces its origins to lessons learned here.',
      realOutcome: 'The incident caused an estimated 40,000 cases of polio, 200 children with permanent paralysis, and 10 deaths. Within days of the EIS investigation findings, all Cutter vaccine was recalled. The incident nearly derailed the entire polio vaccination program.',
      caseFatality: '10 deaths from vaccine-associated polio',
      totalCases: '~40,000 polio cases attributed to Cutter vaccine',
    },
    
    learningObjectives: [
      'Trace outbreak to specific manufacturer using lot tracking',
      'Distinguish vaccine-associated adverse events from coincidental illness',
      'Understand the role of manufacturing quality control in vaccine safety',
      'Recognize how epidemiologic evidence can drive urgent policy decisions',
    ],
    
    historicalContext: 'April 1955 was supposed to be a triumph - the Salk vaccine had been declared "safe, effective, and potent" just two weeks earlier. The EIS was only 4 years old when officers identified the Cutter connection, demonstrating the value of rapid epidemiologic response. This investigation established EIS credibility and shaped modern pharmacovigilance.',
  },

  {
    id: 'westbranch-1961',
    era: '1950s',
    year: 1961,
    title: 'The Yellow Eyes of West Branch',
    subtitle: 'West Branch, Michigan',
    teaser: 'A small town sees a sudden surge of jaundice. Is it the water, the food, or something else entirely?',
    difficulty: 2,
    timeLimit: 360,
    basePoints: 500,
    
    briefing: {
      type: 'memo',
      from: 'Michigan Department of Health',
      subject: 'Hepatitis Investigation - West Branch, Ogemaw County',
      timestamp: 'November 1961',
      urgency: 'urgent',
      content: `INVESTIGATION REQUEST

West Branch (pop. ~1,800) is experiencing an unusual cluster of infectious hepatitis cases. Over the past 4 weeks, approximately 65 cases have been reported - giving this small community one of the highest hepatitis attack rates in state history.

Cases are characterized by jaundice, fatigue, nausea, and dark urine. Several patients have been hospitalized. No deaths reported so far.

Initial interviews suggest cases are concentrated in certain parts of town. We need assistance determining the source and mode of transmission.

Town features: small downtown area, mix of city water and private wells, several restaurants, a school, and the usual small-town gathering places.`
    },
    
    clues: [
      {
        id: 'wb-clue-1',
        order: 1,
        type: 'clinical',
        title: 'Disease Presentation',
        content: 'Patients present with classic hepatitis symptoms: jaundice (yellowing of skin/eyes), dark urine, clay-colored stools, fatigue, anorexia, and right upper quadrant pain. Incubation period appears to be 25-35 days. Laboratory tests confirm hepatitis.',
        isCritical: false,
        pointCost: 25,
        source: 'Hospital records and physician interviews',
      },
      {
        id: 'wb-clue-2',
        order: 2,
        type: 'epidemiologic',
        title: 'Geographic Distribution',
        content: 'Spot map of cases shows strong clustering in the downtown area of West Branch. Cases are concentrated among residents and workers in a 3-block radius. Rural residents outside this zone have very low attack rates.',
        isCritical: true,
        pointCost: 50,
        source: 'Case mapping',
      },
      {
        id: 'wb-clue-3',
        order: 3,
        type: 'epidemiologic',
        title: 'Common Exposure Analysis',
        content: 'Systematic interviews reveal that 98% of cases report eating at a specific downtown restaurant during the likely exposure period. Attack rate among restaurant patrons: 35%. Attack rate among non-patrons in the same area: 2%.',
        isCritical: true,
        pointCost: 75,
        source: 'Case-control study',
      },
      {
        id: 'wb-clue-4',
        order: 4,
        type: 'environmental',
        title: 'Restaurant Investigation',
        content: 'Investigation of the implicated restaurant: A food handler tested positive for hepatitis A antibodies consistent with recent infection. Further inquiry reveals she had a mild illness 6 weeks ago that she dismissed as "the flu." She continued working during her infectious period.',
        isCritical: true,
        pointCost: 75,
        source: 'Restaurant inspection and employee interviews',
      },
      {
        id: 'wb-clue-5',
        order: 5,
        type: 'timeline',
        title: 'Epidemic Curve Shape',
        content: 'The epidemic curve shows a classic point-source pattern with cases clustered over approximately 2 weeks, followed by a decline. The curve shape and 25-35 day incubation period are consistent with Hepatitis A exposure at a single location.',
        isCritical: false,
        pointCost: 50,
        source: 'Temporal analysis',
      },
    ],
    
    diagnosis: {
      pathogenOptions: [
        { id: 'hepa', pathogen: 'Hepatitis A virus', label: 'Hepatitis A', description: 'Fecal-oral transmission, 25-35 day incubation' },
        { id: 'hepb', pathogen: 'Hepatitis B virus', label: 'Hepatitis B', description: 'Blood-borne transmission, longer incubation' },
        { id: 'toxic', pathogen: 'Toxic hepatitis', label: 'Chemical/Toxic Hepatitis', description: 'Liver damage from chemical exposure' },
        { id: 'hepe', pathogen: 'Hepatitis E virus', label: 'Hepatitis E', description: 'Waterborne transmission, similar to Hep A' },
      ],
      sourceOptions: [
        { id: 'foodhandler', source: 'Infected food handler at restaurant', label: 'Food Handler', description: 'Restaurant employee with recent infection' },
        { id: 'water', source: 'Contaminated municipal water', label: 'Water Supply', description: 'Town water system contamination' },
        { id: 'well', source: 'Contaminated private wells', label: 'Private Wells', description: 'Groundwater contamination' },
        { id: 'produce', source: 'Contaminated produce shipment', label: 'Produce', description: 'Commercially distributed vegetables' },
      ],
    },
    
    solution: {
      pathogenId: 'hepa',
      sourceId: 'foodhandler',
      pathogen: 'Hepatitis A virus',
      source: 'Infected food handler at downtown restaurant',
      explanation: 'The West Branch outbreak was a classic foodborne Hepatitis A outbreak traced to an infected food handler. The long incubation period (25-35 days) meant the source was active weeks before cases appeared. The point-source epidemic curve and high attack rate among restaurant patrons provided the epidemiologic link.',
      eisLegacy: 'This case reinforced the importance of food handler health requirements and established protocols for investigating hepatitis outbreaks. It demonstrated how a single infected person in food service can affect an entire community.',
      realOutcome: 'Over 65 cases were identified in this small community. Implementation of immune globulin prophylaxis for exposed individuals helped limit secondary spread. The restaurant was temporarily closed and the food handler was restricted from work until no longer infectious.',
      totalCases: '65+ cases',
    },
    
    learningObjectives: [
      'Recognize the long incubation period of Hepatitis A',
      'Use spot mapping to identify geographic clustering',
      'Calculate attack rates to identify high-risk exposures',
      'Understand the role of food handlers in disease transmission',
    ],
    
    historicalContext: 'Before Hepatitis A vaccine was available (licensed in 1995), outbreaks like West Branch were common. This investigation helped establish standard protocols for hepatitis outbreak investigation and food handler screening that remain relevant today.',
  },
];

export default cases1950s;
