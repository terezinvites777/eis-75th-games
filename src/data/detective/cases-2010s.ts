// src/data/detective/cases-2010s.ts
// Era 3: 2010s - "Genomic Age"
// Based on real EIS case studies from F:\EIS Program\EPICC

import type { DetectiveCase } from '../../types/detective';

export const cases2010s: DetectiveCase[] = [
  {
    id: 'peanut-butter-2009',
    era: '2010s',
    year: 2009,
    title: 'The Ingredient Trail',
    subtitle: 'Nationwide Investigation',
    teaser: 'A Salmonella outbreak spans 43 states but the usual suspects aren\'t matching. The source is hiding in plain sight.',
    difficulty: 2,
    timeLimit: 360,
    basePoints: 550,
    
    briefing: {
      type: 'email',
      from: 'Dr. Eric Pevzner, EIS Chief',
      to: 'EIS Officers On-Call',
      subject: 'Officers on call for outbreak investigation',
      timestamp: 'March 2009',
      urgency: 'critical',
      content: `Once again the situation has escalated rapidly.

The EIS program is identifying officers to investigate a multi-state outbreak of Salmonella Typhimurium. Surveillance data has identified ill people in over 40 states.

CURRENT SITUATION:
• PulseNet has identified a cluster with an unusual PFGE pattern
• Cases now reported in 43 states
• At least 8 deaths confirmed
• Initial case interviews don't show clear common exposures

This is BIG. Standard food items aren't matching. We need to think about INGREDIENTS - things that go into many different products.

You are on-call to participate. Review Salmonellosis prior to the briefing.`
    },
    
    clues: [
      {
        id: 'pb-clue-1',
        order: 1,
        type: 'laboratory',
        title: 'PFGE Pattern Analysis',
        content: 'PulseNet molecular subtyping:\n• Outbreak strain: Salmonella Typhimurium with unique PFGE fingerprint\n• TWO related but distinct patterns identified (Clusters A and B)\n• Both patterns are NEW to PulseNet database\n• The genetic fingerprinting strongly suggests a common source\nThis is not sporadic disease - it\'s a true outbreak.',
        isCritical: false,
        pointCost: 25,
        source: 'CDC PulseNet laboratory network',
      },
      {
        id: 'pb-clue-2',
        order: 2,
        type: 'epidemiologic',
        title: 'Initial Hypothesis Testing',
        content: 'Standard food history questionnaire results (82 cases):\n• Chicken consumption: 67% (vs. 73% expected) - NOT elevated\n• Eggs: 54% (vs. 62% expected) - NOT elevated\n• Ground beef: 28% (vs. 35% expected) - NOT elevated\n• Restaurant dining: Similar to baseline\n\nNone of the usual Salmonella vehicles are showing signal. Need to think differently.',
        isCritical: true,
        pointCost: 50,
        source: 'Case interviews with standardized questionnaire',
      },
      {
        id: 'pb-clue-3',
        order: 3,
        type: 'epidemiologic',
        title: 'Secondary Questionnaire - Ingredient Focus',
        content: 'Focused re-interviews on peanut-containing products:\n• Any peanut butter product: 79% of cases vs. 48% controls\n• Specific brand associations varied widely\n• Key insight: Cases consumed MANY DIFFERENT peanut butter brands\n\nHypothesis shift: Not a single retail product - could this be a SUPPLIER to multiple brands?',
        isCritical: true,
        pointCost: 75,
        source: 'Focused case-control study',
      },
      {
        id: 'pb-clue-4',
        order: 4,
        type: 'environmental',
        title: 'Traceback Investigation',
        content: 'FDA traceback of peanut butter brands from cases:\n• Multiple brands implicated, all made by different companies\n• BUT: All used peanut paste from ONE supplier\n• Peanut Corporation of America (PCA), Blakely, Georgia\n• PCA supplies peanut paste to 200+ food companies\n\nFacility inspection reveals: rodent contamination, leaking roof, positive Salmonella environmental samples.',
        isCritical: true,
        pointCost: 75,
        source: 'FDA facility inspection',
      },
      {
        id: 'pb-clue-5',
        order: 5,
        type: 'laboratory',
        title: 'Strain Matching',
        content: 'Environmental sampling at PCA facility:\n• Salmonella Typhimurium isolated from multiple locations in plant\n• PFGE pattern: EXACT MATCH to patient isolates\n• Review of company records shows: PCA had tested positive for Salmonella MULTIPLE TIMES in 2007-2008\n• They retested until they got negative results, then shipped product anyway.',
        isCritical: true,
        pointCost: 50,
        source: 'Laboratory analysis and company records',
      },
    ],
    
    diagnosis: {
      pathogenOptions: [
        { id: 'salm-typh', pathogen: 'Salmonella Typhimurium', label: 'Salmonella Typhimurium', description: 'Common serotype causing gastroenteritis' },
        { id: 'salm-enter', pathogen: 'Salmonella Enteritidis', label: 'Salmonella Enteritidis', description: 'Associated with eggs and poultry' },
        { id: 'ecoli', pathogen: 'E. coli O157:H7', label: 'E. coli O157', description: 'Produces Shiga toxin, causes HUS' },
        { id: 'listeria', pathogen: 'Listeria monocytogenes', label: 'Listeriosis', description: 'Dangerous for pregnant women and elderly' },
      ],
      sourceOptions: [
        { id: 'pca-paste', source: 'Peanut paste from Peanut Corporation of America', label: 'PCA Peanut Paste', description: 'Industrial ingredient supplier in Georgia' },
        { id: 'retail-pb', source: 'Major retail peanut butter brand', label: 'Retail Peanut Butter', description: 'Consumer peanut butter product' },
        { id: 'peanuts-raw', source: 'Raw peanuts from farms', label: 'Raw Peanuts', description: 'Agricultural contamination at farms' },
        { id: 'produce', source: 'Fresh produce', label: 'Fresh Produce', description: 'Contaminated vegetables or fruit' },
      ],
    },
    
    solution: {
      pathogenId: 'salm-typh',
      sourceId: 'pca-paste',
      pathogen: 'Salmonella Typhimurium',
      source: 'Peanut paste from Peanut Corporation of America (PCA)',
      explanation: 'This outbreak demonstrated the challenge of ingredient-driven contamination. PCA supplied peanut paste to over 200 food companies, making traceback complex. The company knowingly shipped contaminated product after receiving positive Salmonella tests. This resulted in the largest food recall in U.S. history and the first federal criminal conviction of a food company executive.',
      eisLegacy: 'This investigation led to the Food Safety Modernization Act of 2011 (FSMA), the most significant reform of U.S. food safety laws in 70 years. It established mandatory preventive controls, increased inspection frequency, and gave FDA authority to issue mandatory recalls.',
      realOutcome: '714 confirmed cases in 46 states and Canada. 9 deaths. Over 3,900 products recalled. PCA filed for bankruptcy. In 2015, the company\'s CEO was sentenced to 28 years in federal prison - the first food company executive imprisoned for a foodborne outbreak.',
      caseFatality: '9 deaths',
      totalCases: '714 confirmed cases',
      mmwrReference: 'MMWR February 6, 2009 and subsequent updates',
    },
    
    learningObjectives: [
      'Recognize ingredient-driven vs. product-driven outbreaks',
      'Use PFGE and molecular typing for outbreak detection',
      'Conduct complex traceback investigations through supply chains',
      'Understand the regulatory response to food safety failures',
    ],
    
    historicalContext: 'The PCA outbreak was a watershed moment for food safety regulation. The criminal prosecution - including the CEO receiving a 28-year sentence - established personal liability for knowingly shipping contaminated food. PulseNet, the molecular surveillance network, was essential for detecting this widespread outbreak.',
  },

  {
    id: 'fungal-meningitis-2012',
    era: '2010s',
    year: 2012,
    title: 'The Compounding Catastrophe',
    subtitle: 'Multi-State Investigation',
    teaser: 'Patients are developing meningitis weeks after routine back injections. The pathogen is something rarely seen in humans.',
    difficulty: 3,
    timeLimit: 420,
    basePoints: 650,
    
    briefing: {
      type: 'alert',
      from: 'CDC Emergency Operations Center',
      subject: 'FUNGAL MENINGITIS - Multi-State Outbreak',
      timestamp: 'September 2012',
      urgency: 'critical',
      content: `EMERGENCY INVESTIGATION

Tennessee Department of Health has reported a cluster of meningitis cases with an unusual etiology. Initial laboratory results indicate FUNGAL meningitis - extremely rare in immunocompetent patients.

KEY FINDINGS:
• All cases received epidural steroid injections for back pain
• Multiple pain clinic locations involved
• Incubation period: 7-42 days (much longer than bacterial meningitis)
• Cases now reported from multiple states

Preliminary traceback suggests contaminated injectable medication from a compounding pharmacy. This could be massive - thousands of patients may be at risk.

The pathogen appears to be Exserohilum rostratum, an environmental mold rarely causing human disease. This is NOT natural transmission.

Immediate priorities: Define scope, identify exposed patients, develop treatment guidance.`
    },
    
    clues: [
      {
        id: 'fm-clue-1',
        order: 1,
        type: 'clinical',
        title: 'Clinical Presentation',
        content: 'Fungal meningitis features:\n• Gradual onset headache (not acute like bacterial meningitis)\n• Neck stiffness, photophobia\n• Fever often LOW-GRADE or absent\n• CSF analysis: elevated white cells (lymphocyte predominant)\n• Long incubation: median 21 days from injection to symptoms\n• Some patients developing strokes from fungal arteritis\nThis is NOT typical community-acquired meningitis.',
        isCritical: false,
        pointCost: 25,
        source: 'Case series clinical review',
      },
      {
        id: 'fm-clue-2',
        order: 2,
        type: 'laboratory',
        title: 'Pathogen Identification',
        content: 'Laboratory findings:\n• Exserohilum rostratum (black mold) identified in CSF cultures\n• Additional species: Aspergillus fumigatus in some cases\n• These are environmental molds - NOT normal human pathogens\n• Culture takes 7-21 days (slower than bacteria)\n• PCR testing being developed for rapid detection',
        isCritical: true,
        pointCost: 50,
        source: 'CDC Mycotic Diseases Laboratory',
      },
      {
        id: 'fm-clue-3',
        order: 3,
        type: 'epidemiologic',
        title: 'Common Exposure',
        content: 'Epidemiologic investigation:\n• 100% of cases received epidural steroid injection\n• All injections included methylprednisolone acetate\n• ALL contaminated lots traced to ONE pharmacy:\n  New England Compounding Center (NECC), Framingham, MA\n• NECC distributed to 23 states\n• ~14,000 patients potentially exposed',
        isCritical: true,
        pointCost: 75,
        source: 'Case interviews and traceback',
      },
      {
        id: 'fm-clue-4',
        order: 4,
        type: 'environmental',
        title: 'Pharmacy Inspection',
        content: 'FDA inspection of NECC:\n• Fungal contamination found in multiple areas of cleanroom\n• Environmental samples grew Exserohilum rostratum - SAME species as patients\n• Inadequate sterility testing of compounded drugs\n• Drugs shipped before sterility test results available\n• No recall when contamination identified\n\nMassive regulatory failure: NECC was operating as manufacturer but regulated as pharmacy.',
        isCritical: true,
        pointCost: 75,
        source: 'FDA facility inspection',
      },
      {
        id: 'fm-clue-5',
        order: 5,
        type: 'timeline',
        title: 'Outbreak Timeline',
        content: 'Key dates:\n• May-Sep 2012: Three lots of contaminated methylprednisolone distributed\n• Sep 18: Tennessee identifies cluster\n• Sep 26: Voluntary recall initiated\n• Oct 3: NECC surrenders manufacturing license\n• Oct 15: 214 cases in 15 states\n• Dec 2012: >500 cases\n\nLong incubation means new cases continued for months after recall.',
        isCritical: true,
        pointCost: 50,
        source: 'Investigation timeline',
      },
    ],
    
    diagnosis: {
      pathogenOptions: [
        { id: 'exserohilum', pathogen: 'Exserohilum rostratum (fungal)', label: 'Exserohilum rostratum', description: 'Environmental black mold' },
        { id: 'bacterial', pathogen: 'Bacterial meningitis', label: 'Bacterial Meningitis', description: 'Standard bacterial pathogens' },
        { id: 'crypto', pathogen: 'Cryptococcus', label: 'Cryptococcal Meningitis', description: 'Yeast causing meningitis in immunocompromised' },
        { id: 'viral', pathogen: 'Viral meningitis', label: 'Viral Meningitis', description: 'Enterovirus or other viral cause' },
      ],
      sourceOptions: [
        { id: 'necc', source: 'Contaminated methylprednisolone from NECC', label: 'NECC Compounded Steroids', description: 'Compounding pharmacy in Massachusetts' },
        { id: 'needle', source: 'Contaminated needles at clinics', label: 'Clinic Needles', description: 'Reused or contaminated injection equipment' },
        { id: 'skin', source: 'Skin flora introduction', label: 'Skin Contamination', description: 'Patient skin organisms introduced during injection' },
        { id: 'environment', source: 'Environmental exposure unrelated to injection', label: 'Environmental Mold', description: 'Community mold exposure' },
      ],
    },
    
    solution: {
      pathogenId: 'exserohilum',
      sourceId: 'necc',
      pathogen: 'Exserohilum rostratum (environmental mold)',
      source: 'Contaminated methylprednisolone from New England Compounding Center',
      explanation: 'NECC manufactured injectable steroids in contaminated conditions. The "compounding pharmacy" loophole allowed them to produce at manufacturing scale while avoiding FDA manufacturing oversight. When fungal contamination was introduced, thousands of patients received injections containing live mold spores directly into their spinal spaces.',
      eisLegacy: 'This outbreak led to the 2013 Drug Quality and Security Act, which created a new FDA category for "outsourcing facilities" and closed the compounding loophole. It demonstrated the deadly consequences of regulatory gaps in pharmaceutical production.',
      realOutcome: '753 cases of fungal infection across 20 states. 64 deaths. NECC executives faced criminal prosecution - the supervising pharmacist received 9 years in prison. The regulatory failure led to major legislative reform.',
      caseFatality: '64 deaths (8.5% case fatality)',
      totalCases: '753 cases',
      mmwrReference: 'MMWR October 19, 2012 and subsequent updates',
    },
    
    learningObjectives: [
      'Recognize iatrogenic (healthcare-caused) outbreaks',
      'Investigate pharmaceutical manufacturing contamination',
      'Understand the role of regulatory oversight in prevention',
      'Manage large-scale patient notification for contaminated products',
    ],
    
    historicalContext: 'The NECC outbreak was one of the deadliest drug contamination events in U.S. history. It exposed how compounding pharmacies could operate as de facto manufacturers without pharmaceutical-grade oversight. The long incubation period of fungal infection meant cases continued emerging for months after the contaminated product was recalled.',
  },

  {
    id: 'ebola-dallas-2014',
    era: '2010s',
    year: 2014,
    title: 'The First Patient',
    subtitle: 'Dallas, Texas',
    teaser: 'A traveler from Liberia presents to a Texas ER with fever. What happens next will test the nation\'s pandemic preparedness.',
    difficulty: 1,
    timeLimit: 300,
    basePoints: 400,
    
    briefing: {
      type: 'alert',
      from: 'Texas Department of State Health Services',
      subject: 'CONFIRMED: First Ebola Case Diagnosed in United States',
      timestamp: 'September 30, 2014',
      urgency: 'critical',
      content: `CONFIRMED EBOLA - DALLAS

The first case of Ebola diagnosed on U.S. soil has been confirmed in Dallas, Texas.

PATIENT HISTORY:
• Male patient (age 42) traveled from Liberia, arrived September 20
• Presented to Texas Health Presbyterian ER on September 25 with fever
• Was SENT HOME with antibiotics despite travel history
• Returned September 28 by ambulance, critically ill
• Ebola confirmed by CDC laboratory September 30

The patient had direct contact with Ebola victims in Liberia, including a pregnant woman who died.

Hospital staff may have been exposed during initial ER visit and subsequent admission. Contact tracing is underway for household and community exposures.

CRITICAL QUESTION: How did the travel history get missed? How do we prevent secondary transmission?`
    },
    
    clues: [
      {
        id: 'ebola-clue-1',
        order: 1,
        type: 'clinical',
        title: 'Initial Presentation',
        content: 'September 25 ER visit:\n• Chief complaint: Fever (103°F), headache, abdominal pain\n• Travel history: Returned from Liberia 5 days prior (DOCUMENTED in nursing notes)\n• Diagnosis: "Low-risk viral illness"\n• Disposition: Sent home with antibiotics\n\nThe travel history was obtained but not acted upon. Ebola was not considered despite the largest outbreak in history occurring in West Africa.',
        isCritical: true,
        pointCost: 50,
        source: 'Medical records review',
      },
      {
        id: 'ebola-clue-2',
        order: 2,
        type: 'epidemiologic',
        title: 'Exposure History',
        content: 'Liberia contacts identified:\n• Patient helped care for a pregnant woman with Ebola\n• He transported her by taxi to a clinic (she was refused admission)\n• He carried her back home\n• She died the next day\n• He had DIRECT CONTACT with her bodily fluids\n\nIncubation period: 8-10 days from last contact to symptom onset - classic for Ebola.',
        isCritical: true,
        pointCost: 50,
        source: 'Patient interview and Liberia investigation',
      },
      {
        id: 'ebola-clue-3',
        order: 3,
        type: 'laboratory',
        title: 'Laboratory Confirmation',
        content: 'September 30 results:\n• Ebola virus (Zaire species) detected by RT-PCR\n• Viral load: HIGH (indicating active viremia)\n• Strain matches circulating West African outbreak strain\n• No mutations suggesting changed transmissibility\n\nThe patient became infectious around September 25-26 as his viral load increased.',
        isCritical: true,
        pointCost: 25,
        source: 'CDC Special Pathogens Laboratory',
      },
      {
        id: 'ebola-clue-4',
        order: 4,
        type: 'epidemiologic',
        title: 'Contact Investigation',
        content: 'Contact tracing results:\n• Household contacts: 4 (quarantined, monitored 21 days)\n• Community contacts: ~50 identified\n• Healthcare workers from initial ER visit: 70+ exposed\n• Ambulance crew: 2 EMTs exposed\n\nMonitoring protocol: Twice daily temperature checks for 21 days after last exposure. Any fever triggers isolation and testing.',
        isCritical: true,
        pointCost: 50,
        source: 'Dallas County Health and Human Services',
      },
      {
        id: 'ebola-clue-5',
        order: 5,
        type: 'environmental',
        title: 'Infection Control Assessment',
        content: 'Hospital preparedness review:\n• Staff had received minimal Ebola-specific training\n• PPE protocols were inadequate for high-consequence pathogens\n• EMR system did not flag travel from Ebola-affected countries\n• No designated Ebola isolation unit\n\nTwo nurses who cared for the patient DID become infected - Nina Pham and Amber Vinson.',
        isCritical: false,
        pointCost: 25,
        source: 'Hospital assessment',
      },
    ],
    
    diagnosis: {
      pathogenOptions: [
        { id: 'ebola', pathogen: 'Ebola virus (Zaire species)', label: 'Ebola Virus Disease', description: 'Filovirus from West Africa outbreak' },
        { id: 'malaria', pathogen: 'Plasmodium falciparum', label: 'Malaria', description: 'Parasitic infection from mosquito bites' },
        { id: 'typhoid', pathogen: 'Salmonella typhi', label: 'Typhoid Fever', description: 'Bacterial infection from contaminated food/water' },
        { id: 'viral-hf', pathogen: 'Lassa fever', label: 'Lassa Fever', description: 'Another viral hemorrhagic fever' },
      ],
      sourceOptions: [
        { id: 'liberia', source: 'Direct patient care contact in Liberia', label: 'Liberia Patient Contact', description: 'Caring for Ebola patient in West Africa' },
        { id: 'hospital', source: 'Healthcare exposure', label: 'Hospital Exposure', description: 'Acquired in healthcare setting' },
        { id: 'community', source: 'Community transmission', label: 'Community Transmission', description: 'Casual contact in community' },
        { id: 'laboratory', source: 'Laboratory exposure', label: 'Laboratory', description: 'Occupational laboratory exposure' },
      ],
    },
    
    solution: {
      pathogenId: 'ebola',
      sourceId: 'liberia',
      pathogen: 'Ebola virus (Zaire species)',
      source: 'Direct patient care contact with Ebola patient in Liberia',
      explanation: 'Thomas Eric Duncan acquired Ebola while helping care for a pregnant woman with the disease in Liberia. He developed symptoms 8 days after his last exposure, consistent with the typical Ebola incubation period. The failure to isolate him on his first ER visit led to potential exposure of dozens of healthcare workers.',
      eisLegacy: 'The Dallas case exposed gaps in U.S. healthcare preparedness for high-consequence pathogens. It led to development of designated Ebola Treatment Centers, enhanced airport screening, and CDC guidelines for travel from affected countries. The infections in healthcare workers prompted complete revision of PPE protocols.',
      realOutcome: 'Thomas Eric Duncan died October 8, 2014. Two nurses (Nina Pham and Amber Vinson) became infected but survived. The 4 household contacts did NOT develop Ebola despite no isolation for 3 days after Duncan\'s return. No community transmission occurred.',
      caseFatality: '1 death (the index case)',
      totalCases: '3 (1 imported + 2 healthcare worker infections)',
    },
    
    learningObjectives: [
      'Always obtain travel history from febrile patients',
      'Recognize Ebola clinical presentation and epidemiologic risk factors',
      'Implement appropriate isolation for suspected viral hemorrhagic fever',
      'Conduct contact investigation for high-consequence pathogens',
    ],
    
    historicalContext: 'The 2014-2016 West African Ebola epidemic killed over 11,000 people and infected 28,000. It was the largest Ebola outbreak in history. The Dallas case was the first Ebola diagnosis on U.S. soil and sparked national concern about pandemic preparedness.',
  },

  {
    id: 'zika-yap-2007',
    era: '2010s',
    year: 2007,
    title: 'Island Fever',
    subtitle: 'Yap State, Micronesia',
    teaser: 'A Pacific island is experiencing a mysterious rash illness. The culprit is a virus never before seen outside Africa and Asia.',
    difficulty: 2,
    timeLimit: 360,
    basePoints: 500,
    
    briefing: {
      type: 'memo',
      from: 'Yap State Department of Health',
      subject: 'Investigation Request - Unknown Rash Illness',
      timestamp: 'May 2007',
      urgency: 'urgent',
      content: `UNUSUAL ILLNESS CLUSTER - ASSISTANCE NEEDED

Yap State (population 7,400) is experiencing an outbreak of an unidentified illness. Over the past month, local clinics have reported numerous patients with:
• Rash
• Conjunctivitis (pink eye)
• Joint pain
• Mild fever

Initial testing for dengue fever is NEGATIVE despite similar symptoms.

Yap is a remote island in the Federated States of Micronesia, 500 miles from Guam. We have limited laboratory capacity and need assistance identifying the causative agent.

The vector: Aedes mosquitoes are abundant on the island and transmission appears ongoing.

Request: CDC assistance with specimen testing and field investigation.`
    },
    
    clues: [
      {
        id: 'zika-clue-1',
        order: 1,
        type: 'clinical',
        title: 'Clinical Picture',
        content: 'Patient presentations:\n• Maculopapular rash (flat, red, spreading)\n• Arthralgia (joint pain), especially in hands\n• Non-purulent conjunctivitis (pink eye without discharge)\n• Low-grade fever or no fever\n• Illness MILD - no hospitalizations or deaths\n\nThis looks like dengue but with more rash and conjunctivitis. Classic dengue has more fever and bleeding risk.',
        isCritical: false,
        pointCost: 25,
        source: 'Clinical assessment of patients',
      },
      {
        id: 'zika-clue-2',
        order: 2,
        type: 'laboratory',
        title: 'Diagnostic Testing',
        content: 'Laboratory results:\n• Dengue IgM: NEGATIVE in acute samples\n• Dengue NS1 antigen: NEGATIVE\n• Chikungunya: NEGATIVE\n• Ross River virus: NEGATIVE\n\nWhat else causes rash, arthralgia, and conjunctivitis transmitted by Aedes mosquitoes?\n\nSamples sent to CDC Arboviral Diseases Branch for expanded testing...',
        isCritical: true,
        pointCost: 50,
        source: 'Yap State Hospital and CDC laboratory',
      },
      {
        id: 'zika-clue-3',
        order: 3,
        type: 'laboratory',
        title: 'Pathogen Identified',
        content: 'CDC Arboviral Lab results:\n• ZIKA VIRUS detected by RT-PCR\n• Confirmed by plaque reduction neutralization test (PRNT)\n• This is the FIRST known outbreak outside Africa and Asia\n• Zika was discovered in 1947 in Uganda but rarely caused human disease\n\nHow did an obscure African virus reach a tiny Pacific island?',
        isCritical: true,
        pointCost: 75,
        source: 'CDC Division of Vector-Borne Diseases',
      },
      {
        id: 'zika-clue-4',
        order: 4,
        type: 'epidemiologic',
        title: 'Attack Rate Survey',
        content: 'Population-based serosurvey results:\n• 73% of residents age ≥3 years had IgM antibodies (recent infection)\n• Estimated 5,000 of 7,400 residents infected\n• Attack rate similar across all age groups\n• No deaths, no hospitalizations\n• Duration of outbreak: approximately 13 weeks\n\nThis island had NO prior immunity - the entire population was susceptible.',
        isCritical: true,
        pointCost: 75,
        source: 'Population serosurvey',
      },
      {
        id: 'zika-clue-5',
        order: 5,
        type: 'environmental',
        title: 'Vector Investigation',
        content: 'Entomologic assessment:\n• Aedes hensilli: Most common mosquito species on Yap (not A. aegypti)\n• Mosquito abundance: HIGH during outbreak period (rainy season)\n• Breeding sites: Coconut shells, water containers, discarded tires\n\nZika appears to have adapted to a local Aedes species - this suggests broad vector competence.',
        isCritical: false,
        pointCost: 50,
        source: 'Entomologic survey',
      },
    ],
    
    diagnosis: {
      pathogenOptions: [
        { id: 'zika', pathogen: 'Zika virus', label: 'Zika Virus', description: 'Flavivirus related to dengue, previously rare' },
        { id: 'dengue', pathogen: 'Dengue virus', label: 'Dengue Fever', description: 'Common tropical arbovirus' },
        { id: 'chik', pathogen: 'Chikungunya virus', label: 'Chikungunya', description: 'Alphavirus causing severe joint pain' },
        { id: 'rubella', pathogen: 'Rubella virus', label: 'Rubella', description: 'Causes rash and arthralgia, not vector-borne' },
      ],
      sourceOptions: [
        { id: 'mosquito', source: 'Aedes mosquito transmission', label: 'Mosquito-Borne', description: 'Transmission by local Aedes species' },
        { id: 'imported', source: 'Imported case with secondary spread', label: 'Imported Introduction', description: 'Traveler introduced virus to naive population' },
        { id: 'water', source: 'Waterborne transmission', label: 'Waterborne', description: 'Contaminated drinking water' },
        { id: 'direct', source: 'Person-to-person', label: 'Direct Contact', description: 'Respiratory or contact transmission' },
      ],
    },
    
    solution: {
      pathogenId: 'zika',
      sourceId: 'imported',
      pathogen: 'Zika virus',
      source: 'Imported case with subsequent mosquito-borne transmission',
      explanation: 'Zika virus was likely introduced to Yap by a viremic traveler. The local Aedes mosquito population amplified transmission, and the immunologically naive population experienced attack rates over 70%. The mild clinical presentation had allowed the virus to circulate undetected until someone thought to test for it.',
      eisLegacy: 'The Yap outbreak was the first recognition that Zika could cause large epidemics outside its traditional range. When Zika spread to Brazil in 2015-2016 and was linked to microcephaly and Guillain-Barré syndrome, the Yap investigation provided crucial baseline data on transmission dynamics and attack rates.',
      realOutcome: 'Approximately 5,000 of 7,400 residents infected. No deaths, no hospitalizations. The outbreak ended naturally as the susceptible population became immune. This was the harbinger of Zika\'s global spread.',
      totalCases: '~5,000 (estimated 73% of population)',
    },
    
    learningObjectives: [
      'Recognize arboviral diseases with overlapping presentations',
      'Conduct serosurveys to estimate true attack rates',
      'Understand arboviral emergence in immunologically naive populations',
      'Apply lessons from early outbreaks to subsequent epidemics',
    ],
    
    historicalContext: 'The 2007 Yap outbreak was obscure at the time but became critically important when Zika emerged in the Americas in 2015. EIS officers involved in the Yap investigation provided key expertise during the subsequent pandemic, demonstrating how field experience with emerging pathogens pays dividends for years.',
  },
];

export default cases2010s;
