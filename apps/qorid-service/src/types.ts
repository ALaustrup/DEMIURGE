import { z } from 'zod';

// Username validation: lowercase a-z0-9, "_" and "-" allowed, length 3-32
export const UsernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(32, 'Username must be at most 32 characters')
  .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores, and hyphens');

// Public key validation (hex or base58)
export const PublicKeySchema = z.string()
  .min(32, 'Public key must be at least 32 characters')
  .max(200, 'Public key must be at most 200 characters');

// Registration request
export const RegisterRequestSchema = z.object({
  username: UsernameSchema,
  publicKey: PublicKeySchema,
});

// Session init request
export const SessionInitRequestSchema = z.object({
  username: UsernameSchema,
});

// Session confirm request
export const SessionConfirmRequestSchema = z.object({
  challengeId: z.string().uuid(),
  username: UsernameSchema,
  publicKey: PublicKeySchema,
  signature: z.string().min(1, 'Signature is required'),
});

// DRC-369 native mint request
export const DRC369NativeRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  uri: z.string().url(),
  contentType: z.string().optional(),
  originChain: z.enum(['DEMIURGE']).optional().default('DEMIURGE'),
  standard: z.enum(['DRC-369']).optional().default('DRC-369'),
  metadata: z.record(z.any()).optional(),
});

// DRC-369 import request
export const DRC369ImportRequestSchema = z.object({
  originChain: z.enum(['ETH', 'POLYGON', 'BSC', 'SOL', 'BTC', 'TON']),
  standard: z.enum(['ERC-721', 'ERC-1155', 'SPL', 'ORDINAL', 'ARC-3']),
  externalId: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
  uri: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
  rawPayload: z.any().optional(),
});

// Database types
export interface AbyssIdUser {
  id: number;
  username: string;
  public_key: string;
  created_at: string;
  last_login_at: string | null;
  display_name: string | null;
  avatar_url: string | null;
  metadata: string | null;
}

export interface AbyssIdSession {
  id: string;
  user_id: number;
  created_at: string;
  expires_at: string;
}

export interface DRC369Asset {
  id: string;
  owner_user_id: number;
  origin_chain: string;
  standard: string;
  name: string | null;
  description: string | null;
  uri: string | null;
  metadata: string | null;
  created_at: string;
  updated_at: string;
  wrapped: number;
  raw_payload: string | null;
}

export interface DRC369Event {
  id: number;
  asset_id: string;
  event_type: string;
  from_user_id: number | null;
  to_user_id: number | null;
  event_data: string | null;
  created_at: string;
}

