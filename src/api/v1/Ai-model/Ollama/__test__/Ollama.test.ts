import { describe, it, expect, jest } from '@jest/globals'
import OllamaService from '../Ollama.service'
import OllamaUtils from '../Ollama.utils'

describe('OllamaService Test', () => {
  jest.setTimeout(30000)

  it('is koill/sentence-transformers:paraphrase-multilingual-minilm-l12-v2 installed', async () => {
    const modelName: string = 'koill/sentence-transformers:paraphrase-multilingual-minilm-l12-v2'

    const isAvailable = await OllamaUtils.isModelAvailable(modelName)
    expect(isAvailable).toBeDefined()
    expect(isAvailable).not.toBeNull()
    expect(isAvailable).not.toBeUndefined()
    expect(isAvailable).toBe(true)
  })

  it('should return a vector for valid input', async () => {
    const input = 'Hello, world!'
    const vector = await OllamaService.getVector(input)
    expect(vector).toBeDefined()
    expect(Array.isArray(vector)).toBe(true)
    expect(vector?.length).toBeGreaterThan(0)
  })
})
