import { Types, FilterQuery } from 'mongoose'
import { TrainingSample, ITrainingSample } from './trainingSample.model'
import EmbeddingService from './embedding.service'

interface CreateSampleInput {
    question: string
    type?: 'qa' | 'snippet' | 'doc' | 'faq' | 'other'
    answerTemplate: {
        greeting?: string
        answer: string
        sections?: { title: string; content: string }[]
        suggestions?: string[]
    }
    codeSnippet?: string
    tags?: string[]
    language?: string
    sourceType?: 'manual' | 'dataset'
    datasetId?: string
    filePath?: string
    fileMimeType?: string
    fileSizeInBytes?: number
}

interface UpdateSampleInput extends Partial<CreateSampleInput> {
    isActive?: boolean
}

interface SearchFilters {
    type?: string
    tags?: string[]
    isActive?: boolean
    sourceType?: string
    language?: string
}

interface VectorSearchInput {
    query: string
    topK?: number
    filters?: SearchFilters
}

class TrainingSampleService {
    /**
     * Create a new training sample with auto-generated embedding
     */
    async create(input: CreateSampleInput): Promise<ITrainingSample> {
        try {
            // Generate embedding from question + answer
            const textForEmbedding = `${input.question} ${input.answerTemplate.answer}`
            const embedding = await EmbeddingService.generateEmbedding(textForEmbedding)

            const sample = new TrainingSample({
                ...input,
                embedding,
                datasetId: input.datasetId ? new Types.ObjectId(input.datasetId) : undefined
            })

            return await sample.save()
        } catch (error: any) {
            console.error('Error creating training sample:', error.message)
            throw new Error(`Failed to create training sample: ${error.message}`)
        }
    }

    /**
     * Create multiple training samples (for dataset processing)
     */
    async createBulk(inputs: CreateSampleInput[]): Promise<ITrainingSample[]> {
        try {
            const samples: ITrainingSample[] = []

            // Process in smaller batches to handle embedding generation
            const batchSize = 5
            for (let i = 0; i < inputs.length; i += batchSize) {
                const batch = inputs.slice(i, i + batchSize)
                const batchPromises = batch.map(input => this.create(input))
                const batchResults = await Promise.all(batchPromises)
                samples.push(...batchResults)
            }

            return samples
        } catch (error: any) {
            console.error('Error creating bulk training samples:', error.message)
            throw new Error(`Failed to create bulk training samples: ${error.message}`)
        }
    }

    /**
     * Get all training samples with optional filters
     */
    async getAll(filters: SearchFilters = {}): Promise<ITrainingSample[]> {
        try {
            const query: FilterQuery<ITrainingSample> = {}

            if (filters.type) query.type = filters.type
            if (filters.sourceType) query.sourceType = filters.sourceType
            if (filters.language) query.language = filters.language
            if (typeof filters.isActive === 'boolean') query.isActive = filters.isActive
            if (filters.tags && filters.tags.length > 0) {
                query.tags = { $in: filters.tags }
            }

            return await TrainingSample.find(query)
                .sort({ createdAt: -1 })
                .lean()
        } catch (error: any) {
            console.error('Error fetching training samples:', error.message)
            throw new Error(`Failed to fetch training samples: ${error.message}`)
        }
    }

    /**
     * Get a single training sample by ID
     */
    async getById(id: string): Promise<ITrainingSample | null> {
        try {
            return await TrainingSample.findById(id).lean()
        } catch (error: any) {
            console.error('Error fetching training sample:', error.message)
            throw new Error(`Failed to fetch training sample: ${error.message}`)
        }
    }

