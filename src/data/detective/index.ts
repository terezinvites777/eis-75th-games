// src/data/detective/index.ts
// Central export for all Disease Detective case data

import { cases1950s } from './cases-1950s';
import { cases1980s } from './cases-1980s';
import { cases2010s } from './cases-2010s';
import type { DetectiveCase, Era } from '../../types/detective';

// Export individual era arrays
export { cases1950s } from './cases-1950s';
export { cases1980s } from './cases-1980s';
export { cases2010s } from './cases-2010s';

// Combined array of all cases
export const allCases: DetectiveCase[] = [
  ...cases1950s,
  ...cases1980s,
  ...cases2010s,
];

// Get cases by era
export const getCasesByEra = (era: Era): DetectiveCase[] => {
  switch (era) {
    case '1950s':
      return cases1950s;
    case '1980s':
      return cases1980s;
    case '2010s':
      return cases2010s;
    default:
      return [];
  }
};

// Get a single case by ID
export const getCaseById = (id: string): DetectiveCase | undefined => {
  return allCases.find(c => c.id === id);
};

// Get case count by era
export const getCaseCountByEra = (): Record<Era, number> => ({
  '1950s': cases1950s.length,
  '1980s': cases1980s.length,
  '2010s': cases2010s.length,
});

// Get total case count
export const getTotalCaseCount = (): number => allCases.length;

export default allCases;
