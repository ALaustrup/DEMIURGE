/**
 * Fitness Scoring
 * 
 * Evaluates spirit fitness for evolution
 */

import type { SpiritGenome } from './genome';

export interface FitnessMetrics {
  performance: number; // 0-100
  successRate: number; // 0-100
  efficiency: number; // 0-100
  chainContributions: number; // 0-100
  userSatisfaction: number; // 0-100
  miningRewards: number; // 0-100
  overall: number; // Weighted average
}

/**
 * Calculate fitness for spirit
 */
export function calculateFitness(
  genome: SpiritGenome,
  metrics: {
    tasksCompleted?: number;
    tasksFailed?: number;
    computeUsed?: number;
    chainContributions?: number;
    userRating?: number;
    miningRewards?: number;
  }
): FitnessMetrics {
  // Performance (based on task completion)
  const totalTasks = (metrics.tasksCompleted || 0) + (metrics.tasksFailed || 0);
  const performance = totalTasks > 0
    ? ((metrics.tasksCompleted || 0) / totalTasks) * 100
    : 50;
  
  // Success rate
  const successRate = performance; // Same as performance for now
  
  // Efficiency (inverse of compute used per task)
  const efficiency = metrics.computeUsed && metrics.tasksCompleted
    ? Math.max(0, 100 - (metrics.computeUsed / metrics.tasksCompleted))
    : 50;
  
  // Chain contributions
  const chainContributions = Math.min(100, (metrics.chainContributions || 0) * 10);
  
  // User satisfaction
  const userSatisfaction = metrics.userRating || 50;
  
  // Mining rewards (normalized)
  const miningRewards = Math.min(100, (metrics.miningRewards || 0) * 100);
  
  // Weighted overall
  const overall = (
    performance * 0.25 +
    successRate * 0.20 +
    efficiency * 0.15 +
    chainContributions * 0.15 +
    userSatisfaction * 0.15 +
    miningRewards * 0.10
  );
  
  return {
    performance,
    successRate,
    efficiency,
    chainContributions,
    userSatisfaction,
    miningRewards,
    overall,
  };
}

/**
 * Update genome fitness
 */
export function updateGenomeFitness(genome: SpiritGenome, fitness: FitnessMetrics): SpiritGenome {
  return {
    ...genome,
    fitness: fitness.overall,
  };
}

