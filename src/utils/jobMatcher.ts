
export interface Mover {
  id: string;
  is_available: boolean;
  performance_score: number;
  location?: string;
  skills?: string[];
}

export interface Job {
  id: string;
  title: string;
  location: string;
  job_size: 'light' | 'medium' | 'heavy';
  price: number;
  lat?: number;
  lng?: number;
}

export async function matchJobToMover(movers: Mover[], job: Job): Promise<string | null> {
  // Filter available movers
  const available = movers.filter(m => m.is_available);
  
  if (available.length === 0) return null;
  
  // Sort by performance score (highest first)
  const best = available.sort((a, b) => b.performance_score - a.performance_score)[0];
  return best?.id || null;
}

export function assignJob(jobs: Job[], movers: Mover[]): Mover | null {
  return movers
    .filter(m => m.is_available)
    .sort((a, b) => b.performance_score - a.performance_score)[0] || null;
}
