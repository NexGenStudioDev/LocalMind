// src/api/ai/core/AIProvider.ts

import { AICapability } from './types'

export interface AIProvider {
  readonly name: string
  readonly capabilities: ReadonlySet<AICapability>

  generateText(input: {
    prompt: string
    context?: string
  }): Promise<string>

  supports(capability: AICapability): boolean
}
