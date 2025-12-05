/**
 * World Rules Engine
 * 
 * Declarative rule system for world behavior
 */

import type { Rule, WorldState } from '../types';

export class RulesEngine {
  private rules: Rule[] = [];
  
  /**
   * Add rule
   */
  addRule(rule: Rule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Remove rule
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }
  
  /**
   * Update rules
   */
  updateRules(rules: Rule[]): void {
    this.rules = [...rules].sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Evaluate rules for world state
   */
  evaluate(state: WorldState, delta: number): void {
    for (const rule of this.rules) {
      if (!rule.enabled) continue;
      
      try {
        if (this.evaluateCondition(rule.condition, state, delta)) {
          this.executeAction(rule.action, state, delta);
        }
      } catch (error) {
        console.error(`[RulesEngine] Error evaluating rule ${rule.id}:`, error);
      }
    }
  }
  
  /**
   * Evaluate condition
   */
  private evaluateCondition(condition: string, state: WorldState, delta: number): boolean {
    // Simple expression evaluator
    // In production, use a proper expression parser
    
    try {
      // Replace variables
      const expr = condition
        .replace(/\$tick/g, state.tick.toString())
        .replace(/\$entityCount/g, state.entities.size.toString())
        .replace(/\$speciesCount/g, state.species.size.toString())
        .replace(/\$delta/g, delta.toString());
      
      // Evaluate (simplified - in production use safe evaluator)
      return new Function(`return ${expr}`)();
    } catch {
      return false;
    }
  }
  
  /**
   * Execute action
   */
  private executeAction(action: string, state: WorldState, delta: number): void {
    // Simple action executor
    // In production, use a proper action system
    
    try {
      // Replace variables
      const expr = action
        .replace(/\$tick/g, state.tick.toString())
        .replace(/\$entityCount/g, state.entities.size.toString())
        .replace(/\$delta/g, delta.toString());
      
      // Execute (simplified - in production use safe executor)
      new Function('state', 'delta', expr)(state, delta);
    } catch (error) {
      console.error(`[RulesEngine] Error executing action:`, error);
    }
  }
  
  /**
   * Get all rules
   */
  getRules(): Rule[] {
    return [...this.rules];
  }
  
  /**
   * Get rule by ID
   */
  getRule(ruleId: string): Rule | undefined {
    return this.rules.find(r => r.id === ruleId);
  }
}

