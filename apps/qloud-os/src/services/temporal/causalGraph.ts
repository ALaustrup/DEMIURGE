/**
 * Causal Graph
 * 
 * DAG linking events across time slices
 */

import type { CausalLink, TemporalEvent } from './temporalTypes';

class CausalGraph {
  private links: Map<string, CausalLink> = new Map();
  private eventMap: Map<string, TemporalEvent> = new Map();
  
  /**
   * Add event
   */
  addEvent(event: TemporalEvent): void {
    this.eventMap.set(event.id, event);
  }
  
  /**
   * Add causal link
   */
  addLink(from: string, to: string, strength: number = 0.5): void {
    const linkId = `${from}->${to}`;
    const link: CausalLink = {
      from,
      to,
      strength,
      timestamp: Date.now(),
    };
    
    this.links.set(linkId, link);
    
    // Update event references
    const fromEvent = this.eventMap.get(from);
    const toEvent = this.eventMap.get(to);
    
    if (fromEvent && !fromEvent.effects.includes(to)) {
      fromEvent.effects.push(to);
    }
    
    if (toEvent && !toEvent.causes.includes(from)) {
      toEvent.causes.push(from);
    }
  }
  
  /**
   * Get causes of event
   */
  getCauses(eventId: string): TemporalEvent[] {
    const event = this.eventMap.get(eventId);
    if (!event) return [];
    
    return event.causes
      .map(id => this.eventMap.get(id))
      .filter((e): e is TemporalEvent => e !== undefined);
  }
  
  /**
   * Get effects of event
   */
  getEffects(eventId: string): TemporalEvent[] {
    const event = this.eventMap.get(eventId);
    if (!event) return [];
    
    return event.effects
      .map(id => this.eventMap.get(id))
      .filter((e): e is TemporalEvent => e !== undefined);
  }
  
  /**
   * Find causal path between events
   */
  findCausalPath(fromId: string, toId: string): TemporalEvent[] {
    const path: TemporalEvent[] = [];
    const visited = new Set<string>();
    
    const dfs = (currentId: string): boolean => {
      if (currentId === toId) {
        return true;
      }
      
      if (visited.has(currentId)) {
        return false;
      }
      
      visited.add(currentId);
      const event = this.eventMap.get(currentId);
      if (!event) return false;
      
      for (const effectId of event.effects) {
        if (dfs(effectId)) {
          path.unshift(this.eventMap.get(effectId)!);
          return true;
        }
      }
      
      return false;
    };
    
    if (dfs(fromId)) {
      path.unshift(this.eventMap.get(fromId)!);
    }
    
    return path;
  }
  
  /**
   * Get all links
   */
  getAllLinks(): CausalLink[] {
    return Array.from(this.links.values());
  }
}

// Singleton instance
export const causalGraph = new CausalGraph();

