/**
 * QorID Server API Integration
 * 
 * Provides safe, non-blocking hooks for server-side QorID operations.
 * All functions gracefully degrade if the server is unavailable.
 */

export interface AbyssProfile {
  username: string;
  publicKey: string;
  address?: string;
  createdAt?: number;
}

// Configurable API base URL (can be set via environment variable)
const QORID_API_BASE = import.meta.env.VITE_QORID_API_BASE || '';

/**
 * Register an QorID on the server
 * 
 * This is a non-blocking operation. If the server is unavailable,
 * the function will log a warning but not throw an error.
 */
export async function registerAbyssIdOnServer(session: {
  username: string;
  publicKey: string;
  sessionId: string;
}): Promise<void> {
  if (!QORID_API_BASE) {
    // Server not configured, silently skip
    return;
  }

  try {
    const response = await fetch(`${QORID_API_BASE}/api/qorid/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: session.username,
        publicKey: session.publicKey,
        sessionId: session.sessionId,
      }),
    });

    if (!response.ok) {
      console.warn(`QorID server registration failed: ${response.status}`);
    }
  } catch (error) {
    // Non-blocking: log warning but don't throw
    console.warn('QorID server unavailable, continuing with local-only mode:', error);
  }
}

/**
 * Fetch an QorID profile from the server
 * 
 * Returns null if the server is unavailable or the profile is not found.
 */
export async function fetchAbyssProfile(username: string): Promise<AbyssProfile | null> {
  if (!QORID_API_BASE) {
    return null;
  }

  try {
    const response = await fetch(`${QORID_API_BASE}/api/qorid/profile/${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.warn(`QorID profile fetch failed: ${response.status}`);
      return null;
    }

    const profile = await response.json() as AbyssProfile;
    return profile;
  } catch (error) {
    // Non-blocking: return null on error
    console.warn('QorID server unavailable:', error);
    return null;
  }
}

/**
 * Check if the QorID server is available
 */
export async function checkServerAvailability(): Promise<boolean> {
  if (!QORID_API_BASE) {
    return false;
  }

  try {
    const response = await fetch(`${QORID_API_BASE}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

