// src/data/detective/cases-1980s.ts
// Era 2: 1980s - "Laboratory Revolution"
// Based on real EIS case studies from F:\EIS Program\EPICC\Case Study Library

import type { DetectiveCase } from '../../types/detective';

export const cases1980s: DetectiveCase[] = [
  {
    id: 'tss-1980',
    era: '1980s',
    year: 1980,
    title: 'The Summer of Toxic Shock',
    subtitle: 'Nationwide Investigation',
    teaser: 'Young women are dying from a mysterious syndrome. The common thread: something they all use monthly.',
    difficulty: 2,
    timeLimit: 360,
    basePoints: 550,
    
    briefing: {
      type: 'alert',
      from: 'CDC Epidemic Intelligence Service',
      subject: 'Multi-State Investigation: Toxic Shock Syndrome',
      timestamp: 'June 1980',
      urgency: 'critical',
      content: `URGENT: MULTI-STATE OUTBREAK

Since May, CDC has received reports of a rapidly increasing number of cases of a severe illness called Toxic Shock Syndrome (TSS). The syndrome was first described in 1978 in children, but the current outbreak is striking young, otherwise healthy women.

Clinical features: High fever, rash, hypotension, multiorgan involvement, and desquamation (skin peeling) during recovery. Case-fatality rate appears to be 8-13%.

Initial reports from Wisconsin and Minnesota: 95% of cases occurred in women during or shortly after menstruation. Most victims have been using tampons.

Media attention is intensifying. We need to determine: Is there an association with tampons? If so, is a specific brand responsible?

Two case-control studies are being planned immediately.`
    },
    
    clues: [
      {
        id: 'tss-clue-1',
        order: 1,
        type: 'clinical',
        title: 'Case Definition & Symptoms',
        content: 'TSS is characterized by: (1) Fever ≥102°F, (2) Diffuse sunburn-like rash, (3) Hypotension or orthostatic dizziness, (4) Involvement of ≥3 organ systems, (5) Desquamation 1-2 weeks after onset. Staphylococcus aureus is isolated from most patients. The illness is caused by a staph toxin, not the bacteria itself.',
        isCritical: false,
        pointCost: 25,
        source: 'Clinical case series review',
      },
      {
        id: 'tss-clue-2',
        order: 2,
        type: 'epidemiologic',
        title: 'First Case-Control Study (CDC-1)',
        content: 'Study of 52 cases vs. 52 age-matched friend controls:\n• Tampon use: 50/50 cases (100%) vs 43/50 controls (86%)\n• p-value = 0.02 (statistically significant)\n• Continuous tampon use during menses: Odds Ratio = 16.0\nTampon use is strongly associated with TSS.',
        isCritical: true,
        pointCost: 75,
        source: 'CDC Case-Control Study #1, June 1980',
      },
      {
        id: 'tss-clue-3',
        order: 3,
        type: 'epidemiologic',
        title: 'Second Case-Control Study (CDC-2)',
        content: 'Brand-specific analysis of 50 cases (July-August 1980):\n• Rely brand: 71% of cases vs 26% of controls\n• Odds Ratio for Rely: 7.7 (95% CI: 2.6-22.6)\n• Rely tampons were introduced in 1975 as "super-absorbent"\n• They could be worn longer and absorbed more fluid than competitors.',
        isCritical: true,
        pointCost: 75,
        source: 'CDC Case-Control Study #2, September 1980',
      },
      {
        id: 'tss-clue-4',
        order: 4,
        type: 'laboratory',
        title: 'Mechanism Investigation',
        content: 'Laboratory studies suggest super-absorbent tampons create conditions favoring S. aureus growth and toxin production. The synthetic materials (polyacrylate foam and carboxymethylcellulose) in Rely tampons may:\n• Provide nutrient medium for bacteria\n• Increase oxygen exposure favoring toxin production\n• Allow longer wear time, increasing bacterial multiplication.',
        isCritical: true,
        pointCost: 50,
        source: 'NIH and academic laboratory studies',
      },
      {
        id: 'tss-clue-5',
        order: 5,
        type: 'timeline',
        title: 'Temporal Pattern',
        content: 'TSS case reports by month (1980):\n• Jan-April: ~20 cases reported\n• May: 47 cases\n• June: 72 cases (MMWR publication)\n• July: 119 cases\n• August: 156 cases\nThe sharp increase coincides with summer months and peak tampon sales. Rely held 24% of the tampon market but was involved in 71% of cases.',
        isCritical: true,
        pointCost: 50,
        source: 'CDC Surveillance data',
      },
    ],
    
    diagnosis: {
      pathogenOptions: [
        { id: 'staph-tsst', pathogen: 'Staphylococcus aureus TSST-1 toxin', label: 'Staph Toxin (TSST-1)', description: 'Toxic shock syndrome toxin-1 produced by S. aureus' },
        { id: 'strep', pathogen: 'Streptococcal toxic shock', label: 'Strep Toxin', description: 'Group A strep-associated toxic shock' },
        { id: 'viral', pathogen: 'Unknown viral agent', label: 'Viral Illness', description: 'New viral pathogen with sepsis-like syndrome' },
        { id: 'chemical', pathogen: 'Chemical toxicity', label: 'Chemical Reaction', description: 'Toxic reaction to tampon materials' },
      ],
      sourceOptions: [
        { id: 'rely', source: 'Rely brand super-absorbent tampons', label: 'Rely Tampons', description: 'Super-absorbent tampons with synthetic materials' },
        { id: 'all-tampons', source: 'All tampon brands', label: 'All Tampons', description: 'General tampon use regardless of brand' },
        { id: 'personal', source: 'Personal hygiene practices', label: 'Hygiene Practices', description: 'Individual hygiene during menstruation' },
        { id: 'other-products', source: 'Other menstrual products', label: 'Other Products', description: 'Pads or other menstrual products' },
      ],
    },
    
    solution: {
      pathogenId: 'staph-tsst',
      sourceId: 'rely',
      pathogen: 'Staphylococcus aureus TSST-1 toxin',
      source: 'Rely brand super-absorbent tampons',
      explanation: 'TSS is caused by TSST-1, a superantigen toxin produced by certain strains of S. aureus. Super-absorbent tampons, particularly Rely brand, created conditions ideal for bacterial growth and toxin production: the synthetic materials provided nutrients, increased oxygen delivery, and allowed prolonged wear. The 7.7 odds ratio for Rely meant users were nearly 8 times more likely to develop TSS.',
      eisLegacy: 'This investigation demonstrated the power of epidemiology to identify product-related health risks. Within weeks of the CDC-2 study results, Rely was voluntarily withdrawn from the market. The case led to FDA regulation of tampon absorbency labeling and mandatory package warnings. It remains a landmark example of how epidemiologic evidence can drive rapid product recalls.',
      realOutcome: 'By December 1980, 890 cases and 73 deaths had been reported. Procter & Gamble withdrew Rely tampons from the market in September 1980. TSS incidence dropped dramatically after the recall and implementation of absorbency labeling.',
      caseFatality: '8-13% case fatality rate',
      totalCases: '890 cases reported in 1980; 73 deaths',
      mmwrReference: 'MMWR May 23, 1980 and subsequent reports',
    },
    
    learningObjectives: [
      'Design and interpret matched case-control studies',
      'Calculate and interpret odds ratios',
      'Understand dose-response relationships (tampon absorbency)',
      'Apply epidemiologic findings to regulatory action',
    ],
    
    historicalContext: 'The TSS investigation was one of the first times CDC used epidemiologic evidence to implicate a consumer product, leading to its removal from the market. The investigation occurred over just 4 months from first reports to product recall - a model for rapid public health response.',
  },

  {
    id: 'legionnaires-1989',
    era: '1980s',
    year: 1989,
    title: 'Pneumonia in Paper Mill Country',
    subtitle: 'Bogalusa, Louisiana',
    teaser: 'A small town is overwhelmed with pneumonia cases. The answer might be blowing in the wind.',
    difficulty: 2,
    timeLimit: 360,
    basePoints: 550,
    
    briefing: {
      type: 'phone',
      from: 'Louisiana Department of Health and Hospitals',
      subject: 'Pneumonia Cluster - Bogalusa, Washington Parish',
      timestamp: 'October 31, 1989',
      urgency: 'urgent',
      content: `FIELD SUPPORT REQUESTED

Bogalusa (pop. ~16,000) is reporting an explosive increase in pneumonia cases. Two local physicians have notified us of over 50 cases of acute pneumonia in the past 3 weeks - far exceeding normal numbers.

Six patients have died.

All cases are in adults. Clinical histories suggest possible Legionnaires' disease - patients are presenting with high fever, confusion, weakness, and patchy pneumonia on chest X-ray. Some report watery diarrhea.

The town's largest employer is a paper mill with prominent cooling towers in the center of town. The mill also has paper machines that emit large aerosol plumes over the main street.

Many residents are convinced the cooling towers are responsible. We need field investigation support and laboratory assistance.`
    },
    
    clues: [
      {
        id: 'legion-clue-1',
        order: 1,
        type: 'clinical',
        title: 'Clinical Picture',
        content: 'Patients present with: high fever (often >104°F), severe fatigue and weakness, mental confusion, dry cough, watery diarrhea, and patchy infiltrates on chest X-ray. This constellation is characteristic of Legionella pneumonia rather than typical bacterial pneumonia. Risk factors include: older age, smoking, diabetes, and immunosuppression.',
        isCritical: false,
        pointCost: 25,
        source: 'Medical record review at local hospitals',
      },
      {
        id: 'legion-clue-2',
        order: 2,
        type: 'epidemiologic',
        title: 'Hospital Discharge Data',
        content: 'Hospital A pneumonia discharges by month (Oct):\n• October 1986: 15 cases\n• October 1987: 8 cases\n• October 1988: 10 cases\n• October 1989: 70 cases\nThis 7-fold increase confirms a true outbreak, not enhanced surveillance. Cases cluster among adults >20 years. No pediatric cases.',
        isCritical: true,
        pointCost: 50,
        source: 'Hospital discharge records 1986-1989',
      },
      {
        id: 'legion-clue-3',
        order: 3,
        type: 'laboratory',
        title: 'Laboratory Confirmation',
        content: 'CDC laboratory results: Legionella pneumophila serogroup 1 confirmed by:\n• Urinary antigen testing (positive in 42 cases)\n• Serology: ≥4-fold rise in antibody titers\n• Direct culture from respiratory specimens in 3 cases\nThis IS Legionnaires\' disease.',
        isCritical: true,
        pointCost: 50,
        source: 'CDC Laboratory analysis',
      },
      {
        id: 'legion-clue-4',
        order: 4,
        type: 'environmental',
        title: 'Source Investigation',
        content: 'Environmental sampling results:\n• Paper mill cooling towers: Legionella detected, BUT different serogroup than patient isolates\n• Hospital cooling tower: LOW Legionella counts, different serogroup\n• GROCERY STORE PRODUCE MISTER: Legionella pneumophila serogroup 1 - MATCHES patient isolates\nThe produce mister uses an ultrasonic device that creates fine aerosols to keep vegetables fresh.',
        isCritical: true,
        pointCost: 75,
        source: 'Environmental sampling and molecular typing',
      },
      {
        id: 'legion-clue-5',
        order: 5,
        type: 'epidemiologic',
        title: 'Exposure Analysis',
        content: 'Case-control study (35 cases vs. 105 community controls):\n• Visited grocery store in 10 days before illness: 86% cases vs 31% controls (OR = 14.2)\n• Passed by paper mill: 71% cases vs 68% controls (OR = 1.2, not significant)\n• Time spent near produce section: dose-response relationship observed',
        isCritical: true,
        pointCost: 75,
        source: 'Case-control study',
      },
    ],
    
    diagnosis: {
      pathogenOptions: [
        { id: 'legionella', pathogen: 'Legionella pneumophila', label: 'Legionella pneumophila', description: 'Waterborne bacterium causing Legionnaires\' disease' },
        { id: 'strep-pneumo', pathogen: 'Streptococcus pneumoniae', label: 'Pneumococcal Pneumonia', description: 'Common bacterial pneumonia' },
        { id: 'mycoplasma', pathogen: 'Mycoplasma pneumoniae', label: 'Walking Pneumonia', description: 'Atypical pneumonia, usually milder' },
        { id: 'influenza', pathogen: 'Influenza virus', label: 'Influenza', description: 'Viral respiratory illness' },
      ],
      sourceOptions: [
        { id: 'produce-mister', source: 'Grocery store produce misting system', label: 'Produce Mister', description: 'Ultrasonic misting system in produce section' },
        { id: 'cooling-tower', source: 'Paper mill cooling towers', label: 'Cooling Towers', description: 'Industrial cooling towers visible throughout town' },
        { id: 'hospital-ac', source: 'Hospital air conditioning', label: 'Hospital A/C', description: 'Hospital cooling system' },
        { id: 'potable-water', source: 'Municipal water supply', label: 'Water Supply', description: 'Town drinking water' },
      ],
    },
    
    solution: {
      pathogenId: 'legionella',
      sourceId: 'produce-mister',
      pathogen: 'Legionella pneumophila serogroup 1',
      source: 'Grocery store produce misting system',
      explanation: 'Despite widespread suspicion of the paper mill cooling towers, molecular typing showed the outbreak strain matched Legionella from the grocery store\'s produce misting system. The ultrasonic mister created fine aerosols that could be inhaled deep into the lungs. The case-control study showed a 14-fold increased risk among recent grocery store visitors compared to non-visitors.',
      eisLegacy: 'This investigation demonstrated that community assumptions about obvious industrial sources can be wrong. Molecular epidemiology - matching patient and environmental isolates - was crucial to identifying the true source. The case led to increased attention to produce misters as potential Legionella sources and changes in mister maintenance protocols nationwide.',
      realOutcome: '86 confirmed cases and 6 deaths. The produce mister was immediately removed. No new cases occurred after source removal. This became a landmark investigation in the study of community-acquired Legionnaires\' disease.',
      caseFatality: '6 deaths (7% case fatality)',
      totalCases: '86 confirmed cases',
    },
    
    learningObjectives: [
      'Recognize the clinical presentation of Legionella pneumonia',
      'Use molecular typing to match environmental and clinical isolates',
      'Avoid premature source attribution based on obvious suspects',
      'Design case-control studies for community outbreaks',
    ],
    
    historicalContext: 'This 1989 investigation occurred 13 years after the original 1976 Philadelphia outbreak that gave Legionnaires\' disease its name. By 1989, laboratory methods had advanced significantly, allowing precise matching of environmental and clinical isolates - a technique that solved this investigation.',
  },

  {
    id: 'ems-1989',
    era: '1980s',
    year: 1989,
    title: 'The Supplement Mystery',
    subtitle: 'Nationwide Investigation',
    teaser: 'A new syndrome is crippling patients across America. They all have one thing in common: a health supplement.',
    difficulty: 3,
    timeLimit: 420,
    basePoints: 650,
    
    briefing: {
      type: 'alert',
      from: 'CDC Epidemic Intelligence Service',
      subject: 'Eosinophilia-Myalgia Syndrome - New Clinical Entity',
      timestamp: 'November 1989',
      urgency: 'critical',
      content: `URGENT: NEW SYNDROME IDENTIFIED

New Mexico and Minnesota have independently reported clusters of a previously unrecognized syndrome characterized by:
• Severe muscle pain (myalgia)
• Extreme fatigue
• Markedly elevated eosinophils (a type of white blood cell)
• Skin changes and hardening

Initial interviews reveal that all identified patients have been taking L-tryptophan, an amino acid dietary supplement sold for sleep and mood enhancement.

L-tryptophan has been on the market for years with millions of users. Why are we suddenly seeing this syndrome now?

Hypothesis: Either a specific batch is contaminated, or a specific manufacturer's product is responsible.

CDC is coordinating a nationwide investigation with FDA.`
    },
    
    clues: [
      {
        id: 'ems-clue-1',
        order: 1,
        type: 'clinical',
        title: 'Clinical Syndrome',
        content: 'Eosinophilia-Myalgia Syndrome (EMS) features:\n• Eosinophil count >1,000/µL (often >5,000)\n• Severe myalgia limiting daily activities\n• Skin changes: edema, thickening, rash\n• Pulmonary symptoms in some cases\n• Progression can be rapid and severe\n• Some patients developing permanent disability\nNo infectious agent identified. Appears to be a toxic/metabolic syndrome.',
        isCritical: false,
        pointCost: 25,
        source: 'Case series review',
      },
      {
        id: 'ems-clue-2',
        order: 2,
        type: 'epidemiologic',
        title: 'National Surveillance',
        content: 'By end of November 1989:\n• Cases reported from all 50 states\n• >1,000 cases meeting case definition\n• 19 deaths reported\n• 95% of cases report L-tryptophan use before onset\n• Attack rate among L-tryptophan users: estimated 1 in 50,000\nThis is not coincidence - L-tryptophan is clearly implicated.',
        isCritical: true,
        pointCost: 50,
        source: 'CDC National surveillance',
      },
      {
        id: 'ems-clue-3',
        order: 3,
        type: 'epidemiologic',
        title: 'Manufacturer Investigation',
        content: 'Traceback of L-tryptophan from cases:\n• Multiple retailers involved, BUT...\n• All traced product originated from ONE manufacturer: Showa Denko K.K. in Japan\n• Showa Denko supplies >50% of U.S. L-tryptophan market\n• Cases tied to lots produced after December 1988\n\nSomething changed at this manufacturer in late 1988.',
        isCritical: true,
        pointCost: 75,
        source: 'FDA traceback investigation',
      },
      {
        id: 'ems-clue-4',
        order: 4,
        type: 'laboratory',
        title: 'Contaminant Identification',
        content: 'FDA laboratory analysis of Showa Denko L-tryptophan:\n• Novel contaminant identified: "Peak E" or EBT (1,1\'-ethylidenebis[tryptophan])\n• Present ONLY in post-December 1988 lots\n• Not found in other manufacturers\' products\n• Concentration correlates with case-associated lots\n\nWhat changed in manufacturing?',
        isCritical: true,
        pointCost: 75,
        source: 'FDA Laboratory analysis',
      },
      {
        id: 'ems-clue-5',
        order: 5,
        type: 'environmental',
        title: 'Manufacturing Changes',
        content: 'Showa Denko manufacturing changes in 1988:\n• Introduced new bacterial strain (Strain V) for L-tryptophan fermentation\n• Reduced amount of activated charcoal used in purification\n• Bypassed a filtration step to increase yield\n\nThese changes may have allowed a contaminant to accumulate that was previously removed.',
        isCritical: true,
        pointCost: 50,
        source: 'Manufacturing inspection and company records',
      },
    ],
    
    diagnosis: {
      pathogenOptions: [
        { id: 'contaminant', pathogen: 'Chemical contaminant in L-tryptophan', label: 'Manufacturing Contaminant', description: 'Toxic byproduct from altered manufacturing' },
        { id: 'l-tryp', pathogen: 'L-tryptophan itself', label: 'L-Tryptophan Toxicity', description: 'Inherent toxicity of the amino acid' },
        { id: 'autoimmune', pathogen: 'Autoimmune trigger', label: 'Autoimmune Disease', description: 'Triggered autoimmune condition' },
        { id: 'infection', pathogen: 'Bacterial contamination', label: 'Infection', description: 'Contaminating microorganism' },
      ],
      sourceOptions: [
        { id: 'showa-denko', source: 'Showa Denko K.K. L-tryptophan', label: 'Single Manufacturer', description: 'L-tryptophan from Showa Denko K.K., Japan' },
        { id: 'all-ltryp', source: 'All L-tryptophan products', label: 'All L-Tryptophan', description: 'L-tryptophan from any manufacturer' },
        { id: 'other-supp', source: 'Multiple supplements', label: 'Multiple Supplements', description: 'Various dietary supplements' },
        { id: 'pharmacy', source: 'Pharmaceutical-grade product', label: 'Prescription Product', description: 'Prescription L-tryptophan preparations' },
      ],
    },
    
    solution: {
      pathogenId: 'contaminant',
      sourceId: 'showa-denko',
      pathogen: 'Chemical contaminant (EBT/"Peak E") in L-tryptophan',
      source: 'Showa Denko K.K. L-tryptophan',
      explanation: 'EMS was caused by a contaminant created during Showa Denko\'s L-tryptophan manufacturing process. When the company changed their bacterial fermentation strain and reduced purification steps in 1988, a novel compound (EBT) accumulated in the final product. This contaminant triggered an inflammatory response in users, causing the severe eosinophilia and tissue damage characteristic of EMS.',
      eisLegacy: 'The EMS investigation led to FDA removing L-tryptophan supplements from the U.S. market (ban lasted until 2001). It demonstrated the risks of unregulated dietary supplements and manufacturing changes without adequate safety testing. The case strengthened arguments for the 1994 Dietary Supplement Health and Education Act.',
      realOutcome: 'By 1991: >1,500 cases and 37 deaths reported. Many survivors developed chronic disability. Showa Denko faced billions in lawsuits. L-tryptophan was banned from U.S. sale until 2001.',
      caseFatality: '37 deaths',
      totalCases: '>1,500 cases meeting case definition',
    },
    
    learningObjectives: [
      'Conduct traceback investigations to identify common source',
      'Recognize role of manufacturing changes in product safety',
      'Distinguish between product-related vs. contaminant-related illness',
      'Apply epidemiologic methods to supplement safety investigation',
    ],
    
    historicalContext: 'The EMS epidemic occurred when dietary supplements had minimal FDA oversight. The investigation demonstrated how manufacturing "improvements" to increase yield could introduce dangerous contaminants. It remains a cautionary tale about supplement safety.',
  },
];

export default cases1980s;
