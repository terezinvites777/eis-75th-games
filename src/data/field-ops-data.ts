// src/data/field-ops-data.ts

import type { FieldOpsScenario, InvestigationStep } from '../types/field-ops';

export const investigationSteps: InvestigationStep[] = [
  { id: 'step-1', order: 1, icon: '\uD83C\uDF92', label: 'PREPARE', shortDescription: 'Assemble team, gather supplies, review background', hintOnWrongTap: 'Not yet \u2014 you need to prepare for the field work first' },
  { id: 'step-2', order: 2, icon: '\uD83D\uDCCA', label: 'CONFIRM OUTBREAK', shortDescription: 'Compare observed vs. expected cases', hintOnWrongTap: 'Not yet \u2014 you need to confirm the outbreak exists first' },
  { id: 'step-3', order: 3, icon: '\uD83D\uDD2C', label: 'VERIFY DIAGNOSIS', shortDescription: 'Confirm clinical + lab findings', hintOnWrongTap: 'Not yet \u2014 you need to verify the diagnosis first' },
  { id: 'step-4', order: 4, icon: '\uD83D\uDCCB', label: 'DEFINE CASE', shortDescription: 'Establish person/place/time/clinical criteria', hintOnWrongTap: 'Not yet \u2014 you need a working case definition first' },
  { id: 'step-5', order: 5, icon: '\uD83D\uDD0D', label: 'FIND CASES', shortDescription: 'Active surveillance, line listing', hintOnWrongTap: 'Not yet \u2014 you need to find cases systematically first' },
  { id: 'step-6', order: 6, icon: '\uD83D\uDCC8', label: 'DESCRIBE (PERSON/PLACE/TIME)', shortDescription: 'Epi curves, spot maps, demographics', hintOnWrongTap: 'Not yet \u2014 you need to perform descriptive epi first' },
  { id: 'step-7', order: 7, icon: '\uD83D\uDCA1', label: 'HYPOTHESIZE', shortDescription: 'Generate possible sources/exposures', hintOnWrongTap: 'Not yet \u2014 you need to develop hypotheses first' },
  { id: 'step-8', order: 8, icon: '\uD83D\uDCD0', label: 'TEST HYPOTHESES', shortDescription: 'Analytic studies (cohort, case-control)', hintOnWrongTap: 'Not yet \u2014 you need to evaluate hypotheses analytically' },
  { id: 'step-9', order: 9, icon: '\uD83D\uDEE1\uFE0F', label: 'IMPLEMENT CONTROLS', shortDescription: 'Interventions based on findings', hintOnWrongTap: 'Not yet \u2014 you need to implement controls based on findings' },
  { id: 'step-10', order: 10, icon: '\uD83D\uDCE2', label: 'COMMUNICATE', shortDescription: 'Report, press release, MMWR, debrief', hintOnWrongTap: 'That\u2019s the last step \u2014 you communicate findings after everything else' },
];

