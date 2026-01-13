import type { Penalty, Solve } from '../types/cubes';

export function formatTime(ms: number, penalty: Penalty = null): string {
  if (penalty === 'DNF') return 'DNF';
  
  const actualMs = penalty === '+2' ? ms + 2000 : ms;
  
  const minutes = Math.floor(actualMs / 60000);
  const seconds = Math.floor((actualMs % 60000) / 1000);
  const milliseconds = Math.floor((actualMs % 1000) / 10);
  
  const timeStr = minutes > 0
    ? `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
    : `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  
  return penalty === '+2' ? `${timeStr}+` : timeStr;
}

export function getEffectiveTime(solve: Solve): number {
  if (solve.penalty === 'DNF') return Infinity;
  if (solve.penalty === '+2') return solve.time + 2000;
  return solve.time;
}

export function calculateAverage(solves: Solve[], count: number): number | null {
  if (solves.length < count) return null;
  
  const recentSolves = solves.slice(-count);
  const times = recentSolves.map(getEffectiveTime);
  
  // Check if too many DNFs (more than 1 for Ao5, proportional for others)
  const dnfCount = times.filter(t => t === Infinity).length;
  const maxDnfs = count === 5 ? 1 : Math.floor(count * 0.1);
  
  if (dnfCount > maxDnfs) return null;
  
  // Sort and remove best and worst
  const sorted = [...times].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1);
  
  // If any remaining time is DNF, average is DNF
  if (trimmed.some(t => t === Infinity)) return null;
  
  const sum = trimmed.reduce((acc, t) => acc + t, 0);
  return sum / trimmed.length;
}

export function calculateMean(solves: Solve[]): number | null {
  if (solves.length === 0) return null;
  
  const validSolves = solves.filter(s => s.penalty !== 'DNF');
  if (validSolves.length === 0) return null;
  
  const sum = validSolves.reduce((acc, s) => acc + getEffectiveTime(s), 0);
  return sum / validSolves.length;
}

export function findBestAverage(solves: Solve[], count: number): number | null {
  if (solves.length < count) return null;
  
  let best: number | null = null;
  
  for (let i = count; i <= solves.length; i++) {
    const subset = solves.slice(i - count, i);
    const avg = calculateAverage(subset, count);
    if (avg !== null && (best === null || avg < best)) {
      best = avg;
    }
  }
  
  return best;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
