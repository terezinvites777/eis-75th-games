// src/data/origins-scenarios.ts
// Outbreak Origins — 4 investigation scenarios

import type { OriginsScenario, AnswerOption } from '../types/origins';

export const pathogenOptions: AnswerOption[] = [
  { id: 'salmonella', label: 'Salmonella Typhimurium' },
  { id: 'legionella', label: 'Legionella pneumophila' },
  { id: 'ecoli', label: 'E. coli O157:H7' },
  { id: 'exserohilum', label: 'Exserohilum rostratum (fungal)' },
  { id: 'listeria', label: 'Listeria monocytogenes' },
  { id: 'norovirus', label: 'Norovirus' },
];

export const sourceOptions: AnswerOption[] = [
  { id: 'peanut', label: 'Contaminated peanut paste (processing facility)' },
  { id: 'cooling-tower', label: 'Contaminated cooling tower (building HVAC)' },
  { id: 'spinach', label: 'Contaminated fresh bagged spinach' },
  { id: 'pharma', label: 'Contaminated pharmaceutical injections (compounding pharmacy)' },
  { id: 'water', label: 'Contaminated municipal water supply' },
  { id: 'seafood', label: 'Contaminated imported seafood' },
];

export const originsScenarios: OriginsScenario[] = [
  // ===== SCENARIO 1: The Peanut Trail =====
  {
    id: 'peanut-trail',
    title: 'The Peanut Trail',
    subtitle: 'A nationwide foodborne outbreak',
    difficulty: 'easy',
    basedOn: '2008-2009 Salmonella Typhimurium / Peanut Corporation of America',
    briefing: 'Multiple states are reporting clusters of Salmonella infections. Cases are accumulating rapidly across the country. Your team has been deployed to find the source.',
    pathogen: 'salmonella',
    source: 'peanut',
    originState: 'GA',
    initialStates: [
      { stateId: 'MN', initialCases: 15, growthPerTurn: 5 },
      { stateId: 'OH', initialCases: 22, growthPerTurn: 8 },
      { stateId: 'VA', initialCases: 10, growthPerTurn: 4 },
    ],
    spreadSchedule: [
      { turn: 2, stateId: 'CT', initialCases: 8, growthPerTurn: 3 },
      { turn: 2, stateId: 'CA', initialCases: 28, growthPerTurn: 10 },
      { turn: 2, stateId: 'TX', initialCases: 31, growthPerTurn: 12 },
      { turn: 2, stateId: 'NC', initialCases: 12, growthPerTurn: 4 },
      { turn: 3, stateId: 'PA', initialCases: 18, growthPerTurn: 6 },
      { turn: 3, stateId: 'MI', initialCases: 9, growthPerTurn: 3 },
      { turn: 3, stateId: 'WA', initialCases: 7, growthPerTurn: 2 },
      { turn: 4, stateId: 'GA', initialCases: 5, growthPerTurn: 2 },
      { turn: 4, stateId: 'FL', initialCases: 14, growthPerTurn: 5 },
    ],
    evidence: [
      {
        stateId: 'MN', type: 'interview', icon: '\uD83D\uDCCB',
        title: 'Patient Interviews \u2014 Minnesota',
        content: '15 cases identified. Ages range 1-88 years. 12 of 15 report eating peanut butter crackers, peanut butter cookies, or institutional food containing peanut products in the week before onset. 3 cases are residents of a long-term care facility where peanut butter is served daily.',
      },
      {
        stateId: 'OH', type: 'clinical', icon: '\uD83C\uDFE5',
        title: 'Clinical Report \u2014 Ohio',
        content: '22 confirmed cases of Salmonella Typhimurium. Median age 41. Symptoms: diarrhea (100%), fever (78%), abdominal cramps (82%). Median incubation: 3 days. 6 hospitalizations, 0 deaths. PFGE pattern: JPXX01.0049 \u2014 matches MN cluster exactly.',
      },
      {
        stateId: 'VA', type: 'epiData', icon: '\uD83D\uDCCA',
        title: 'Epi Data \u2014 Virginia',
        content: 'Epi curve shows a continuous common-source pattern with cases accumulating over 3 months. NOT a point-source event. This suggests an ongoing contamination of a widely distributed product, not a single meal or event. Age distribution skews young (<5) and old (>65) \u2014 populations that consume institutional food.',
      },
      {
        stateId: 'CT', type: 'lab', icon: '\uD83D\uDD2C',
        title: 'Lab Results \u2014 Connecticut',
        content: 'PFGE and WGS analysis: all 8 CT isolates are indistinguishable from MN and OH isolates. Serotype: Typhimurium. Antimicrobial susceptibility: pan-susceptible. WGS cluster analysis confirms single-source outbreak. Strain NOT previously found in PulseNet database \u2014 novel introduction.',
      },
      {
        stateId: 'GA', type: 'environmental', icon: '\uD83C\uDFED',
        title: 'Environmental/Facility \u2014 Georgia',
        content: 'FDA inspection of peanut processing facility in Blakely, GA reveals: roaches in production area, roof leaks above peanut roasting line, Salmonella found in 12 environmental samples including production equipment. Company\'s own internal lab tests showed Salmonella positives on 12 occasions in 2007-2008 but product was shipped anyway after "retesting."',
      },
      {
        stateId: 'CA', type: 'interview', icon: '\uD83D\uDCCB',
        title: 'Patient Interviews \u2014 California',
        content: '28 cases. Exposure analysis: cases consumed 14 different brands of peanut-containing products. Brands appear unrelated but traceback reveals ALL use the same ingredient supplier for peanut paste: Peanut Corporation of America, Blakely, GA. The common denominator is not the retail product \u2014 it\'s the upstream ingredient.',
      },
      {
        stateId: 'TX', type: 'epiData', icon: '\uD83D\uDCCA',
        title: 'Epi Data \u2014 Texas',
        content: '31 cases statewide. Case-control study results: consumption of any peanut butter product, OR = 4.2 (95% CI: 2.1-8.4). Consumption of institutional peanut butter (bulk/food-service), OR = 11.7 (95% CI: 4.3-31.8). Retail jarred peanut butter: OR = 1.1 (not significant). The signal points to industrial-supply peanut products, not consumer-brand jars.',
      },
      {
        stateId: 'NC', type: 'geographic', icon: '\uD83D\uDDFA\uFE0F',
        title: 'Geographic Intel \u2014 North Carolina',
        content: 'Distribution mapping shows Peanut Corporation of America ships peanut paste to 46 states. Their two facilities: Blakely, GA (primary) and Plainview, TX (secondary). GA facility processes 2.5 million lbs/year. Product goes to >300 food companies for use in crackers, cookies, snack bars, ice cream, dog treats, and institutional food service.',
      },
    ],
    optimalPath: ['MN', 'TX', 'GA'],
    optimalTokens: 3,
    postGameText: 'This was one of the largest Salmonella outbreaks in U.S. history \u2014 714 cases across 46 states, 9 deaths. The EIS investigation revealed that the Peanut Corporation of America knowingly shipped products after positive Salmonella tests. The company\'s owner was later sentenced to 28 years in federal prison \u2014 the harshest penalty ever for a food safety crime.',
  },

  // ===== SCENARIO 2: Legionnaires' Return =====
  {
    id: 'legionnaires',
    title: "Legionnaires' Return",
    subtitle: 'A deadly pneumonia cluster',
    difficulty: 'medium',
    basedOn: '2015 Legionnaires\' disease outbreak, South Bronx, NYC',
    briefing: 'A surge of severe pneumonia cases has been reported in New York City. Hospitalizations are climbing fast and deaths are occurring. The source remains unknown.',
    pathogen: 'legionella',
    source: 'cooling-tower',
    originState: 'NY',
    initialStates: [
      { stateId: 'NY', initialCases: 20, growthPerTurn: 25 },
    ],
    spreadSchedule: [
      // Does NOT spread geographically — cases grow within NY
    ],
    evidence: [
      {
        stateId: 'NY', visitNumber: 1, type: 'clinical', icon: '\uD83C\uDFE5',
        title: 'Clinical Report \u2014 New York (Visit 1)',
        content: '86 confirmed cases of severe pneumonia in the South Bronx, NYC. Demographics: median age 55, 93% male, 96% have chronic underlying conditions (diabetes, COPD, immunosuppression). Symptom profile: high fever (>103\u00B0F), cough, shortness of breath, confusion. 12 deaths. Urinary antigen test positive for Legionella in 78 of 86 cases.',
      },
      {
        stateId: 'NY', visitNumber: 2, type: 'epiData', icon: '\uD83D\uDCCA',
        title: 'Epi Data \u2014 New York (Visit 2)',
        content: 'Epi curve: explosive point-source pattern with cases clustered in a 3-week window. ALL cases live or work within a 0.5-mile radius in the South Bronx. No cases outside this geographic cluster. Attack rate analysis: highest among outdoor workers and people who spend significant time outdoors in the affected blocks. No cases among office workers in sealed buildings.',
      },
      {
        stateId: 'NY', visitNumber: 3, type: 'environmental', icon: '\uD83C\uDFED',
        title: 'Environmental/Facility \u2014 New York (Visit 3)',
        content: 'NYC DOHMH inspects 5 cooling towers within the 0.5-mile cluster zone. Building at 1055 Concord Avenue: Legionella pneumophila serogroup 1 isolated from cooling tower water at 1,200 CFU/L (action level: 10 CFU/L). PFGE match: isolate is indistinguishable from patient specimens. Tower maintenance log shows no biocide treatment in 14 months. Tower disperses aerosolized water droplets into outdoor air.',
      },
      {
        stateId: 'NJ', type: 'geographic', icon: '\uD83D\uDDFA\uFE0F',
        title: 'Geographic Intel \u2014 New Jersey',
        content: 'No Legionella cases in NJ. Investigation of potential cross-state exposure finds no patients with NJ travel history. Wind pattern analysis shows prevailing winds carried aerosol plume WITHIN the South Bronx corridor, not across the Hudson. This is a hyper-local event.',
      },
      {
        stateId: 'CT', type: 'interview', icon: '\uD83D\uDCCB',
        title: 'Patient Interviews \u2014 Connecticut',
        content: 'No cases in CT. Interviews with 3 CT residents who visited the South Bronx during the exposure window \u2014 none developed illness. Their visits were brief (<2 hours) and primarily indoors. Confirms that prolonged outdoor exposure in the aerosol zone was the risk factor.',
      },
      {
        stateId: 'PA', type: 'lab', icon: '\uD83D\uDD2C',
        title: 'Lab Results \u2014 Pennsylvania',
        content: 'PulseNet query: the Legionella PFGE pattern from the Bronx outbreak does NOT match any other active clusters nationally. This is a single-source, single-location event. Environmental Legionella isolates from PA cooling towers (routine surveillance) are genetically distinct.',
      },
    ],
    optimalPath: ['NY', 'NY', 'NY'],
    optimalTokens: 3,
    postGameText: 'The 2015 South Bronx Legionnaires\' outbreak killed 12 people and sickened 138. EIS officers and NYC DOHMH investigators identified the cooling tower within days using environmental sampling and PFGE matching. The investigation led to NYC\'s landmark Local Law 77, requiring all buildings with cooling towers to register them, test for Legionella quarterly, and maintain disinfection protocols \u2014 the first law of its kind in the U.S.',
  },

  // ===== SCENARIO 3: The Spinach Scare =====
  {
    id: 'spinach-scare',
    title: 'The Spinach Scare',
    subtitle: 'Contaminated produce goes nationwide',
    difficulty: 'medium',
    basedOn: '2006 E. coli O157:H7 outbreak linked to fresh spinach',
    briefing: 'Emergency reports from multiple states: severe bloody diarrhea with hemolytic uremic syndrome, including children. Cases are appearing faster than your team can count them.',
    pathogen: 'ecoli',
    source: 'spinach',
    originState: 'CA',
    initialStates: [
      { stateId: 'WI', initialCases: 8, growthPerTurn: 3 },
      { stateId: 'OR', initialCases: 12, growthPerTurn: 4 },
      { stateId: 'UT', initialCases: 4, growthPerTurn: 2 },
    ],
    spreadSchedule: [
      { turn: 2, stateId: 'NM', initialCases: 6, growthPerTurn: 2 },
      { turn: 2, stateId: 'ID', initialCases: 3, growthPerTurn: 1 },
      { turn: 2, stateId: 'NE', initialCases: 5, growthPerTurn: 2 },
      { turn: 2, stateId: 'NY', initialCases: 22, growthPerTurn: 8 },
      { turn: 3, stateId: 'PA', initialCases: 18, growthPerTurn: 6 },
      { turn: 3, stateId: 'ME', initialCases: 4, growthPerTurn: 1 },
      { turn: 3, stateId: 'IN', initialCases: 7, growthPerTurn: 3 },
      { turn: 3, stateId: 'KY', initialCases: 5, growthPerTurn: 2 },
      { turn: 4, stateId: 'CA', initialCases: 10, growthPerTurn: 4 },
    ],
    evidence: [
      {
        stateId: 'WI', type: 'clinical', icon: '\uD83C\uDFE5',
        title: 'Clinical Report \u2014 Wisconsin',
        content: '8 confirmed E. coli O157:H7 cases. Median age 28. Severe presentations: 3 cases with hemolytic uremic syndrome (HUS), 1 requiring dialysis. All are previously healthy adults. Symptom profile: bloody diarrhea (100%), abdominal cramps (100%), vomiting (62%). This pathogen causes serious illness even in healthy people.',
      },
      {
        stateId: 'OR', type: 'interview', icon: '\uD83D\uDCCB',
        title: 'Patient Interviews \u2014 Oregon',
        content: '12 cases. Exposure interviews: 11 of 12 report eating fresh bagged spinach in the 5 days before onset. Brands vary \u2014 at least 4 different retail brands identified. None report eating at the same restaurant. None share a common grocery store. The common thread is the product type, not the point of purchase.',
      },
      {
        stateId: 'NM', type: 'epiData', icon: '\uD83D\uDCCA',
        title: 'Epi Data \u2014 New Mexico',
        content: '6 cases. Epi curve shows simultaneous onset across multiple states \u2014 classic pattern for a single contaminated product with wide distribution. Incubation period 3-4 days is consistent with E. coli O157:H7. Age and sex distribution: unusually even \u2014 not clustered in any demographic. Suggests a product consumed by the general population.',
      },
      {
        stateId: 'UT', type: 'lab', icon: '\uD83D\uDD2C',
        title: 'Lab Results \u2014 Utah',
        content: '4 cases confirmed. PFGE analysis: all isolates share pattern EXHX01.0047. PulseNet query reveals this EXACT pattern in cases from WI, OR, NM, and 15 additional states. All indistinguishable. This is definitively a single-source, multi-state outbreak. Strain carries genes for Shiga toxin 1 and 2 \u2014 virulent.',
      },
      {
        stateId: 'NY', type: 'interview', icon: '\uD83D\uDCCB',
        title: 'Patient Interviews \u2014 New York',
        content: '22 cases. Detailed food diaries collected for 3-day window before onset. Frequency analysis: fresh spinach consumed by 21 of 22 cases (95%). Case-control study (matched by age, neighborhood): fresh spinach consumption OR = 14.8 (95% CI: 5.2-42.1). Product traceback on brand labels shows 3 different brands, ALL packed by Natural Selection Foods LLC, San Juan Bautista, CA.',
      },
      {
        stateId: 'CA', type: 'environmental', icon: '\uD83C\uDFED',
        title: 'Environmental/Facility \u2014 California',
        content: 'FDA/state inspection of spinach fields in San Benito County, adjacent to cattle ranching operations. E. coli O157:H7 isolated from cattle feces on ranch property bordering the spinach fields. Feral pig tracks and feces found IN the spinach fields \u2014 pigs move between ranch and fields. Irrigation water tests negative. The contamination pathway: cattle \u2192 feral pigs \u2192 spinach fields. Strain PFGE from cattle matches patient isolates.',
      },
      {
        stateId: 'ID', type: 'geographic', icon: '\uD83D\uDDFA\uFE0F',
        title: 'Geographic Intel \u2014 Idaho',
        content: 'Supply chain mapping: Natural Selection Foods sources spinach from ~30 growers in the Salinas Valley, CA. Product is washed, bagged, and distributed nationwide under multiple brand names. Distribution covers 47 states. The Salinas Valley produces >70% of U.S. leafy greens. A contamination event here has immediate national reach.',
      },
      {
        stateId: 'PA', type: 'clinical', icon: '\uD83C\uDFE5',
        title: 'Clinical Report \u2014 Pennsylvania',
        content: '18 cases. Notable: 1 death \u2014 a 77-year-old woman with HUS. 5 children under age 10 with severe bloody diarrhea. 2 additional HUS cases. Reinforces severity \u2014 E. coli O157:H7 from spinach is causing life-threatening illness across age groups.',
      },
    ],
    optimalPath: ['OR', 'NY', 'CA'],
    optimalTokens: 3,
    postGameText: 'The 2006 spinach E. coli outbreak sickened 205 people in 26 states, killing 3. EIS officers traced the contamination to a single field in San Benito County, CA, where feral pigs carried E. coli O157:H7 from adjacent cattle operations into spinach crops. The investigation led to the Leafy Greens Marketing Agreement and contributed to passage of the FDA Food Safety Modernization Act (FSMA) in 2011.',
  },

  // ===== SCENARIO 4: Fungal Menace =====
  {
    id: 'fungal-menace',
    title: 'Fungal Menace',
    subtitle: 'An unprecedented pharmaceutical contamination',
    difficulty: 'hard',
    basedOn: '2012 fungal meningitis outbreak from contaminated compounding pharmacy',
    briefing: 'Cases of unusual meningitis are appearing in multiple states. Standard bacterial cultures are coming back negative. Something unprecedented is happening.',
    pathogen: 'exserohilum',
    source: 'pharma',
    originState: 'MA',
    initialStates: [
      { stateId: 'TN', initialCases: 18, growthPerTurn: 8 },
      { stateId: 'VA', initialCases: 14, growthPerTurn: 5 },
      { stateId: 'IN', initialCases: 9, growthPerTurn: 3 },
    ],
    spreadSchedule: [
      { turn: 2, stateId: 'MI', initialCases: 11, growthPerTurn: 4 },
      { turn: 2, stateId: 'MD', initialCases: 8, growthPerTurn: 3 },
      { turn: 2, stateId: 'FL', initialCases: 7, growthPerTurn: 3 },
      { turn: 3, stateId: 'NC', initialCases: 12, growthPerTurn: 5 },
      { turn: 3, stateId: 'NJ', initialCases: 6, growthPerTurn: 2 },
      { turn: 3, stateId: 'MN', initialCases: 5, growthPerTurn: 2 },
      { turn: 3, stateId: 'OH', initialCases: 8, growthPerTurn: 3 },
      { turn: 4, stateId: 'MA', initialCases: 4, growthPerTurn: 1 },
    ],
    evidence: [
      {
        stateId: 'TN', type: 'clinical', icon: '\uD83C\uDFE5',
        title: 'Clinical Report \u2014 Tennessee',
        content: '18 confirmed cases of meningitis. Unusual clinical picture: onset is SLOW (weeks, not days). Symptoms include severe headache, stiff neck, stroke-like focal deficits. CSF analysis: elevated WBC with lymphocytic predominance, very low glucose, elevated protein. Gram stain: NEGATIVE. Bacterial cultures: NEGATIVE after 7 days. Standard meningitis pathogens ruled out. Something unusual is causing this.',
      },
      {
        stateId: 'VA', type: 'interview', icon: '\uD83D\uDCCB',
        title: 'Patient Interviews \u2014 Virginia',
        content: '14 cases. All 14 received epidural steroid injections for back pain at outpatient pain clinics in the 1-3 months before symptom onset. 14 of 14 \u2014 that\'s 100% concordance. None share other common exposures (food, water, travel, occupation). Ages range 42-78. The injections were performed at 4 different clinics across the state.',
      },
      {
        stateId: 'IN', type: 'epiData', icon: '\uD83D\uDCCA',
        title: 'Epi Data \u2014 Indiana',
        content: '9 cases. Epi curve is EXTREMELY unusual: cases appear over an 8-week window with long, variable incubation periods (14-90 days). This is NOT consistent with any bacterial or viral meningitis pathogen. The prolonged, staggered onset suggests either a slow-growing organism or a non-infectious cause with delayed effect. All cases also received epidural steroid injections.',
      },
      {
        stateId: 'MI', type: 'lab', icon: '\uD83D\uDD2C',
        title: 'Lab Results \u2014 Michigan',
        content: '11 cases. Extended fungal culture from CSF (held 28 days): Exserohilum rostratum isolated from 6 of 11 patients. This is an environmental mold \u2014 NOT a normal human pathogen. It does not spread person-to-person. It was INTRODUCED into the patients. Fungal PCR confirms Exserohilum in 3 additional patients. Source must be the injection itself.',
      },
      {
        stateId: 'MD', type: 'geographic', icon: '\uD83D\uDDFA\uFE0F',
        title: 'Geographic Intel \u2014 Maryland',
        content: 'Cross-state analysis reveals that ALL affected clinics received methylprednisolone acetate (MPA) injection vials from the SAME compounding pharmacy: New England Compounding Center (NECC), Framingham, Massachusetts. NECC shipped 17,676 vials of MPA to 76 clinics in 23 states between May and September 2012. The geographic pattern of cases maps exactly to NECC\'s customer distribution list.',
      },
      {
        stateId: 'MA', type: 'environmental', icon: '\uD83C\uDFED',
        title: 'Environmental/Facility \u2014 Massachusetts',
        content: 'FDA inspection of NECC facility in Framingham, MA: fungal contamination found throughout the clean room. Greenish-black residue on equipment. Air handling system inadequate. Vials of MPA tested: Exserohilum rostratum isolated from 50 of 321 unopened vials. The pharmacy was operating as an unlicensed manufacturer \u2014 compounding thousands of vials for nationwide distribution without FDA oversight or proper sterile technique.',
      },
      {
        stateId: 'FL', type: 'interview', icon: '\uD83D\uDCCB',
        title: 'Patient Interviews \u2014 Florida',
        content: '7 cases. 2 deaths. Interview detail: patients received injections at different clinics on different dates over a 3-month period, ruling out a single contaminated batch \u2014 MULTIPLE lots from NECC were contaminated. One patient recalls the injection being "cloudy" but the clinic administered it anyway. Product recall of all NECC products initiated.',
      },
      {
        stateId: 'NC', type: 'clinical', icon: '\uD83C\uDFE5',
        title: 'Clinical Report \u2014 North Carolina',
        content: '12 cases. 3 with spinal epidural abscess in addition to meningitis. 1 case of arachnoiditis. Treatment requires weeks of IV antifungal therapy (voriconazole). Unlike bacterial meningitis, there is no rapid cure. CFR in this outbreak: approximately 8%. Survivors face months of treatment and potential permanent neurological damage.',
      },
    ],
    optimalPath: ['VA', 'MI', 'MD'],
    optimalTokens: 3,
    postGameText: 'The 2012 fungal meningitis outbreak killed 64 people and sickened 753 across 20 states. EIS officers were among the first to recognize the atypical clinical pattern and connect it to contaminated injections. The investigation revealed that NECC had been operating essentially as an unregulated drug manufacturer. The outbreak led to passage of the Drug Quality and Security Act (2013) and federal prosecution of NECC leadership, including a conviction for racketeering.',
  },
];
