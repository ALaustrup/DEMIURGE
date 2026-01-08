/**
 * Abyss Spirit Types
 * 
 * Types for resident AI agents
 */

export interface SpiritPersonality {
  name: string;
  description: string;
  traits: string[];
  goals: string[];
  constraints: string[];
  temperature?: number; // 0-1, controls randomness
  maxTokens?: number;
}

export interface SpiritMemory {
  id: string;
  timestamp: number;
  content: string;
  embedding?: number[]; // Vector embedding for semantic search
  tags: string[];
  importance: number; // 0-1
}

export interface SpiritTask {
  id: string;
  type: 'index' | 'monitor' | 'analyze' | 'respond' | 'custom';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  createdAt: number;
  completedAt?: number;
}

export interface AbyssSpirit {
  id: string;
  name: string;
  personality: SpiritPersonality;
  memory: SpiritMemory[];
  tasks: SpiritTask[];
  status: 'active' | 'sleeping' | 'stopped';
  createdAt: number;
  lastActive: number;
  permissions: string[];
}

