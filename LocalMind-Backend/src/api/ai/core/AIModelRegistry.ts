// src/api/ai/core/AIModelRegistry.ts

import { AICapability } from './types'

export type AIModel = {
  id: string
  provider: string
  capabilities: AICapability[]
}

class AIModelRegistry {
  private models: AIModel[] = [
    {
      id: 'gemini-pro',
      provider: 'gemini',
      capabilities: ['cloud'],
    },
    {
      id: 'gemini-pro-vision',
      provider: 'gemini',
      capabilities: ['cloud', 'multimodal'],
    },
  ]

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
}

export const aiModelRegistry = new AIModelRegistry()
