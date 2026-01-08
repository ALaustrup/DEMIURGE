/**
 * Attention Router
 * 
 * Routes queries to optimal intelligence resources
 */

import { vectorStore } from '../neural/vectorStore';
import { runLLM } from '../spiritRuntime/llm';
import { spiritManager } from '../spirits/spiritManager';
import type { LLMMessage } from '../spiritRuntime/llm/llmTypes';

export interface QueryRoute {
  resource: 'vector' | 'llm' | 'spirit' | 'chain' | 'grid';
  confidence: number; // 0-1
  estimatedCost: number; // CGT
}

/**
 * Route query to optimal resource
 */
export async function routeQuery(query: string): Promise<QueryRoute[]> {
  const routes: QueryRoute[] = [];
  
  // Check vector store first (fastest, cheapest)
  const vectorResults = await vectorStore.search({
    query,
    limit: 1,
    threshold: 0.7,
  });
  
  if (vectorResults.length > 0) {
    routes.push({
      resource: 'vector',
      confidence: vectorResults[0].similarity,
      estimatedCost: 0.0001,
    });
  }
  
  // Check if query needs LLM reasoning
  const needsReasoning = query.length > 50 || query.includes('?') || query.includes('how') || query.includes('why');
  
  if (needsReasoning) {
    routes.push({
      resource: 'llm',
      confidence: 0.8,
      estimatedCost: 0.001,
    });
  }
  
  // Check if query matches spirit capabilities
  const spirits = spiritManager.getAllSpirits();
  for (const spirit of spirits) {
    if (spirit.personality.goals.some(goal => query.toLowerCase().includes(goal.toLowerCase()))) {
      routes.push({
        resource: 'spirit',
        confidence: 0.7,
        estimatedCost: 0.0005,
      });
      break;
    }
  }
  
  // Sort by confidence (descending)
  routes.sort((a, b) => b.confidence - a.confidence);
  
  return routes;
}

/**
 * Execute query using optimal route
 */
export async function executeQuery(query: string): Promise<string> {
  const routes = await routeQuery(query);
  
  if (routes.length === 0) {
    return 'No suitable resource found for query.';
  }
  
  const bestRoute = routes[0];
  
  switch (bestRoute.resource) {
    case 'vector':
      const results = await vectorStore.search({ query, limit: 1 });
      return results[0]?.vector.content || 'No relevant information found.';
      
    case 'llm':
      const llmResponse = await runLLM({
        messages: [{ role: 'user', content: query }],
      });
      return llmResponse.content;
      
    case 'spirit':
      return 'Spirit processing... (not yet implemented)';
      
    default:
      return 'Query routing not implemented for this resource.';
  }
}

