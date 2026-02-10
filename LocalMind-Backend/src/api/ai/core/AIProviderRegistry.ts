// src/api/ai/core/AIProviderRegistry.ts

import { AIProvider } from './AIProvider'
import { AICapability } from './types'

type ProviderHealth = {
  failures: number
  lastFailureAt?: number
}

const MAX_FAILURES = 3
const COOLDOWN_PERIOD_MS = 300000 // 5 minutes

class AIProviderRegistry {
  private providers = new Map<string, AIProvider>()
  private health = new Map<string, ProviderHealth>()

  // --------------------
  // Provider management
  // --------------------

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
  // Health tracking with cooldown recovery
  // --------------------

  private isHealthy(providerName: string): boolean {
    const info = this.health.get(providerName)
    if (!info) return true

    if (info.failures < MAX_FAILURES) {
      return true
    }

    // Allow retry after cooldown period
    if (info.lastFailureAt && Date.now() - info.lastFailureAt > COOLDOWN_PERIOD_MS) {
      this.markSuccess(providerName) // Reset health to allow retry
      return true
    }

    return false
  }

  private markFailure(providerName: string) {
    const info = this.health.get(providerName)
    if (!info) return

    info.failures += 1
    info.lastFailureAt = Date.now()
  }

  private markSuccess(providerName: string) {
    const info = this.health.get(providerName)
    if (!info) return

    info.failures = 0
  }

  // --------------------
  // Provider + Model routing
  // --------------------

  async generateTextWithModel(
    providerName: string,
    modelId: string,
    input: { prompt: string }
  ): Promise<string> {
    const provider = this.get(providerName)

    if (!provider) {
      throw new Error(`Provider "${providerName}" not found`)
    }

    if (!this.isHealthy(provider.name)) {
      throw new Error(`Provider "${providerName}" is currently degraded`)
    }

    try {
      const result = await provider.generateText({
        ...input,
        context: modelId,
      })
      this.markSuccess(provider.name)
      return result
    } catch (err) {
      this.markFailure(provider.name)
      throw err
    }
  }
}

export const aiProviderRegistry = new AIProviderRegistry()