export const fieldOpsScenarios: FieldOpsScenario[] = [
  {
    id: 'banquet',
    name: 'Banquet Breakdown',
    icon: '\uD83C\uDF7D\uFE0F',
    setting: 'Multi-county GI illness after a large catered event',
    pathogen: 'Salmonella',
    investigationContext: 'Multiple EDs reporting GI illness after a large catered event. Cases are rising. Your team has arrived on scene.',
    cases: [
      { id: 'b1', patientProfile: '45F, vomiting + diarrhea, attended banquet 18 hrs ago', correctBucket: 'investigate', explanation: 'Classic presentation + exposure' },
      { id: 'b2', patientProfile: '60M, headache only, attended banquet 20 hrs ago', correctBucket: 'monitor', explanation: 'Non-specific sx, but has exposure' },
      { id: 'b3', patientProfile: '32F, vomiting + diarrhea, did NOT attend banquet, no known contacts', correctBucket: 'rule-out', explanation: 'No epidemiological link' },
      { id: 'b4', patientProfile: '28M, abdominal cramps + fever, attended banquet 16 hrs ago', correctBucket: 'investigate', explanation: 'GI sx + exposure window' },
      { id: 'b5', patientProfile: '55F, runny nose + sore throat, attended banquet 22 hrs ago', correctBucket: 'rule-out', explanation: 'Upper respiratory, not GI \u2014 different syndrome' },
      { id: 'b6', patientProfile: '70M, bloody diarrhea, attended banquet 15 hrs ago', correctBucket: 'investigate', explanation: 'Severe GI + exposure' },
      { id: 'b7', patientProfile: '40F, mild nausea, lives near banquet venue but did not attend', correctBucket: 'rule-out', explanation: 'No exposure' },
      { id: 'b8', patientProfile: '33M, vomiting, attended banquet 19 hrs ago, works in kitchen', correctBucket: 'investigate', explanation: 'Sx + exposure + potential source' },
      { id: 'b9', patientProfile: '25F, abdominal cramps, attended different event at same venue last week', correctBucket: 'monitor', explanation: 'Different event, but same venue \u2014 worth a look' },
      { id: 'b10', patientProfile: '48M, diarrhea + fever, spouse attended banquet (he did not)', correctBucket: 'monitor', explanation: 'Secondary exposure possible' },
      { id: 'b11', patientProfile: '62F, vomiting + dehydration, attended banquet 14 hrs ago, diabetic', correctBucket: 'investigate', explanation: 'Classic + vulnerable population' },
      { id: 'b12', patientProfile: '29M, ankle sprain, attended banquet', correctBucket: 'rule-out', explanation: 'Unrelated complaint' },
    ],
  },
  {
    id: 'ward',
    name: 'Ward Alarm',
    icon: '\uD83C\uDFE5',
    setting: 'Cluster of severe pneumonia in long-term care facility',
    pathogen: 'Legionella',
    investigationContext: 'A long-term care facility reports multiple residents with severe pneumonia. Wing B appears hardest hit. Your team is assessing the situation.',
    cases: [
      { id: 'w1', patientProfile: '82F, fever + cough + confusion, resident Wing B, onset 3 days ago', correctBucket: 'investigate', explanation: 'Pneumonia sx in facility' },
      { id: 'w2', patientProfile: '78M, fever + dyspnea, resident Wing B, onset 2 days ago', correctBucket: 'investigate', explanation: 'Same wing, respiratory cluster' },
      { id: 'w3', patientProfile: '65F, routine medication refill, resident Wing A, no symptoms', correctBucket: 'rule-out', explanation: 'Asymptomatic, different wing' },
      { id: 'w4', patientProfile: '85M, mild cough, resident Wing B, onset 1 day ago', correctBucket: 'monitor', explanation: 'Same wing, mild sx \u2014 possible early case' },
      { id: 'w5', patientProfile: '72F, urinary tract infection, resident Wing C', correctBucket: 'rule-out', explanation: 'Different infection type, different wing' },
      { id: 'w6', patientProfile: '80M, fever + productive cough, resident Wing B, hospitalized', correctBucket: 'investigate', explanation: 'Severe respiratory + same wing' },
      { id: 'w7', patientProfile: '45F, staff nurse Wing B, mild headache + fatigue', correctBucket: 'monitor', explanation: 'Staff in affected wing, non-specific sx' },
      { id: 'w8', patientProfile: '90F, fever + cough, resident Wing A, onset 5 days ago', correctBucket: 'monitor', explanation: 'Respiratory sx but different wing \u2014 could be spreading' },
      { id: 'w9', patientProfile: '68M, diarrhea only, resident Wing B', correctBucket: 'rule-out', explanation: 'Wrong syndrome (GI not respiratory)' },
      { id: 'w10', patientProfile: '77F, fever + dyspnea + chest pain, resident Wing B', correctBucket: 'investigate', explanation: 'Severe pneumonia in cluster wing' },
      { id: 'w11', patientProfile: '50M, maintenance worker, no patient contact, asymptomatic', correctBucket: 'rule-out', explanation: 'No exposure to patients' },
      { id: 'w12', patientProfile: '83F, mild cough, visitor to Wing B resident, onset 2 days post-visit', correctBucket: 'investigate', explanation: 'Visitor with sx post-exposure \u2014 transmission evidence' },
    ],
  },
  {
    id: 'tropical',
    name: 'Tropical Trouble',
    icon: '\uD83E\uDD9F',
    setting: 'Febrile illness with rash in coastal community post-flooding',
    pathogen: 'Dengue',
    investigationContext: 'A coastal community hit by recent flooding is reporting cases of febrile illness with rash. Standing water everywhere. Your team deploys.',
    cases: [
      { id: 't1', patientProfile: '34M, high fever + rash + joint pain, lives near flooded area', correctBucket: 'investigate', explanation: 'Classic arboviral triad + exposure' },
      { id: 't2', patientProfile: '28F, fever + headache, lives near flooded area, no rash', correctBucket: 'monitor', explanation: 'Some sx, missing rash \u2014 early presentation?' },
      { id: 't3', patientProfile: '50M, chronic back pain flare-up, lives in affected area', correctBucket: 'rule-out', explanation: 'Unrelated chronic condition' },
      { id: 't4', patientProfile: '22F, fever + rash + retro-orbital pain, traveled from unaffected area 1 week ago', correctBucket: 'investigate', explanation: 'Classic sx even with travel from elsewhere' },
      { id: 't5', patientProfile: '45F, fever + rash + myalgia, lives near standing water', correctBucket: 'investigate', explanation: 'Full triad + mosquito habitat' },
      { id: 't6', patientProfile: '60M, cough + sore throat, lives in affected area', correctBucket: 'rule-out', explanation: 'Respiratory, not arboviral syndrome' },
      { id: 't7', patientProfile: '38M, mild fever only, outdoor worker in flooded zone', correctBucket: 'monitor', explanation: 'Occupational exposure, minimal sx' },
      { id: 't8', patientProfile: '40F, fever + rash, lives 50 miles from flood zone, no travel', correctBucket: 'rule-out', explanation: 'No geographic exposure' },
      { id: 't9', patientProfile: '19M, high fever + thrombocytopenia + rash, ER admission', correctBucket: 'investigate', explanation: 'Lab finding + classic presentation' },
      { id: 't10', patientProfile: '55F, joint pain only, no fever, lives in affected area', correctBucket: 'monitor', explanation: 'Partial sx \u2014 possible late presentation' },
      { id: 't11', patientProfile: '42M, fever + hemorrhagic manifestations, flooded neighborhood', correctBucket: 'investigate', explanation: 'Severe \u2014 possible dengue hemorrhagic fever' },
      { id: 't12', patientProfile: '30F, anxiety about mosquito bites, no symptoms', correctBucket: 'rule-out', explanation: 'No clinical presentation' },
    ],
  },
  {
    id: 'silent',
    name: 'Silent Threat',
    icon: '\u2623\uFE0F',
    setting: 'Unusual cluster of inhalation illness among postal workers',
    pathogen: 'B. anthracis',
    investigationContext: 'Postal workers at a mail processing facility are falling seriously ill. Imaging shows unusual findings. Bioterrorism has not been ruled out.',
    cases: [
      { id: 's1', patientProfile: '52M, postal worker, progressive dyspnea + widened mediastinum on CXR', correctBucket: 'investigate', explanation: 'Classic inhalation anthrax presentation' },
      { id: 's2', patientProfile: '38F, postal worker, same facility, fever + malaise onset 2 days', correctBucket: 'investigate', explanation: 'Same workplace, prodromal sx' },
      { id: 's3', patientProfile: '45M, office worker different building, seasonal flu sx', correctBucket: 'rule-out', explanation: 'Different location, common illness' },
      { id: 's4', patientProfile: '50F, postal worker, same facility, mild cough, 1 day', correctBucket: 'monitor', explanation: 'Right workplace, minimal sx \u2014 very early?' },
      { id: 's5', patientProfile: '60M, postal worker different facility across town, similar sx', correctBucket: 'monitor', explanation: 'Same occupation, different site \u2014 pattern?' },
      { id: 's6', patientProfile: '42F, postal worker, same facility, skin lesion on forearm', correctBucket: 'investigate', explanation: 'Cutaneous anthrax possible \u2014 same exposure' },
      { id: 's7', patientProfile: '35M, letter carrier (outdoor), same facility, asymptomatic', correctBucket: 'monitor', explanation: 'Same facility but different exposure risk (outdoor)' },
      { id: 's8', patientProfile: '48F, postal worker, same facility, severe dyspnea + shock', correctBucket: 'investigate', explanation: 'Critical presentation + exposure' },
      { id: 's9', patientProfile: '55M, retired postal worker, hasn\'t worked in 2 years', correctBucket: 'rule-out', explanation: 'No current exposure' },
      { id: 's10', patientProfile: '40F, lives near postal facility, no occupational link, headache', correctBucket: 'rule-out', explanation: 'Proximity alone, no direct exposure' },
      { id: 's11', patientProfile: '58M, postal worker, same facility, pleural effusion on imaging', correctBucket: 'investigate', explanation: 'Radiographic finding consistent + exposure' },
      { id: 's12', patientProfile: '30F, postal worker, same facility, called in sick but went to urgent care for flu', correctBucket: 'monitor', explanation: 'Self-identified illness at same workplace' },
    ],
  },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
