import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getDb } from '../db.js';
import {
  RegisterRequestSchema,
  SessionInitRequestSchema,
  SessionConfirmRequestSchema,
  UsernameSchema,
} from '../types.js';

const router: Router = Router();
const challenges = new Map<string, { username: string; expiresAt: Date }>();

// Check username availability
router.get('/username-available', (req, res) => {
  try {
    const username = UsernameSchema.parse(req.query.username);
    const db = getDb();
    
    const user = db.prepare('SELECT id FROM abyssid_users WHERE username = ?').get(username.toLowerCase());
    
    if (user) {
      return res.json({ available: false });
    }
    
    res.json({ available: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } });
    }
    console.error('Username availability check error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to check username availability' } });
  }
});

// Register new AbyssID
router.post('/register', (req, res) => {
  try {
    const { username, publicKey } = RegisterRequestSchema.parse(req.body);
    const db = getDb();
    const normalizedUsername = username.toLowerCase();
    
    // Check if username already exists
    const existing = db.prepare('SELECT id FROM abyssid_users WHERE username = ?').get(normalizedUsername);
    if (existing) {
      return res.status(409).json({ error: { code: 'USERNAME_TAKEN', message: 'Username already taken' } });
    }
    
    // Insert new user
    const result = db.prepare(`
      INSERT INTO abyssid_users (username, public_key, created_at)
      VALUES (?, ?, datetime('now'))
    `).run(normalizedUsername, publicKey);
    
    // Also insert into keys table
    db.prepare(`
      INSERT INTO abyssid_keys (user_id, public_key, label, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `).run(result.lastInsertRowid, publicKey, 'primary');
    
    res.json({
      userId: result.lastInsertRowid,
      username: normalizedUsername,
      publicKey,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to register user' } });
  }
});

// Initialize session (get challenge)
router.post('/session/init', (req, res) => {
  try {
    const { username } = SessionInitRequestSchema.parse(req.body);
    const db = getDb();
    const normalizedUsername = username.toLowerCase();
    
    // Check if user exists
    const user = db.prepare('SELECT id FROM abyssid_users WHERE username = ?').get(normalizedUsername) as { id: number } | undefined;
    if (!user) {
      return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }
    
    // Generate challenge
    const challengeId = randomUUID();
    const challenge = randomUUID(); // In production, use a proper nonce
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    challenges.set(challengeId, { username: normalizedUsername, expiresAt });
    
    res.json({
      challengeId,
      challenge,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } });
    }
    console.error('Session init error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to initialize session' } });
  }
});

// Confirm session (verify signature and create session)
router.post('/session/confirm', (req, res) => {
  try {
    const { challengeId, username, publicKey, signature } = SessionConfirmRequestSchema.parse(req.body);
    const db = getDb();
    const normalizedUsername = username.toLowerCase();
    
    // Verify challenge
    const challenge = challenges.get(challengeId);
    if (!challenge) {
      return res.status(400).json({ error: { code: 'INVALID_CHALLENGE', message: 'Invalid or expired challenge' } });
    }
    
    if (challenge.expiresAt < new Date()) {
      challenges.delete(challengeId);
      return res.status(400).json({ error: { code: 'CHALLENGE_EXPIRED', message: 'Challenge expired' } });
    }
    
    if (challenge.username !== normalizedUsername) {
      return res.status(400).json({ error: { code: 'USERNAME_MISMATCH', message: 'Username mismatch' } });
    }
    
    // Get user
    const user = db.prepare('SELECT * FROM abyssid_users WHERE username = ?').get(normalizedUsername) as any;
    if (!user) {
      return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }
    
    // TODO: Verify signature cryptographically
    // For now, accept any non-empty signature
    if (!signature || signature.length === 0) {
      return res.status(400).json({ error: { code: 'INVALID_SIGNATURE', message: 'Invalid signature' } });
    }
    
    // Create session
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    db.prepare(`
      INSERT INTO abyssid_sessions (id, user_id, created_at, expires_at)
      VALUES (?, ?, datetime('now'), ?)
    `).run(sessionId, user.id, expiresAt.toISOString());
    
    // Update last login
    db.prepare('UPDATE abyssid_users SET last_login_at = datetime("now") WHERE id = ?').run(user.id);
    
    // Clean up challenge
    challenges.delete(challengeId);
    
    res.json({
      sessionId,
      user: {
        id: user.id,
        username: user.username,
        publicKey: user.public_key,
        avatarUrl: user.avatar_url,
        displayName: user.display_name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } });
    }
    console.error('Session confirm error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to confirm session' } });
  }
});

// Get current user (requires auth)
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' } });
    }
    
    const sessionId = authHeader.substring(7);
    const db = getDb();
    
    // Get session
    const session = db.prepare(`
      SELECT s.*, u.*
      FROM abyssid_sessions s
      JOIN abyssid_users u ON s.user_id = u.id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    `).get(sessionId) as any;
    
    if (!session) {
      return res.status(401).json({ error: { code: 'INVALID_SESSION', message: 'Invalid or expired session' } });
    }
    
    // Get user's keys
    const keys = db.prepare('SELECT public_key, label FROM abyssid_keys WHERE user_id = ?').all(session.user_id) as Array<{ public_key: string; label: string | null }>;
    
    // Get basic stats
    const assetCount = db.prepare('SELECT COUNT(*) as count FROM drc369_assets WHERE owner_user_id = ?').get(session.user_id) as { count: number };
    
    res.json({
      id: session.id,
      username: session.username,
      publicKey: session.public_key,
      avatarUrl: session.avatar_url,
      displayName: session.display_name,
      createdAt: session.created_at,
      lastLoginAt: session.last_login_at,
      keys: keys.map(k => ({ publicKey: k.public_key, label: k.label })),
      stats: {
        assetCount: assetCount.count,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get user info' } });
  }
});

export default router;

