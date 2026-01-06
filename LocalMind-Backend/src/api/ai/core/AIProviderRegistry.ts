// src/api/ai/core/AIProviderRegistry.ts

import { AIProvider } from './AIProvider'
import { AICapability } from './types'
import { GeminiProvider } from '../providers/GeminiProvider'

type ProviderHealth = {
  failures: number
  lastFailureAt?: number
}

const MAX_FAILURES = 3

class AIProviderRegistry {
  private providers = new Map<string, AIProvider>()
  private health = new Map<string, ProviderHealth>()

  register(provider: AIProvider) {
    if (this.providers.has(provider.name)) {
      throw new Error(
        `A provider with the name "${provider.name}" is already registered.`
      )
    }

    this.providers.set(provider.name, provider)
    this.health.set(provider.name, { failures: 0 })
  }

  get(name: string): AIProvider | undefined {
    return this.providers.get(name)
  }

  list(): AIProvider[] {
    return Array.from(this.providers.values())
  }

  findByCapabilities(capabilities: AICapability[]): AIProvider[] {
    return Array.from(this.providers.values()).filter(provider =>
      capabilities.every(cap => provider.supports(cap))
    )
  }

  // --------------------
  // Health tracking
  // --------------------

  private isHealthy(providerName: string): boolean {
    const info = this.health.get(providerName)
    if (!info) return true
    return info.failures < MAX_FAILURES
  }

  markFailure(providerName: string) {
    const info = this.health.get(providerName)
    if (!info) return

    info.failures += 1
    info.lastFailureAt = Date.now()
  }

  markSuccess(providerName: string) {
    const info = this.health.get(providerName)
    if (!info) return

    info.failures = 0
  }

  // --------------------
  // Safe execution
  // --------------------

  async generateTextSafe(
    providerName: string,
    input: { prompt: string; context?: string }
  ): Promise<string> {
    const provider = this.providers.get(providerName)
    if (!provider) {
      throw new Error(`Provider "${providerName}" not found`)
    }

    try {
      const result = await provider.generateText(input)
      this.markSuccess(provider.name)
      return result
    } catch (err) {
      this.markFailure(provider.name)
      throw err
    }
  }

  // --------------------
  // 🆕 Fallback routing
  // --------------------

  async generateTextWithFallback(
    capabilities: AICapability[],
    input: { prompt: string; context?: string }
  ): Promise<string> {
    const candidates = this.findByCapabilities(capabilities)

    for (const provider of candidates) {
      if (!this.isHealthy(provider.name)) continue

      try {
        const result = await provider.generateText(input)
        this.markSuccess(provider.name)
        return result
      } catch {
        this.markFailure(provider.name)
      }
    }

    throw new Error('No healthy AI provider available')
  }
}

export const aiProviderRegistry = new AIProviderRegistry()

// register providers (safe)
aiProviderRegistry.register(new GeminiProvider())
