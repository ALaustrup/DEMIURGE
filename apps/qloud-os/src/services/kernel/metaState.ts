/**
 * Meta State
 * 
 * Unified introspection state for the entire OS
 */

import { getCognitionState } from '../cogfabrik/cognitionState';
import { getMiningStats } from '../mining/rewardEngine';
import { stabilityManager } from './stabilityManager';
import { predictiveModel } from './predictiveModel';
import { growthManager } from './growthManager';
import { spiritManager } from '../spirits/spiritManager';
import { vectorStore } from '../neural/vectorStore';
import { peerDiscovery } from '../grid/discovery';

export interface MetaState {
  timestamp: number;
  cognition: any;
  mining: any;
  stability: any;
  prediction: any;
  growth: any;
  spirits: {
    total: number;
    active: number;
    averageFitness: number;
  };
  neural: {
    vectorCount: number;
    lastUpdate: number;
  };
  grid: {
    peerCount: number;
    totalCompute: number;
  };
}

/**
 * Get complete meta state
 */
export async function getMetaState(): Promise<MetaState> {
  const cognitionState = await getCognitionState();
  const miningStats = getMiningStats();
  const stabilityMetrics = stabilityManager.getStabilityMetrics();
  const prediction = await predictiveModel.predict('short');
  const growthProposal = await growthManager.proposeGrowth();
  
  const spirits = spiritManager.getAllSpirits();
  const activeSpirits = spirits.filter(s => s.status === 'active');
  const averageFitness = spirits.length > 0
    ? spirits.reduce((sum, s) => sum + (s as any).fitness || 50, 0) / spirits.length
    : 50;
  
  const vectors = vectorStore.getAllVectors();
  const peers = peerDiscovery.getPeers();
  
  return {
    timestamp: Date.now(),
    cognition: cognitionState,
    mining: miningStats,
    stability: stabilityMetrics,
    prediction,
    growth: {
      canProceed: growthProposal.canProceed,
      decision: growthProposal.decision,
      seedCount: growthProposal.seeds.length,
    },
    spirits: {
      total: spirits.length,
      active: activeSpirits.length,
      averageFitness,
    },
    neural: {
      vectorCount: vectors.length,
      lastUpdate: vectors.length > 0
        ? Math.max(...vectors.map(v => v.metadata.timestamp))
        : 0,
    },
    grid: {
      peerCount: peers.length,
      totalCompute: peers.reduce((sum, p) => sum + p.computeScore, 0),
    },
  };
}

