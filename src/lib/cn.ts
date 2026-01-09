// src/lib/cn.ts
// Utility for conditional class name merging

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat(Infinity)
    .filter(x => typeof x === 'string' && x.length > 0)
    .join(' ');
}

export default cn;
