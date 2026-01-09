import { Request, Response, NextFunction } from 'express'
import TrainingSampleService from './TrainingSample.service'
import { createTrainingSampleSchema, updateTrainingSampleSchema, vectorSearchSchema } from './TrainingSample.validator'

class TrainingSampleController {
  /**
   * POST /api/v1/training-samples
   * Create a new training sample
   */
  async createTrainingSample(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      // Validate request body
      const validatedData = createTrainingSampleSchema.parse(req.body)

      const sample = await TrainingSampleService.createSample(userId, validatedData)

      res.status(201).json({
        success: true,
        data: sample,
        message: 'Training sample created successfully',
      })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        })
      } else {
        console.error('Error creating training sample:', error)
        res.status(500).json({ error: 'Failed to create training sample' })
      }
    }
  }

  /**
   * GET /api/v1/training-samples
   * Get all training samples with filtering and pagination
   */
  async getSamples(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const {
        type,
        tags,
        sourceType,
        isActive = true,
        language,
        skip = 0,
        limit = 20,
      } = req.query

      const filters = {
        type: type ? (Array.isArray(type) ? type : [type]) : undefined,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : undefined,
        sourceType: sourceType as 'manual' | 'dataset' | undefined,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        language: language as string | undefined,
      }

      const result = await TrainingSampleService.getSamplesByUser(
        userId,
        filters,
        parseInt(skip as string) || 0,
        parseInt(limit as string) || 20
      )

      res.status(200).json({
        success: true,
        data: result.samples,
        pagination: {
          skip: parseInt(skip as string) || 0,
          limit: parseInt(limit as string) || 20,
          total: result.total,
        },
      })
    } catch (error) {
      console.error('Error fetching training samples:', error)
      res.status(500).json({ error: 'Failed to fetch training samples' })
    }
  }

  /**
   * GET /api/v1/training-samples/:id
   * Get a single training sample by ID
   */
  async getSampleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const sample = await TrainingSampleService.getSampleById(id, userId)

      if (!sample) {
        res.status(404).json({ error: 'Training sample not found' })
        return
      }

      res.status(200).json({
        success: true,
        data: sample,
      })
    } catch (error) {
      console.error('Error fetching training sample:', error)
      res.status(500).json({ error: 'Failed to fetch training sample' })
    }
  }

  /**
   * PUT /api/v1/training-samples/:id
   * Update a training sample
   */
  async updateSample(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      // Validate request body
      const validatedData = updateTrainingSampleSchema.parse(req.body)

      const updatedSample = await TrainingSampleService.updateSample(id, userId, validatedData)

      if (!updatedSample) {
        res.status(404).json({ error: 'Training sample not found' })
        return
      }

      res.status(200).json({
        success: true,
        data: updatedSample,
        message: 'Training sample updated successfully',
      })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        })
      } else {
        console.error('Error updating training sample:', error)
        res.status(500).json({ error: 'Failed to update training sample' })
      }
    }
  }

  /**
   * DELETE /api/v1/training-samples/:id
   * Delete a training sample (soft delete)
   */
  async deleteSample(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const success = await TrainingSampleService.deleteSample(id, userId)

      if (!success) {
        res.status(404).json({ error: 'Training sample not found' })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Training sample deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting training sample:', error)
      res.status(500).json({ error: 'Failed to delete training sample' })
    }
  }

  /**
   * POST /api/v1/training-samples/search
   * Vector semantic search
   */
  async vectorSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      // Validate request body
      const validatedData = vectorSearchSchema.parse(req.body)

      const result = await TrainingSampleService.vectorSearch(userId, validatedData)

      res.status(200).json({
        success: true,
        data: result.samples,
        metadata: {
          totalResults: result.totalResults,
          searchTime: result.searchTime,
          query: validatedData.query,
        },
      })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        })
      } else {
        console.error('Error performing vector search:', error)
        res.status(500).json({ error: 'Failed to perform vector search' })
      }
    }
  }

  /**
   * GET /api/v1/training-samples/stats
   * Get statistics about training samples
   */
  async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const stats = await TrainingSampleService.getStatistics(userId)

      res.status(200).json({
        success: true,
        data: stats,
      })
    } catch (error) {
      console.error('Error fetching statistics:', error)
      res.status(500).json({ error: 'Failed to fetch statistics' })
    }
  }
}

export default new TrainingSampleController()
