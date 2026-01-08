/**
 * Mining Routes
 * 
 * Compute mining (Proof-of-Thought) endpoints
 */

import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db.js';
import { authenticate, getSessionId, getUserIdFromSession } from '../middleware/authenticate.js';

function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const router: Router = Router();

// Schemas
const ClaimRewardSchema = z.object({
  cycleIds: z.array(z.string()),
  receipts: z.array(z.string()).optional(),
});

// POST /api/mining/claim
router.post('/claim', authenticate, async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const userId = getUserIdFromSession(sessionId!);
    if (!userId) {
      return res.status(401).json({ error: { code: 'INVALID_SESSION', message: 'Invalid session' } });
    }
    
    const data = ClaimRewardSchema.parse(req.body);
    const db = getDb();
    
    // Calculate reward (simplified - in production, verify receipts)
    const cycles = data.cycleIds.length * 100; // Approximate cycles per ID
    const zkProofCount = data.receipts?.length || 0;
    const neuralContributions = 0; // Placeholder
    
    // Reward formula: cycles + zkProofWeight + neuralContributionScore
    const baseReward = cycles * 0.0001;
    const zkReward = zkProofCount * 10 * 0.0001;
    const neuralReward = neuralContributions * 5 * 0.0001;
    const totalReward = baseReward + zkReward + neuralReward;
    
    // Create reward record
    const cycleId = `cycle:${randomUUID()}`;
    db.prepare(`
      INSERT INTO mining_rewards (
        user_id, cycle_id, cycles, zk_proof_count, neural_contributions,
        reward_cgt, claimed, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))
    `).run(
      userId,
      cycleId,
      cycles,
      zkProofCount,
      neuralContributions,
      totalReward,
    );
    
    res.json({
      cycleId,
      rewardCgt: totalReward,
      cycles,
      zkProofCount,
      neuralContributions,
    });
  } catch (error: any) {
    console.error('Claim reward error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to claim reward' } });
  }
});

// GET /api/mining/stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const userId = getUserIdFromSession(sessionId!);
    if (!userId) {
      return res.status(401).json({ error: { code: 'INVALID_SESSION', message: 'Invalid session' } });
    }
    
    const db = getDb();
    
    const stats = db.prepare(`
      SELECT 
        SUM(cycles) as total_cycles,
        SUM(zk_proof_count) as total_zk_proofs,
        SUM(neural_contributions) as total_neural,
        SUM(reward_cgt) as total_reward,
        COUNT(*) as claim_count
      FROM mining_rewards
      WHERE user_id = ?
    `).get(userId) as any;
    
    res.json({
      totalCycles: stats.total_cycles || 0,
      totalZkProofs: stats.total_zk_proofs || 0,
      totalNeuralContributions: stats.total_neural || 0,
      totalRewardCgt: stats.total_reward || 0,
      claimCount: stats.claim_count || 0,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get stats' } });
  }
});

export default router;

