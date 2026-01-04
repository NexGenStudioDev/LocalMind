import { Request, Response } from 'express'
import TrainingSampleService from './TrainingSample.service'
import { SendResponse } from '../../../../utils/SendResponse.utils'

/**
 * TrainingSampleController - Handles incoming HTTP requests for training data management.
 * Implements standard CRUD operations and integrates with the TrainingSampleService.
 */
class TrainingSampleController {
  /**
   * POST /api/v1/training-samples
   * Creates a new manual training entry.
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id?.toString()
      if (!userId) {
        SendResponse.error(res, 'User not authenticated', 401)
        return
      }

      const sample = await TrainingSampleService.createSample(userId, req.body)

      SendResponse.success(res, 'Training sample created successfully', sample, 201)
    } catch (error: unknown) {
      SendResponse.error(
        res,
        error instanceof Error ? error.message : 'Failed to create training sample',
        500,
        error
      )
    }
  }

  /**
   * GET /api/v1/training-samples
   * Retrieves a paginated list of samples with optional filters.
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, type, tags, isActive, sourceType } = req.query
      const filters = {
        type: type as string,
        tags: tags as string[],
        isActive: isActive === 'true',
        sourceType: sourceType as string,
      }

      const result = await TrainingSampleService.getSamples(
        filters,
        Number(page) || 1,
        Number(limit) || 10
      )

      SendResponse.success(res, 'Training samples retrieved successfully', result)
    } catch (error: unknown) {
      SendResponse.error(res, 'Failed to fetch training samples', 500, error)
    }
  }

  /**
   * GET /api/v1/training-samples/:id
   * Retrieves a specific sample by ID.
   */
  public async getOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!id) {
        SendResponse.error(res, 'ID is required', 400)
        return
      }
      const sample = await TrainingSampleService.getSampleById(id)
      if (!sample) {
        SendResponse.error(res, 'Training sample not found', 404)
        return
      }
      SendResponse.success(res, 'Training sample retrieved successfully', sample)
    } catch (error: unknown) {
      SendResponse.error(res, 'Failed to fetch training sample', 500, error)
    }
  }

  /**
   * PUT /api/v1/training-samples/:id
   * Updates an existing sample and re-generates embedding if the question changed.
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!id) {
        SendResponse.error(res, 'ID is required', 400)
        return
      }
      const sample = await TrainingSampleService.updateSample(id, req.body)
      if (!sample) {
        SendResponse.error(res, 'Training sample not found', 404)
        return
      }
      SendResponse.success(res, 'Training sample updated successfully', sample)
    } catch (error: unknown) {
      SendResponse.error(res, 'Failed to update training sample', 500, error)
    }
  }

  /**
   * DELETE /api/v1/training-samples/:id
   * Performs a soft delete by deactivating the sample.
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!id) {
        SendResponse.error(res, 'ID is required', 400)
        return
      }
      const sample = await TrainingSampleService.softDeleteSample(id)
      if (!sample) {
        SendResponse.error(res, 'Training sample not found', 404)
        return
      }
      SendResponse.success(res, 'Training sample deactivated successfully', sample)
    } catch (error: unknown) {
      SendResponse.error(res, 'Failed to delete training sample', 500, error)
    }
  }

  /**
   * POST /api/v1/training-samples/search
   * Performs a semantic search using vector embeddings.
   */
  public async search(req: Request, res: Response): Promise<void> {
    try {
      const { query, topK, filters } = req.body
      if (!query) {
        SendResponse.error(res, 'Search query is required', 400)
        return
      }

      const results = await TrainingSampleService.vectorSearch(
        query,
        Number(topK) || 5,
        filters || {}
      )

      SendResponse.success(res, 'Semantic search completed successfully', results)
    } catch (error: unknown) {
      SendResponse.error(
        res,
        error instanceof Error ? error.message : 'Failed to search training samples',
        500,
        error
      )
    }
  }
}

export default new TrainingSampleController()
