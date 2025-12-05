/**
 * Spirit Memory System
 * 
 * Manages persistent memory for Abyss Spirits using DVFS + embeddings
 */

import { dvfs } from '../vfs/dvfs';
import type { SpiritMemory } from './spiritTypes';

class SpiritMemoryManager {
  /**
   * Save memory for a spirit
   */
  async saveMemory(spiritId: string, memory: SpiritMemory): Promise<void> {
    const data = JSON.stringify(memory);
    await dvfs.write('spirits', spiritId, `memory/${memory.id}.json`, data);
  }
  
  /**
   * Load all memories for a spirit
   */
  async loadMemories(spiritId: string): Promise<SpiritMemory[]> {
    try {
      const files = await dvfs.list('spirits', spiritId);
      const memoryFiles = files.filter(f => f.path?.includes('/memory/'));
      
      const memories: SpiritMemory[] = [];
      for (const file of memoryFiles) {
        if (file.type === 'file' && file.data) {
          const content = typeof file.data === 'string' ? file.data : new TextDecoder().decode(file.data);
          memories.push(JSON.parse(content));
        }
      }
      
      return memories.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to load memories:', error);
      return [];
    }
  }
  
  /**
   * Search memories by semantic similarity (simplified)
   */
  async searchMemories(spiritId: string, query: string, limit: number = 10): Promise<SpiritMemory[]> {
    const memories = await this.loadMemories(spiritId);
    
    // Simple keyword matching (in production, use embeddings)
    const queryLower = query.toLowerCase();
    const matches = memories
      .filter(m => 
        m.content.toLowerCase().includes(queryLower) ||
        m.tags.some(tag => tag.toLowerCase().includes(queryLower))
      )
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
    
    return matches;
  }
  
  /**
   * Add memory
   */
  async addMemory(
    spiritId: string,
    content: string,
    tags: string[] = [],
    importance: number = 0.5
  ): Promise<SpiritMemory> {
    const memory: SpiritMemory = {
      id: `mem:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      content,
      tags,
      importance,
    };
    
    await this.saveMemory(spiritId, memory);
    return memory;
  }
  
  /**
   * Delete memory
   */
  async deleteMemory(spiritId: string, memoryId: string): Promise<void> {
    await dvfs.delete('spirits', spiritId, `memory/${memoryId}.json`);
  }
}

export const spiritMemory = new SpiritMemoryManager();

