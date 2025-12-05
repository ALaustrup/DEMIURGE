/**
 * Compute Market Routes
 * 
 * Staked compute marketplace for AbyssGrid
 */

import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db.js';
import { authenticate, getSessionId, getUserIdFromSession } from '../middleware/authenticate.js';

const router: Router = Router();

// Schemas
const StakeSchema = z.object({
  amount: z.number().min(0),
});

const SlashSchema = z.object({
  peerId: z.string(),
  reason: z.string(),
  amount: z.number().min(0).optional(),
});

// POST /api/compute-market/stake
router.post('/stake', authenticate, async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const userId = getUserIdFromSession(sessionId!);
    if (!userId) {
      return res.status(401).json({ error: { code: 'INVALID_SESSION', message: 'Invalid session' } });
    }
    
    const data = StakeSchema.parse(req.body);
    const db = getDb();
    
    // Get or create provider
    const provider = db.prepare('SELECT * FROM compute_providers WHERE user_id = ?').get(userId) as any;
    
    if (!provider) {
      // Create new provider
      const peerId = `peer:${userId}:${Date.now()}`;
      db.prepare(`
        INSERT INTO compute_providers (
          peer_id, user_id, stake_amount, trust_score, success_rate,
          created_at, updated_at
        ) VALUES (?, ?, ?, 100.0, 1.0, datetime('now'), datetime('now'))
      `).run(peerId, userId, data.amount);
      
      return res.json({
        peerId,
        stakeAmount: data.amount,
        trustScore: 100.0,
      });
    }
    
    // Update stake
    const newStake = (provider.stake_amount || 0) + data.amount;
    db.prepare(`
      UPDATE compute_providers
      SET stake_amount = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(newStake, userId);
    
    res.json({
      peerId: provider.peer_id,
      stakeAmount: newStake,
      trustScore: provider.trust_score,
    });
  } catch (error: any) {
    console.error('Stake error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to stake' } });
  }
});

// POST /api/compute-market/withdraw
router.post('/withdraw', authenticate, async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const userId = getUserIdFromSession(sessionId!);
    if (!userId) {
      return res.status(401).json({ error: { code: 'INVALID_SESSION', message: 'Invalid session' } });
    }
    
    const data = StakeSchema.parse(req.body);
    const db = getDb();
    
    const provider = db.prepare('SELECT * FROM compute_providers WHERE user_id = ?').get(userId) as any;
    if (!provider) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Provider not found' } });
    }
    
    const currentStake = provider.stake_amount || 0;
    if (data.amount > currentStake) {
      return res.status(400).json({ error: { code: 'INSUFFICIENT_STAKE', message: 'Insufficient stake' } });
    }
    
    const newStake = currentStake - data.amount;
    db.prepare(`
      UPDATE compute_providers
      SET stake_amount = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(newStake, userId);
    
    res.json({
      peerId: provider.peer_id,
      stakeAmount: newStake,
      withdrawn: data.amount,
    });
  } catch (error: any) {
    console.error('Withdraw error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to withdraw' } });
  }
});

// POST /api/compute-market/slash
router.post('/slash', authenticate, async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const userId = getUserIdFromSession(sessionId!);
    if (!userId) {
      return res.status(401).json({ error: { code: 'INVALID_SESSION', message: 'Invalid session' } });
    }
    
    const data = SlashSchema.parse(req.body);
    const db = getDb();
    
    const provider = db.prepare('SELECT * FROM compute_providers WHERE peer_id = ?').get(data.peerId) as any;
    if (!provider) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Provider not found' } });
    }
    
    const slashAmount = data.amount || provider.stake_amount * 0.1; // Default 10% slash
    const newStake = Math.max(0, (provider.stake_amount || 0) - slashAmount);
    const newTrustScore = Math.max(0, (provider.trust_score || 100) - 10);
    const newSlashCount = (provider.slash_count || 0) + 1;
    
    db.prepare(`
      UPDATE compute_providers
      SET stake_amount = ?, trust_score = ?, slash_count = ?, updated_at = datetime('now')
      WHERE peer_id = ?
    `).run(newStake, newTrustScore, newSlashCount, data.peerId);
    
    res.json({
      peerId: data.peerId,
      slashed: slashAmount,
      newStake: newStake,
      newTrustScore: newTrustScore,
      reason: data.reason,
    });
  } catch (error: any) {
    console.error('Slash error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to slash' } });
  }
});

// GET /api/compute-market/providers
router.get('/providers', async (req, res) => {
  try {
    const db = getDb();
    const providers = db.prepare(`
      SELECT * FROM compute_providers
      ORDER BY trust_score DESC, stake_amount DESC
    `).all() as any[];
    
    res.json(providers.map(p => ({
      peerId: p.peer_id,
      stakeAmount: p.stake_amount,
      trustScore: p.trust_score,
      successRate: p.success_rate,
      zkVerifiedCount: p.zk_verified_count,
      slashCount: p.slash_count,
      totalJobs: p.total_jobs,
      successfulJobs: p.successful_jobs,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    })));
  } catch (error) {
    console.error('List providers error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to list providers' } });
  }
});

// GET /api/compute-market/pricing
router.get('/pricing', async (req, res) => {
  try {
    const { cycles, peerId } = req.query;
    
    if (!cycles || !peerId) {
      return res.json({
        basePrice: 0.001,
        cycleRate: 0.0001,
        reputationDiscount: 0.0,
        formula: 'price = base + (cycles * rate) - reputationDiscount',
      });
    }
    
    const db = getDb();
    const provider = db.prepare('SELECT * FROM compute_providers WHERE peer_id = ?').get(peerId) as any;
    
    if (!provider) {
      return res.json({
        basePrice: 0.001,
        cycleRate: 0.0001,
        reputationDiscount: 0.0,
        price: 0.001 + (parseFloat(cycles as string) * 0.0001),
      });
    }
    
    const basePrice = 0.001;
    const cycleRate = 0.0001;
    const reputationDiscount = (provider.trust_score / 100) * 0.0005; // Up to 0.5% discount
    const cyclesNum = parseFloat(cycles as string);
    const price = basePrice + (cyclesNum * cycleRate) - reputationDiscount;
    
    res.json({
      basePrice,
      cycleRate,
      reputationDiscount,
      trustScore: provider.trust_score,
      price: Math.max(0.0001, price), // Minimum price
      formula: 'price = base + (cycles * rate) - reputationDiscount',
    });
  } catch (error) {
    console.error('Pricing error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to calculate pricing' } });
  }
});

export default router;

