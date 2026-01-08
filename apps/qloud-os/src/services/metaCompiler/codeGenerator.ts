/**
 * Code Generator
 * 
 * Generates TS/WASM/Rust modules from specifications
 */

import { runLLM } from '../spiritRuntime/llm';
import type { LLMMessage } from '../spiritRuntime/llm/llmTypes';

export interface GeneratedModule {
  id: string;
  language: 'typescript' | 'wasm' | 'rust';
  code: string;
  tests: string[];
  metadata: {
    functions: string[];
    dependencies: string[];
    complexity: number;
  };
}

/**
 * Generate TypeScript module
 */
export async function generateTypeScript(spec: string): Promise<GeneratedModule> {
  const prompt = `Generate a TypeScript module based on this specification:

${spec}

Requirements:
- Use TypeScript with proper types
- Include error handling
- Add JSDoc comments
- Export all public functions
- Follow best practices`;

  const response = await runLLM({
    messages: [
      { role: 'system', content: 'You are a TypeScript code generator. Generate clean, typed, well-documented code.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3, // Lower temperature for more deterministic code
  });

  // Extract code from response (in production, parse structured output)
  const code = response.content;
  
  // Extract function names (simple regex, in production use AST parser)
  const functionMatches = code.match(/export\s+(?:async\s+)?function\s+(\w+)/g) || [];
  const functions = functionMatches.map(m => m.replace(/export\s+(?:async\s+)?function\s+/, ''));
  
  // Extract dependencies (simple regex)
  const importMatches = code.match(/import\s+.*?\s+from\s+['"](.+?)['"]/g) || [];
  const dependencies = importMatches.map(m => {
    const match = m.match(/['"](.+?)['"]/);
    return match ? match[1] : '';
  }).filter(Boolean);

  return {
    id: `module:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
    language: 'typescript',
    code,
    tests: [], // Will be generated separately
    metadata: {
      functions,
      dependencies,
      complexity: code.length / 1000, // Simple complexity metric
    },
  };
}

/**
 * Generate WASM module (placeholder - would compile from Rust/TypeScript)
 */
export async function generateWASM(spec: string): Promise<GeneratedModule> {
  // In production, generate Rust code and compile to WASM
  // For now, return placeholder
  return {
    id: `wasm:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
    language: 'wasm',
    code: ';; WASM module placeholder\n',
    tests: [],
    metadata: {
      functions: [],
      dependencies: [],
      complexity: 50,
    },
  };
}

/**
 * Generate module based on spec
 */
export async function generateModule(spec: string, language: 'typescript' | 'wasm' = 'typescript'): Promise<GeneratedModule> {
  switch (language) {
    case 'typescript':
      return generateTypeScript(spec);
    case 'wasm':
      return generateWASM(spec);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

