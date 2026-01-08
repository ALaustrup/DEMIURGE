/**
 * QorID operations
 */

import { DemiurgeClient } from './client';
import { QorIDProfile, QorIDProgress, UserAnalytics, Address } from './types';
import { isValidUsername } from './utils';

export class AbyssIdApi {
  constructor(private client: DemiurgeClient) {}

  /**
   * Get QorID profile for an address
   */
  async getProfile(address: Address): Promise<QorIDProfile> {
    return this.client.call<QorIDProfile>('abyssid_get', { address });
  }

  /**
   * Create a new QorID profile
   */
  async createProfile(
    address: Address,
    displayName: string,
    bio?: string
  ): Promise<QorIDProfile> {
    return this.client.call<QorIDProfile>('abyssid_create', {
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
  async getProfileByUsername(username: string): Promise<QorIDProfile | null> {
    return this.client.call<QorIDProfile | null>('abyssid_getProfileByUsername', {
      username,
    });
  }

  /**
   * Get QorID progress (level, Syzygy, thresholds)
   */
  async getProgress(address: Address): Promise<QorIDProgress> {
    return this.client.call<QorIDProgress>('abyssid_getProgress', { address });
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
