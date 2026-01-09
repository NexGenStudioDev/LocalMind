import { Types } from 'mongoose'
import { TrainingDataset, ITrainingDataset } from './TrainingDataset.model'
import { TrainingSample } from './TrainingSample.model'
import TrainingSampleFileParser, { ParsedSample } from './TrainingSample.utils'
import EmbeddingUtils from './TrainingSample.embedding'
import * as fs from 'fs'

class TrainingDatasetService {
  /**
   * Create a new dataset record
   */
  async createDataset(
    userId: string,
    fileName: string,
    fileType: 'csv' | 'json' | 'markdown' | 'text',
    fileSize: number,
    name: string,
    description?: string
  ): Promise<ITrainingDataset> {
    const dataset = await TrainingDataset.create({
      userId: new Types.ObjectId(userId),
      fileName,
      fileType,
      fileSize,
      name,
      description,
      status: 'pending',
    })

    return dataset
  }

  /**
   * Process a dataset file and create training samples
   */
  async processDataset(datasetId: string, userId: string, filePath: string): Promise<number> {
    const dataset = await TrainingDataset.findOne({
      _id: datasetId,
      userId: new Types.ObjectId(userId),
    })

    if (!dataset) {
      throw new Error('Dataset not found')
    }

    try {
      // Update status to processing
      await TrainingDataset.updateOne({ _id: datasetId }, { status: 'processing' })

      // Parse file
      const parsedSamples = await TrainingSampleFileParser.parseFile(filePath)

      // Validate samples
      const { valid: validSamples, errors } = TrainingSampleFileParser.validateSamples(parsedSamples)

      if (validSamples.length === 0) {
        throw new Error(`No valid samples found. Errors: ${errors.join('; ')}`)
      }

      // Generate embeddings and create samples
      const createdSamples = []
      for (const sample of validSamples) {
        try {
          const embeddingText = `${sample.question} ${sample.answerTemplate.answer}`
          const { embedding } = await EmbeddingUtils.generateEmbedding(embeddingText)

          const trainingSample = await TrainingSample.create({
            userId: new Types.ObjectId(userId),
            ...sample,
            embedding,
          })

          createdSamples.push(trainingSample)
        } catch (error) {
          console.error('Error creating sample:', sample.question, error)
          // Continue with next sample
        }
      }

      // Update dataset with results
      await TrainingDataset.updateOne(
        { _id: datasetId },
        {
          status: 'completed',
          sampleCount: createdSamples.length,
          importedAt: new Date(),
          errorMessage: errors.length > 0 ? errors.slice(0, 5).join('; ') : undefined,
        }
      )

      // Clean up temporary file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      return createdSamples.length
    } catch (error: any) {
      console.error('Error processing dataset:', error)

      await TrainingDataset.updateOne(
        { _id: datasetId },
        {
          status: 'failed',
          errorMessage: error.message,
        }
      )

      throw error
    }
  }

  /**
   * Get all datasets for a user
   */
  async getDatasets(
    userId: string,
    skip: number = 0,
    limit: number = 20
  ): Promise<{ datasets: ITrainingDataset[]; total: number }> {
    const [datasets, total] = await Promise.all([
      TrainingDataset.find({ userId: new Types.ObjectId(userId), isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      TrainingDataset.countDocuments({
        userId: new Types.ObjectId(userId),
        isActive: true,
      }),
    ])

    return { datasets, total }
  }

  /**
   * Get dataset by ID
   */
  async getDataset(datasetId: string, userId: string): Promise<ITrainingDataset | null> {
    return await TrainingDataset.findOne({
      _id: datasetId,
      userId: new Types.ObjectId(userId),
    })
  }

  /**
   * Delete dataset (and optionally associated samples)
   */
  async deleteDataset(datasetId: string, userId: string, deletesSamples: boolean = false): Promise<boolean> {
    const dataset = await this.getDataset(datasetId, userId)

    if (!dataset) {
      return false
    }

    if (deletesSamples) {
      // Delete all samples associated with this dataset
      await TrainingSample.deleteMany({
        sourceType: 'dataset',
        userId: new Types.ObjectId(userId),
      })
    }

    await TrainingDataset.updateOne({ _id: datasetId }, { isActive: false })

    return true
  }

  /**
   * Get dataset statistics
   */
  async getStatistics(userId: string): Promise<{
    totalDatasets: number
    completedDatasets: number
    failedDatasets: number
    totalSamples: number
    byFileType: Record<string, number>
  }> {
    const userIdObj = new Types.ObjectId(userId)

    const [totalDatasets, completedDatasets, failedDatasets, totalSamples, byFileType] = await Promise.all([
      TrainingDataset.countDocuments({ userId: userIdObj, isActive: true }),
      TrainingDataset.countDocuments({
        userId: userIdObj,
        status: 'completed',
        isActive: true,
      }),
      TrainingDataset.countDocuments({
        userId: userIdObj,
        status: 'failed',
        isActive: true,
      }),
      TrainingSample.countDocuments({
        userId: userIdObj,
        sourceType: 'dataset',
        isActive: true,
      }),
      TrainingDataset.aggregate([
        { $match: { userId: userIdObj, isActive: true } },
        { $group: { _id: '$fileType', count: { $sum: 1 } } },
      ]),
    ])

    const byFileTypeObj: Record<string, number> = {}
    byFileType.forEach((item: any) => {
      byFileTypeObj[item._id] = item.count
    })

    return {
      totalDatasets,
      completedDatasets,
      failedDatasets,
      totalSamples,
      byFileType: byFileTypeObj,
    }
  }
}

export default new TrainingDatasetService()