    /**
     * Update a training sample (re-generates embedding if content changes)
     */
    async update(id: string, input: UpdateSampleInput): Promise<ITrainingSample | null> {
        try {
            const existingSample = await TrainingSample.findById(id)
            if (!existingSample) return null

            // Check if content changed (needs new embedding)
            const contentChanged =
                (input.question && input.question !== existingSample.question) ||
                (input.answerTemplate?.answer && input.answerTemplate.answer !== existingSample.answerTemplate.answer)

            let embedding = existingSample.embedding

            if (contentChanged) {
                const question = input.question || existingSample.question
                const answer = input.answerTemplate?.answer || existingSample.answerTemplate.answer
                const textForEmbedding = `${question} ${answer}`
                embedding = await EmbeddingService.generateEmbedding(textForEmbedding)
            }

            const updateData = {
                ...input,
                embedding,
                datasetId: input.datasetId ? new Types.ObjectId(input.datasetId) : existingSample.datasetId
            }

            return await TrainingSample.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            ).lean()
        } catch (error: any) {
            console.error('Error updating training sample:', error.message)
            throw new Error(`Failed to update training sample: ${error.message}`)
        }
    }

    /**
     * Soft delete a training sample (sets isActive to false)
     */
    async softDelete(id: string): Promise<ITrainingSample | null> {
        try {
            return await TrainingSample.findByIdAndUpdate(
                id,
                { $set: { isActive: false } },
                { new: true }
            ).lean()
        } catch (error: any) {
            console.error('Error soft deleting training sample:', error.message)
            throw new Error(`Failed to soft delete training sample: ${error.message}`)
        }
    }

    /**
     * Hard delete a training sample
     */
    async hardDelete(id: string): Promise<boolean> {
        try {
            const result = await TrainingSample.findByIdAndDelete(id)
            return !!result
        } catch (error: any) {
            console.error('Error deleting training sample:', error.message)
            throw new Error(`Failed to delete training sample: ${error.message}`)
        }
    }

    /**
     * Vector similarity search for training samples
     */
    async vectorSearch(input: VectorSearchInput): Promise<{ sample: ITrainingSample; similarity: number }[]> {
        try {
            const { query, topK = 5, filters = {} } = input

            // Generate embedding for the query
            const queryEmbedding = await EmbeddingService.generateEmbedding(query)

            // Build filter query
            const filterQuery: FilterQuery<ITrainingSample> = { isActive: true }
            if (filters.type) filterQuery.type = filters.type
            if (filters.sourceType) filterQuery.sourceType = filters.sourceType
            if (filters.language) filterQuery.language = filters.language
            if (filters.tags && filters.tags.length > 0) {
                filterQuery.tags = { $in: filters.tags }
            }

            // Fetch all matching samples with embeddings
            const samples = await TrainingSample.find(filterQuery).lean()

            // Calculate similarities
            const samplesWithEmbeddings = samples.map(s => ({
                id: s._id.toString(),
                embedding: s.embedding
            }))

            const topResults = EmbeddingService.findTopKSimilar(
                queryEmbedding,
                samplesWithEmbeddings,
                topK
            )

            // Map back to full sample data
            const sampleMap = new Map(samples.map(s => [s._id.toString(), s]))

            return topResults.map(result => ({
                sample: sampleMap.get(result.id)!,
                similarity: result.similarity
            }))
        } catch (error: any) {
            console.error('Error performing vector search:', error.message)
            throw new Error(`Failed to perform vector search: ${error.message}`)
        }
    }

    /**
     * Get statistics about training samples
     */
    async getStats(): Promise<{
        total: number
        byType: Record<string, number>
        bySource: Record<string, number>
        activeCount: number
    }> {
        try {
            const [total, byType, bySource, activeCount] = await Promise.all([
                TrainingSample.countDocuments(),
                TrainingSample.aggregate([
                    { $group: { _id: '$type', count: { $sum: 1 } } }
                ]),
                TrainingSample.aggregate([
                    { $group: { _id: '$sourceType', count: { $sum: 1 } } }
                ]),
                TrainingSample.countDocuments({ isActive: true })
            ])

            return {
                total,
                byType: Object.fromEntries(byType.map(t => [t._id, t.count])),
                bySource: Object.fromEntries(bySource.map(s => [s._id, s.count])),
                activeCount
            }
        } catch (error: any) {
            console.error('Error fetching stats:', error.message)
            throw new Error(`Failed to fetch stats: ${error.message}`)
        }
    }
}

export default new TrainingSampleService()
