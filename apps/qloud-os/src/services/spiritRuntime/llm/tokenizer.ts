/**
 * Tokenizer
 * 
 * Simple tokenization for chat formatting
 */

import type { LLMMessage } from './llmTypes';

/**
 * Simple tokenizer (in production, use actual tokenizer)
 */
export function tokenize(text: string): string[] {
  // Simple word-based tokenization
  return text.split(/\s+/).filter(t => t.length > 0);
}

/**
 * Count tokens (approximate)
 */
export function countTokens(text: string): number {
  return tokenize(text).length;
}

/**
 * Format messages for chat
 */
export function formatMessages(messages: LLMMessage[]): string {
  return messages.map(msg => {
    const role = msg.role === 'system' ? 'System' : msg.role === 'user' ? 'User' : 'Assistant';
    return `${role}: ${msg.content}`;
  }).join('\n\n');
}

/**
 * Truncate to max tokens
 */
export function truncateToTokens(text: string, maxTokens: number): string {
  const tokens = tokenize(text);
  if (tokens.length <= maxTokens) return text;
  return tokens.slice(0, maxTokens).join(' ');
}

