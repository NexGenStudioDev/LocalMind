// src/api/ai/core/AIProviderRegistry.ts

import { AIProvider } from './AIProvider'
import { AICapability } from './types'
import { GeminiProvider } from '../providers/GeminiProvider'

class AIProviderRegistry {
  private providers = new Map<string, AIProvider>()

  register(provider: AIProvider) {
    if (this.providers.has(provider.name)) {
      throw new Error(
        `A provider with the name "${provider.name}" is already registered.`
      )
    }
    this.providers.set(provider.name, provider)
  }

  get(name: string): AIProvider | undefined {
    return this.providers.get(name)
  }

  findByCapabilities(capabilities: AICapability[]): AIProvider[] {
    return Array.from(this.providers.values()).filter(provider =>
      capabilities.every(cap => provider.supports(cap))
    )
  }

  list(): AIProvider[] {
    return Array.from(this.providers.values())
  }
}

export const aiProviderRegistry = new AIProviderRegistry()

// register providers (safe, non-breaking)
aiProviderRegistry.register(new GeminiProvider())
