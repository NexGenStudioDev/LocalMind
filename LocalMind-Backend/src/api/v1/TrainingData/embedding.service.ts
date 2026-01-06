import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../../../constant/env.constant'

class EmbeddingService {
    private genAI: GoogleGenerativeAI
    private embeddingModel: string = 'text-embedding-004'

    constructor() {
        this.genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY || '')
    }

    /**
     * Generate embedding for a single text
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const model = this.genAI.getGenerativeModel({ model: this.embeddingModel })
            const result = await model.embedContent(text)
            return result.embedding.values
        } catch (error: any) {
            console.error('Error generating embedding:', error.message)
            throw new Error(`Failed to generate embedding: ${error.message}`)
        }
    }

    /**
     * Generate embeddings for multiple texts (batch processing)
     */
    async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
        try {
            const embeddings: number[][] = []

            // Process in batches to avoid rate limiting
            const batchSize = 10
            for (let i = 0; i < texts.length; i += batchSize) {
                const batch = texts.slice(i, i + batchSize)
                const batchPromises = batch.map(text => this.generateEmbedding(text))
                const batchResults = await Promise.all(batchPromises)
                embeddings.push(...batchResults)

                // Small delay between batches to avoid rate limiting
                if (i + batchSize < texts.length) {
                    await new Promise(resolve => setTimeout(resolve, 100))
                }
            }

            return embeddings
        } catch (error: any) {
            console.error('Error generating batch embeddings:', error.message)
            throw new Error(`Failed to generate batch embeddings: ${error.message}`)
        }
    }

    /**
     * Calculate cosine similarity between two embeddings
     */
    cosineSimilarity(embedding1: number[], embedding2: number[]): number {
        if (embedding1.length !== embedding2.length) {
            throw new Error('Embeddings must have the same dimension')
        }

        let dotProduct = 0
        let norm1 = 0
        let norm2 = 0

        for (let i = 0; i < embedding1.length; i++) {
            dotProduct += embedding1[i] * embedding2[i]
            norm1 += embedding1[i] * embedding1[i]
            norm2 += embedding2[i] * embedding2[i]
        }

        const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2)
        return magnitude === 0 ? 0 : dotProduct / magnitude
    }

    /**
     * Find top-K similar embeddings from a list
     */
    findTopKSimilar(
        queryEmbedding: number[],
        embeddings: { id: string; embedding: number[] }[],
        topK: number = 5
    ): { id: string; similarity: number }[] {
        const similarities = embeddings.map(item => ({
            id: item.id,
            similarity: this.cosineSimilarity(queryEmbedding, item.embedding)
        }))

        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK)
    }
}

export default new EmbeddingService()
