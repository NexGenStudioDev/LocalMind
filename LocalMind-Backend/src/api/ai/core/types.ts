// src/api/ai/core/types.ts

export type AICapability =
  | 'local'
  | 'cloud'
  | 'rag_supported'
  | 'fast_inference'
  | 'multimodal'

export interface AIRequestIntent {
  task: 'chat' | 'completion' | 'embedding'
  requires?: AICapability[]
  preferredProvider?: string
}
