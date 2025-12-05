/**
 * LLM Types
 * 
 * Types for embedded language models
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  useGrid?: boolean; // Use grid-assisted inference
  deterministic?: boolean; // For verifiable tasks
}

export interface LLMResponse {
  content: string;
  tokens: number;
  model: string;
  executionTime: number;
  peerId?: string; // If executed on grid
}

export interface LLMModel {
  id: string;
  name: string;
  size: number; // Model size in bytes
  contextLength: number;
  supportsGrid: boolean;
}

