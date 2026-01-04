import OllamaService from '../Ai-model/Ollama/Ollama.service'

export class EmbeddingUtils {
  /**
   * Generates an embedding vector for the given text.
   * Currently uses Ollama as the default provider.
   */
  public static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const vector = await OllamaService.getVector([text])
      if (!vector) {
        throw new Error('Failed to generate embedding vector.')
      }
      return vector
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Embedding generation failed'
      console.error('Embedding Error:', error)
      throw new Error(errorMessage)
    }
  }
}
