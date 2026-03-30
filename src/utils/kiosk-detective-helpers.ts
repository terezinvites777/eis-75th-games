// src/utils/kiosk-detective-helpers.ts

import type { Clue } from '../types/detective';

export interface ClueCard {
  id: string;
  title: string;
  content: string;
  source?: string;
  pointCost: number;
  isRevealed: boolean;
  gridPosition: number;
}

export function buildClueCards(
  clues: Clue[],
  revealedClueIds: string[]
): ClueCard[] {
  const typeOrder = ['clinical', 'epidemiologic', 'environmental'];
  const grouped = new Map<string, Clue[]>();

  for (const clue of clues) {
    const key = typeOrder.includes(clue.type) ? clue.type : 'additional';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(clue);
  }

  const cards: ClueCard[] = [];
  let position = 0;

  for (const type of typeOrder) {
    const group = grouped.get(type);
    if (!group?.length) continue;
    for (const clue of group) {
      cards.push({
        id: clue.id,
        title: clue.title,
        content: clue.content,
        source: clue.source,
        pointCost: clue.pointCost,
        isRevealed: revealedClueIds.includes(clue.id),
        gridPosition: position++,
      });
      if (position >= 6) break;
    }
    if (position >= 6) break;
  }

  const additional = grouped.get('additional') || [];
  for (const clue of additional) {
    if (position >= 6) break;
    cards.push({
      id: clue.id,
      title: clue.title,
      content: clue.content,
      source: clue.source,
      pointCost: clue.pointCost,
      isRevealed: revealedClueIds.includes(clue.id),
      gridPosition: position++,
    });
  }

  return cards;
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...';
}
