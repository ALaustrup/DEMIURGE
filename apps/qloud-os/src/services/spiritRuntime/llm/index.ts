/**
 * LLM Service
 * 
 * Unified interface for local, grid, and remote LLM inference
 */

import { runGGUF, isGGUFAvailable } from './ggufRunner';
import { runMeshInference, isMeshAvailable } from './meshRunner';
import type { LLMRequest, LLMResponse } from './llmTypes';

/**
 * Run LLM inference with automatic fallback
 */
export async function runLLM(request: LLMRequest): Promise<LLMResponse> {
  // Try local GGUF first
  if (isGGUFAvailable() && !request.useGrid) {
    try {
      return await runGGUF(request);
    } catch (error) {
      console.warn('[LLM] Local inference failed, falling back to grid');
    }
  }
  
  // Try grid-assisted inference
  if (request.useGrid && isMeshAvailable()) {
    try {
      return await runMeshInference(request);
    } catch (error) {
      console.warn('[LLM] Grid inference failed, falling back to remote');
    }
  }
  
  // Fallback to remote LLM (mock)
  return await runRemoteLLM(request);
}

/**
 * Run remote LLM (fallback)
 */
async function runRemoteLLM(request: LLMRequest): Promise<LLMResponse> {
  const startTime = Date.now();
  
  // In production, call actual LLM API
  const lastMessage = request.messages[request.messages.length - 1];
  const mockResponse = `[Remote LLM] Processed: "${lastMessage.content.slice(0, 50)}..."`;
  
  return {
    content: mockResponse,
    tokens: mockResponse.split(/\s+/).length,
    model: 'remote:api',
    executionTime: Date.now() - startTime,
  };
}

