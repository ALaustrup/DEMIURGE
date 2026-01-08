/**
 * Mesh Runner
 * 
 * Grid-assisted inference for larger contexts
 */

import { peerDiscovery } from '../../grid/discovery';
import type { LLMRequest, LLMResponse } from './llmTypes';

/**
 * Run inference on grid
 * 
 * Distributes inference across multiple peers for larger contexts
 */
export async function runMeshInference(request: LLMRequest): Promise<LLMResponse> {
  const peers = peerDiscovery.getPeers();
  if (peers.length === 0) {
    throw new Error('No peers available for mesh inference');
  }
  
  // Select best peer (highest compute score)
  const bestPeer = peers.sort((a, b) => b.computeScore - a.computeScore)[0];
  
  const startTime = Date.now();
  
  // In production, send inference request via grid protocol
  // For now, simulate
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lastMessage = request.messages[request.messages.length - 1];
  const mockResponse = `[Grid LLM] Processed on ${bestPeer.peerId}: "${lastMessage.content.slice(0, 50)}..."`;
  
  return {
    content: mockResponse,
    tokens: mockResponse.split(/\s+/).length,
    model: 'mesh:grid',
    executionTime: Date.now() - startTime,
    peerId: bestPeer.peerId,
  };
}

/**
 * Check if mesh inference is available
 */
export function isMeshAvailable(): boolean {
  return peerDiscovery.getPeers().length > 0;
}

