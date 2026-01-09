import { GoogleGenerativeAI } from '@google/generative-ai'
import { IEmbeddingResponse } from './TrainingSample.types'

class EmbeddingUtils {
  private genAI: GoogleGenerativeAI
  private embeddingModel = 'models/embedding-001'

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is required for embeddings')
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  async generateEmbedding(text: string): Promise<IEmbeddingResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.embeddingModel })

      const result = await model.embedContent(text)
      const embedding = result.embedding

      if (!embedding || !embedding.values) {
        throw new Error('Failed to generate embedding - no embedding values returned')
      }

      return {
        embedding: embedding.values,
        modelUsed: this.embeddingModel,
      }
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw new Error(`Failed to generate embedding: ${(error as Error).message}`)
    }
  }

  async generateEmbeddingBatch(texts: string[]): Promise<IEmbeddingResponse[]> {
    const results = await Promise.all(texts.map(text => this.generateEmbedding(text)))
    return results
  }

  // Calculate cosine similarity between two vectors
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length')
    }

    let dotProduct = 0
    let magnitudeA = 0
    let magnitudeB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      magnitudeA += a[i] * a[i]
      magnitudeB += b[i] * b[i]
    }

    magnitudeA = Math.sqrt(magnitudeA)
    magnitudeB = Math.sqrt(magnitudeB)

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0
    }

    return dotProduct / (magnitudeA * magnitudeB)
  }
}

export default new EmbeddingUtils()
