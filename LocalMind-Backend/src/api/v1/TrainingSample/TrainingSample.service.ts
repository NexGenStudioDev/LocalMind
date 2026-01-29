import { Types } from 'mongoose'
import { TrainingSample } from './TrainingSample.model'
import { ITrainingSample, IVectorSearchRequest, IVectorSearchResult } from './TrainingSample.types'
import EmbeddingUtils from './TrainingSample.embedding'

class TrainingSampleService {
  /**
   * Create a new training sample with embedding generation
   */
  async createSample(userId: string, data: any): Promise<ITrainingSample> {
    try {
      // Generate embedding from question and answer
      const embeddingText = `${data.question} ${data.answerTemplate.answer}`
      const { embedding } = await EmbeddingUtils.generateEmbedding(embeddingText)

      const sample = await TrainingSample.create({
        userId: new Types.ObjectId(userId),
        ...data,
        embedding,
      })

      return sample
    } catch (error) {
      console.error('Error creating training sample:', error)
      throw error
    }
  }

  /**
   * Get all training samples for a user with filters
   */
  async getSamplesByUser(
    userId: string,
    filters: {
      type?: string[]
      tags?: string[]
      sourceType?: 'manual' | 'dataset'
      isActive?: boolean
      language?: string
    } = {},
    skip: number = 0,
    limit: number = 20
  ): Promise<{ samples: ITrainingSample[]; total: number }> {
    const query: any = {
      userId: new Types.ObjectId(userId),
    }

    if (filters.type && filters.type.length > 0) {
      query.type = { $in: filters.type }
    }
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags }
    }
    if (filters.sourceType) {
      query.sourceType = filters.sourceType
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive
    }
    if (filters.language) {
      query.language = filters.language
    }

    const [samples, total] = await Promise.all([
      TrainingSample.find(query).skip(skip).limit(limit).exec(),
      TrainingSample.countDocuments(query),
    ])

    return { samples, total }
  }

  /**
   * Get a single training sample by ID
   */
  async getSampleById(sampleId: string, userId: string): Promise<ITrainingSample | null> {
    return await TrainingSample.findOne({
      _id: new Types.ObjectId(sampleId),
      userId: new Types.ObjectId(userId),
    })
  }

  /**
   * Update a training sample and regenerate embedding if content changed
   */
  async updateSample(sampleId: string, userId: string, data: any): Promise<ITrainingSample | null> {
    const sample = await this.getSampleById(sampleId, userId)

    if (!sample) {
      throw new Error('Training sample not found')
    }

    // Regenerate embedding if question or answer changed
    let embedding = sample.embedding
    if (data.question || data.answerTemplate) {
      const question = data.question || sample.question
      const answer = data.answerTemplate?.answer || sample.answerTemplate.answer
      const embeddingText = `${question} ${answer}`
      const result = await EmbeddingUtils.generateEmbedding(embeddingText)
      embedding = result.embedding
    }

    const updated = await TrainingSample.findByIdAndUpdate(
      sampleId,
      {
        ...data,
        embedding,
      },
      { new: true }
    )

    return updated
  }

  /**
   * Soft delete a training sample
   */
  async deleteSample(sampleId: string, userId: string): Promise<boolean> {
    const result = await TrainingSample.findOneAndUpdate(
      {
        _id: new Types.ObjectId(sampleId),
        userId: new Types.ObjectId(userId),
      },
      { isActive: false },
      { new: true }
    )

    return !!result
  }

  /**
   * Vector semantic search with cosine similarity
   */
  async vectorSearch(userId: string, searchRequest: IVectorSearchRequest): Promise<IVectorSearchResult> {
    const startTime = Date.now()

    try {
      // Generate embedding for the query
      const { embedding: queryEmbedding } = await EmbeddingUtils.generateEmbedding(searchRequest.query)

      // Build filter query
      const filterQuery: any = {
        userId: new Types.ObjectId(userId),
        isActive: true,
      }

      if (searchRequest.filters) {
        if (searchRequest.filters.type && searchRequest.filters.type.length > 0) {
          filterQuery.type = { $in: searchRequest.filters.type }
        }
        if (searchRequest.filters.tags && searchRequest.filters.tags.length > 0) {
          filterQuery.tags = { $in: searchRequest.filters.tags }
        }
        if (searchRequest.filters.sourceType) {
          filterQuery.sourceType = searchRequest.filters.sourceType
        }
        if (searchRequest.filters.language) {
          filterQuery.language = searchRequest.filters.language
        }
      }

      // Get all matching samples (note: for large datasets, consider MongoDB Atlas Vector Search)
      const samples = await TrainingSample.find(filterQuery).exec()

      // Calculate similarity scores
      const scoredSamples = samples
        .map(sample => ({
          sample,
          score: EmbeddingUtils.cosineSimilarity(queryEmbedding, sample.embedding),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, searchRequest.topK || 5)

      const searchTime = Date.now() - startTime

      return {
        samples: scoredSamples.map(s => s.sample),
        totalResults: scoredSamples.length,
        searchTime,
      }
    } catch (error) {
      console.error('Error performing vector search:', error)
      throw error
    }
  }

  /**
   * Get statistics for training samples
   */
  async getStatistics(userId: string): Promise<{
    total: number
    active: number
    byType: Record<string, number>
    byLanguage: Record<string, number>
  }> {
    const userIdObj = new Types.ObjectId(userId)

    const [total, active, byType, byLanguage] = await Promise.all([
      TrainingSample.countDocuments({ userId: userIdObj }),
      TrainingSample.countDocuments({ userId: userIdObj, isActive: true }),
      TrainingSample.aggregate([
        { $match: { userId: userIdObj } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      TrainingSample.aggregate([
        { $match: { userId: userIdObj } },
        { $group: { _id: '$language', count: { $sum: 1 } } },
      ]),
    ])

    const byTypeObj: Record<string, number> = {}
    byType.forEach((item: any) => {
      byTypeObj[item._id] = item.count
    })

    const byLanguageObj: Record<string, number> = {}
    byLanguage.forEach((item: any) => {
      byLanguageObj[item._id] = item.count
    })

    return {
      total,
      active,
      byType: byTypeObj,
      byLanguage: byLanguageObj,
    }
  }
}

export default new TrainingSampleService()
