// src/api/ai/core/AIModelRegistry.ts

import { AICapability } from './types'

export type AIModel = {
  id: string
  provider: string
  capabilities: AICapability[]
}

class AIModelRegistry {
  private models: AIModel[] = []

  // --------------------
  // Model management
  // --------------------

  register(model: AIModel) {
    if (this.models.some(m => m.id === model.id && m.provider === model.provider)) {
      throw new Error(
        `Model "${model.id}" from provider "${model.provider}" is already registered.`
      )
    }
    this.models.push(model)
  }

  listProviders(): string[] {
    return [...new Set(this.models.map(m => m.provider))]
  }

  listModelsByProvider(provider: string): AIModel[] {
    return this.models.filter(m => m.provider === provider)
  }

  getModel(provider: string, modelId: string): AIModel | undefined {
    return this.models.find(
      m => m.provider === provider && m.id === modelId
    )
  }

  listAll(): AIModel[] {
    return [...this.models]
  }
}

export const aiModelRegistry = new AIModelRegistry()

// Register default models
aiModelRegistry.register({
  id: 'gemini-pro',
  provider: 'gemini',
  capabilities: ['cloud'],
})

aiModelRegistry.register({
  id: 'gemini-pro-vision',
  provider: 'gemini',
  capabilities: ['cloud', 'multimodal'],
})