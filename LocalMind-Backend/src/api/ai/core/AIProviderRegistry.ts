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
  // Safe execution with proper fallback
  // --------------------

  async generateTextWithFallback(
    capabilities: AICapability[],
    input: { prompt: string; context?: string }
  ): Promise<string> {
    const candidates = this.findByCapabilities(capabilities)
    const healthyProviders = candidates.filter(p => this.isHealthy(p.name))
    const degradedProviders = candidates.filter(p => !this.isHealthy(p.name))
    let lastError: unknown

    // 1️⃣ Try all healthy providers first
    for (const provider of healthyProviders) {
      try {
        const result = await provider.generateText(input)
        this.markSuccess(provider.name)
        return result
      } catch (err) {
        lastError = err
        this.markFailure(provider.name)
      }
    }

    // 2️⃣ Fall back to degraded providers if all healthy ones failed
    for (const provider of degradedProviders) {
      try {
        const result = await provider.generateText(input)
        this.markSuccess(provider.name)
        return result
      } catch (err) {
        lastError = err
        this.markFailure(provider.name)
      }
    }

    // 3️⃣ Throw the last error encountered (preserves stack trace and error details)
    if (lastError) {
      throw lastError
    }

    // 4️⃣ If no providers matched capabilities at all
    throw new Error('No AI provider available for the specified capabilities')
  }
}

export const aiProviderRegistry = new AIProviderRegistry()

// Register providers
aiProviderRegistry.register(new GeminiProvider())