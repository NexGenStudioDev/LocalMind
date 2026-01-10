// src/api/ai/providers/GeminiProvider.ts

import { AIProvider } from '../core/AIProvider'
import { AICapability } from '../core/types'

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini'

  readonly capabilities = new Set<AICapability>([
    'cloud',
    'multimodal',
  ])

  supports(capability: AICapability): boolean {
    return this.capabilities.has(capability)
  }

  async generateText(input: {
    prompt: string
    context?: string
  }): Promise<string> {
    // TEMP mock response (safe, non-breaking)
    return `[Gemini] ${input.prompt}`
  }
}
