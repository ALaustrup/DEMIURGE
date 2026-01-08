/**
 * Test Synthesizer
 * 
 * Automatically generates test suites
 */

import { runLLM } from '../spiritRuntime/llm';
import type { GeneratedModule } from './codeGenerator';

/**
 * Generate tests for module
 */
export async function generateTests(module: GeneratedModule): Promise<string[]> {
  if (module.language !== 'typescript') {
    return []; // Only generate tests for TypeScript for now
  }
  
  const prompt = `Generate comprehensive unit tests for this TypeScript module:

\`\`\`typescript
${module.code}
\`\`\`

Requirements:
- Test all exported functions
- Include edge cases
- Test error handling
- Use Jest/Vitest syntax
- Aim for high coverage`;

  const response = await runLLM({
    messages: [
      { role: 'system', content: 'You are a test generator. Generate comprehensive, well-structured unit tests.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2, // Very low temperature for deterministic tests
  });

  // Extract test code (in production, parse structured output)
  const testCode = response.content;
  
  // Split into individual test cases (simple heuristic)
  const tests = testCode.split(/(?:it\(|test\()/).filter(t => t.trim().length > 0);
  
  return tests.map((t, i) => `test${i > 0 ? t : ''}`);
}

/**
 * Validate tests
 */
export function validateTests(tests: string[], module: GeneratedModule): { valid: boolean; coverage: number } {
  // Simple validation: check if tests reference module functions
  const moduleFunctions = module.metadata.functions;
  let coveredFunctions = 0;
  
  for (const func of moduleFunctions) {
    if (tests.some(test => test.includes(func))) {
      coveredFunctions++;
    }
  }
  
  const coverage = moduleFunctions.length > 0
    ? (coveredFunctions / moduleFunctions.length) * 100
    : 0;
  
  return {
    valid: coverage >= 50, // At least 50% coverage
    coverage,
  };
}

