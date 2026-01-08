/**
 * Reward Engine
 * 
 * Calculates CGT rewards for compute mining
 */

import { computeMeter } from './computeMeter';

interface MiningReward {
  cycles: number;
  zkProofWeight: number;
  neuralContributionScore: number;
  totalReward: number; // CGT
}

/**
 * Calculate mining reward
 * 
 * Formula: cycles + zkProofWeight + neuralContributionScore
 */
export function calculateReward(
  cycles: number,
  zkProofCount: number,
  neuralContributions: number
): MiningReward {
  // Base reward per cycle
  const baseRewardPerCycle = 0.0001;
  
  // ZK proof weight (each proof is worth 10x cycles)
  const zkProofWeight = zkProofCount * 10 * baseRewardPerCycle;
  
  // Neural contribution score (each contribution is worth 5x cycles)
  const neuralContributionScore = neuralContributions * 5 * baseRewardPerCycle;
  
  // Total reward
  const totalReward = (cycles * baseRewardPerCycle) + zkProofWeight + neuralContributionScore;
  
  return {
    cycles,
    zkProofWeight,
    neuralContributionScore,
    totalReward,
  };
}

/**
 * Get current mining stats
 */
export function getMiningStats(): MiningReward {
  const totalCycles = computeMeter.getTotalCycles();
  const verifiedCycles = computeMeter.getVerifiedCycles();
  const zkProofCount = Math.floor(verifiedCycles / 100); // Approximate
  const neuralContributions = computeMeter.getCyclesByType('vector');
  
  return calculateReward(totalCycles, zkProofCount, neuralContributions);
}

