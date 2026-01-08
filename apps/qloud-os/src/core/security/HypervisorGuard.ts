/**
 * 💀 Hypervisor Guard
 * 
 * PHASE OMEGA PART II: OS-level security layer for QOR OS
 * Traps unsafe APIs and provides secure execution environment
 */

export interface SecurityViolation {
  type: 'unsafe_api' | 'unverified_script' | 'memory_access' | 'network_request';
  source: string;
  timestamp: number;
  details: Record<string, any>;
}

export class HypervisorGuard {
  private violations: SecurityViolation[] = [];
  private allowedAPIs: Set<string> = new Set();
  private blockedAPIs: Set<string> = new Set([
    'eval',
    'Function',
    'setTimeout',
    'setInterval',
    'XMLHttpRequest',
    'fetch', // Controlled access only
    'WebAssembly.instantiate', // Controlled access only
    'importScripts',
    'document.write',
    'innerHTML',
    'outerHTML',
  ]);

  constructor() {
    this.setupTraps();
  }

  /**
   * Setup API traps for unsafe operations
   */
  private setupTraps(): void {
    // PHASE OMEGA PART II: Trap unsafe APIs
    if (typeof window !== 'undefined') {
      // Trap eval
      const originalEval = window.eval;
      window.eval = (...args: any[]) => {
        this.recordViolation({
          type: 'unsafe_api',
          source: 'eval',
          timestamp: Date.now(),
          details: { args },
        });
        throw new Error('eval() is blocked by HypervisorGuard');
      };

      // Trap Function constructor
      const OriginalFunction = window.Function;
      const guard = this;
      window.Function = function(...args: any[]) {
        guard.recordViolation({
          type: 'unsafe_api',
          source: 'Function',
          timestamp: Date.now(),
          details: { args },
        });
        throw new Error('Function() constructor is blocked by HypervisorGuard');
      } as any;
    }
  }

  /**
   * Record security violation
   */
  private recordViolation(violation: SecurityViolation): void {
    this.violations.push(violation);
    console.error('🔒 Security Violation:', violation);
    
    // In production, send to security feed
    this.sendToSecurityFeed(violation);
  }

  /**
   * Send violation to unified security feed
   */
  private sendToSecurityFeed(violation: SecurityViolation): void {
    // PHASE OMEGA PART II: Log to unified security feed
    // In production, this would send to a centralized security monitoring system
    const securityFeed = this.getSecurityFeed();
    securityFeed.push(violation);
    
    // Store in localStorage for now (in production, use secure backend)
    try {
      const existing = JSON.parse(localStorage.getItem('abyssos_security_feed') || '[]');
      existing.push(violation);
      localStorage.setItem('abyssos_security_feed', JSON.stringify(existing.slice(-100))); // Keep last 100
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Get security feed
   */
  private getSecurityFeed(): SecurityViolation[] {
    return this.violations;
  }

  /**
   * Check if API is allowed
   */
  isAPIAllowed(apiName: string): boolean {
    if (this.allowedAPIs.has(apiName)) {
      return true;
    }
    if (this.blockedAPIs.has(apiName)) {
      return false;
    }
    // Default: allow (can be made stricter)
    return true;
  }

  /**
   * Get all violations
   */
  getViolations(): SecurityViolation[] {
    return [...this.violations];
  }

  /**
   * Clear violations
   */
  clearViolations(): void {
    this.violations = [];
  }
}

// Global instance
export const hypervisorGuard = new HypervisorGuard();
