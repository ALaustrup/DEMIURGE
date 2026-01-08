/**
 * Mutation Supervisor
 * 
 * Ensures mutations don't break invariants
 */

import type { ModuleMutation } from './autopoiesisTypes';

interface Invariant {
  name: string;
  check: (code: string) => boolean;
}

class MutationSupervisor {
  private invariants: Invariant[] = [];
  
  constructor() {
    // Define core invariants
    this.invariants = [
      {
        name: 'No infinite loops',
        check: (code) => {
          // Simple check for common infinite loop patterns
          const loopCount = (code.match(/while\s*\(true\)/g) || []).length;
          const breakCount = (code.match(/break/g) || []).length;
          return loopCount === 0 || breakCount >= loopCount;
        },
      },
      {
        name: 'No eval or dangerous functions',
        check: (code) => {
          const dangerous = ['eval', 'Function', 'setTimeout', 'setInterval'];
          return !dangerous.some(d => code.includes(d));
        },
      },
      {
        name: 'Has error handling',
        check: (code) => {
          return code.includes('try') || code.includes('catch') || code.includes('error');
        },
      },
    ];
  }
  
  /**
   * Validate mutation
   */
  validateMutation(mutation: ModuleMutation): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check invariants
    for (const invariant of this.invariants) {
      if (!invariant.check(mutation.code)) {
        errors.push(`Invariant violation: ${invariant.name}`);
      }
    }
    
    // Check that required invariants are preserved
    for (const required of mutation.invariants) {
      if (!mutation.code.includes(required)) {
        errors.push(`Missing required invariant: ${required}`);
      }
    }
    
    // Check code structure
    if (mutation.code.length < 10) {
      errors.push('Code too short');
    }
    
    if (mutation.code.length > 100000) {
      errors.push('Code too long (potential DoS)');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Add custom invariant
   */
  addInvariant(name: string, check: (code: string) => boolean): void {
    this.invariants.push({ name, check });
  }
}

// Singleton instance
export const mutationSupervisor = new MutationSupervisor();

