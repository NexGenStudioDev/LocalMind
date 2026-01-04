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
      const userId = (req as any).user?._id // Extracted from auth middleware
      const sample = await TrainingSampleService.createSample(userId, req.body)
      
      SendResponse.success(res, 'Training sample created successfully', sample, 201)
    } catch (error: any) {
      SendResponse.error(res, error.message || 'Failed to create training sample', 500, error)
    }
  }

  /**
   * GET /api/v1/training-samples
   * Retrieves a paginated list of samples with optional filters.
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, type, tags, isActive, sourceType } = req.query
      const filters = { type, tags, isActive, sourceType }
      
      const result = await TrainingSampleService.getSamples(
        filters,
        Number(page) || 1,
        Number(limit) || 10
      )
      
      SendResponse.success(res, 'Training samples retrieved successfully', result)
    } catch (error: any) {
      SendResponse.error(res, 'Failed to fetch training samples', 500, error)
    }
  }

  /**
   * GET /api/v1/training-samples/:id
   * Retrieves a specific sample by ID.
   */
  public async getOne(req: Request, res: Response): Promise<void> {
    try {
      const sample = await TrainingSampleService.getSampleById(req.params.id)
      if (!sample) {
        return SendResponse.error(res, 'Training sample not found', 404)
      }
      SendResponse.success(res, 'Training sample retrieved successfully', sample)
    } catch (error: any) {
      SendResponse.error(res, 'Failed to fetch training sample', 500, error)
    }
  }

  /**
   * PUT /api/v1/training-samples/:id
   * Updates an existing sample and re-generates embedding if the question changed.
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const sample = await TrainingSampleService.updateSample(req.params.id, req.body)
      if (!sample) {
        return SendResponse.error(res, 'Training sample not found', 404)
      }
      SendResponse.success(res, 'Training sample updated successfully', sample)
    } catch (error: any) {
      SendResponse.error(res, 'Failed to update training sample', 500, error)
    }
  }

  /**
   * DELETE /api/v1/training-samples/:id
   * Performs a soft delete by deactivating the sample.
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const sample = await TrainingSampleService.softDeleteSample(req.params.id)
      if (!sample) {
        return SendResponse.error(res, 'Training sample not found', 404)
      }
      SendResponse.success(res, 'Training sample deactivated successfully', sample)
    } catch (error: any) {
      SendResponse.error(res, 'Failed to delete training sample', 500, error)
    }
  }
}

export default new TrainingSampleController()
