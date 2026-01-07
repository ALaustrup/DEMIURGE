/**
 * AbyssID operations
 */

import { DemiurgeClient } from './client';
import { AbyssIDProfile, AbyssIDProgress, UserAnalytics, Address } from './types';
import { isValidUsername } from './utils';

export class AbyssIdApi {
  constructor(private client: DemiurgeClient) {}

  /**
   * Get AbyssID profile for an address
   */
  async getProfile(address: Address): Promise<AbyssIDProfile> {
    return this.client.call<AbyssIDProfile>('abyssid_get', { address });
  }

  /**
   * Create a new AbyssID profile
   */
  async createProfile(
    address: Address,
    displayName: string,
    bio?: string
  ): Promise<AbyssIDProfile> {
    return this.client.call<AbyssIDProfile>('abyssid_create', {
      address,
      display_name: displayName,
      bio,
    });
  }

  /**
   * Set username for an address (requires signing)
   */
  async setUsername(
    address: Address,
    username: string,
    signedTxHex: string
  ): Promise<void> {
    if (!isValidUsername(username)) {
      throw new Error(
        'Invalid username: must be 3-32 characters, lowercase alphanumeric + underscore'
      );
    }

    await this.client.call('abyssid_setUsername', {
      address,
      username,
      signed_tx_hex: signedTxHex,
    });
  }

  /**
   * Resolve username to address
   */
  async resolveUsername(username: string): Promise<Address | null> {
    const result = await this.client.call<{ address: string } | null>(
      'abyssid_resolveUsername',
      { username }
    );
    return result?.address ?? null;
  }

  /**
   * Get profile by username
   */
  async getProfileByUsername(username: string): Promise<AbyssIDProfile | null> {
    return this.client.call<AbyssIDProfile | null>('abyssid_getProfileByUsername', {
      username,
    });
  }

  /**
   * Get AbyssID progress (level, Syzygy, thresholds)
   */
  async getProgress(address: Address): Promise<AbyssIDProgress> {
    return this.client.call<AbyssIDProgress>('abyssid_getProgress', { address });
  }

  /**
   * Get user analytics
   */
  async getAnalytics(address: Address): Promise<UserAnalytics> {
    return this.client.call<UserAnalytics>('abyssid_getAnalytics', { address });
  }

  /**
   * Check if an address is an Archon
   */
  async isArchon(address: Address): Promise<boolean> {
    return this.client.call<boolean>('cgt_isArchon', { address });
  }
}
