/**
 * Spirit Coordinator
 * 
 * Multi-agent orchestration for Abyss Spirits
 */

import { spiritManager } from '../spirits/spiritManager';
import type { AbyssSpirit, SpiritTask } from '../spirits/spiritTypes';

class SpiritCoordinator {
  /**
   * Coordinate multiple spirits for a task
   */
  async coordinateTask(description: string, requiredCapabilities: string[]): Promise<string[]> {
    const spirits = spiritManager.getAllSpirits().filter(s => s.status === 'active');
    
    // Find spirits with matching capabilities
    const suitableSpirits = spirits.filter(spirit => {
      return requiredCapabilities.some(cap =>
        spirit.personality.traits.includes(cap) ||
        spirit.personality.goals.some(goal => goal.toLowerCase().includes(cap.toLowerCase()))
      );
    });
    
    if (suitableSpirits.length === 0) {
      return [];
    }
    
    // Assign task to suitable spirits
    const taskIds: string[] = [];
    for (const spirit of suitableSpirits) {
      const task = await spiritManager.addTask(spirit.id, {
        type: 'custom',
        description,
      });
      taskIds.push(task.id);
    }
    
    return taskIds;
  }
  
  /**
   * Get coordination status
   */
  getCoordinationStatus(): {
    activeSpirits: number;
    runningTasks: number;
    availableCapabilities: string[];
  } {
    const spirits = spiritManager.getAllSpirits().filter(s => s.status === 'active');
    const runningTasks = spirits.reduce((sum, s) => 
      sum + s.tasks.filter(t => t.status === 'running').length, 0
    );
    
    const capabilities = new Set<string>();
    spirits.forEach(s => {
      s.personality.traits.forEach(t => capabilities.add(t));
      s.personality.goals.forEach(g => capabilities.add(g));
    });
    
    return {
      activeSpirits: spirits.length,
      runningTasks,
      availableCapabilities: Array.from(capabilities),
    };
  }
}

// Singleton instance
export const spiritCoordinator = new SpiritCoordinator();

