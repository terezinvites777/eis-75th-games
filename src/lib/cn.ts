// src/lib/cn.ts
// Utility for conditional class name merging

type ClassValue = string | number | boolean | undefined | null;

export function cn(...inputs: (ClassValue | ClassValue[])[]): string {
  const flatten = (arr: (ClassValue | ClassValue[])[]): ClassValue[] => {
    const result: ClassValue[] = [];
    for (const item of arr) {
      if (Array.isArray(item)) {
        result.push(...flatten(item));
      } else {
        result.push(item);
      }
    }
    return result;
  };

  return flatten(inputs)
    .filter((x): x is string => typeof x === 'string' && x.length > 0)
    .join(' ');
}

export default cn;
