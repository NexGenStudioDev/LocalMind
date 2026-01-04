import { TrainingSample } from './TrainingSample.model'
import { ITrainingSample, IAnswerTemplate } from './DataSet.type'
import { EmbeddingUtils } from './Embedding.utils'
import { Types } from 'mongoose'

/**
 * TrainingSampleService - Handles the business logic for AI training data.
 * This service manages CRUD operations and automated embedding generation.
 */
class TrainingSampleService {
  /**
   * Creates a new training sample and generates its vector embedding.
   * @param userId - The ID of the user creating the sample.
   * @param data - The training sample data (question, type, answerTemplate, etc.).
   */
  public async createSample(userId: string, data: Partial<ITrainingSample>): Promise<ITrainingSample> {
    // Generate embedding for the question to enable semantic search later
    const embedding = await EmbeddingUtils.generateEmbedding(data.question!)

    const sample = new TrainingSample({
      ...data,
      userId: new Types.ObjectId(userId),
      embedding,
      sourceType: 'manual',
      isActive: true,
    })

    return await sample.save()
  }

  /**
   * Retrieves a list of training samples with optional filtering and pagination.
   * @param filters - Filter criteria (type, tags, isActive, sourceType).
   * @param page - Current page number.
   * @param limit - Number of items per page.
   */
  public async getSamples(filters: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    
    // Build query object based on provided filters
    const query: any = {}
    if (filters.type) query.type = filters.type
    if (filters.tags) query.tags = { $in: Array.isArray(filters.tags) ? filters.tags : [filters.tags] }
    if (filters.isActive !== undefined) query.isActive = filters.isActive === 'true'
    if (filters.sourceType) query.sourceType = filters.sourceType

    const data = await TrainingSample.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-embedding') // Exclude large embedding array from list view

    const total = await TrainingSample.countDocuments(query)

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Fetches a single training sample by its ID.
   */
  public async getSampleById(id: string): Promise<ITrainingSample | null> {
    return await TrainingSample.findById(id)
  }

  /**
   * Updates an existing training sample. 
   * If the question changes, we must re-generate the embedding.
   */
  public async updateSample(id: string, data: Partial<ITrainingSample>): Promise<ITrainingSample | null> {
    const existingSample = await TrainingSample.findById(id)
    if (!existingSample) return null

    // Check if we need to refresh the embedding
    if (data.question && data.question !== existingSample.question) {
      data.embedding = await EmbeddingUtils.generateEmbedding(data.question)
    }

    return await TrainingSample.findByIdAndUpdate(id, { $set: data }, { new: true })
  }

  /**
   * Performs a soft delete by setting isActive to false.
   */
  public async softDeleteSample(id: string): Promise<ITrainingSample | null> {
    return await TrainingSample.findByIdAndUpdate(id, { isActive: false }, { new: true })
  }
}

export default new TrainingSampleService()
