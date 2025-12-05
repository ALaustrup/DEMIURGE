/**
 * Grid Reasoner
 * 
 * Distributed reasoning across grid
 */

import { peerDiscovery } from '../grid/discovery';
import { runLLM } from '../spiritRuntime/llm';
import type { LLMMessage } from '../spiritRuntime/llm/llmTypes';

/**
 * Reason about query using grid resources
 */
export async function reasonOnGrid(query: string, context: string[] = []): Promise<string> {
  const peers = peerDiscovery.getPeers();
  
  if (peers.length === 0) {
    // Fallback to local reasoning
    return await reasonLocally(query, context);
  }
  
  // Use grid-assisted inference
  const messages: LLMMessage[] = [
    { role: 'system', content: 'You are a distributed reasoning system. Use the provided context to answer the query.' },
    ...context.map(c => ({ role: 'user', content: c } as LLMMessage)),
    { role: 'user', content: query },
  ];
  
  const response = await runLLM({
    messages,
    useGrid: true,
  });
  
  return response.content;
}

/**
 * Reason locally
 */
async function reasonLocally(query: string, context: string[]): Promise<string> {
  const messages: LLMMessage[] = [
    { role: 'system', content: 'You are a reasoning system. Use the provided context to answer the query.' },
    ...context.map(c => ({ role: 'user', content: c } as LLMMessage)),
    { role: 'user', content: query },
  ];
  
  const response = await runLLM({
    messages,
    useGrid: false,
  });
  
  return response.content;
}

