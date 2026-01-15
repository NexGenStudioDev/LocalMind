import { Router } from 'express'
import TrainingDatasetController from './TrainingDataset.controller'

const router = Router()

/**
 * Training Dataset Routes
 * All routes require authentication
 */

/**
 * POST /api/v1/training-datasets/upload
 * Upload a training dataset file
 * Supports: CSV, JSON, Markdown, Text files
 * Max file size: 100MB
 */
router.post(
  '/upload',
  TrainingDatasetController.getUploadMiddleware(),
  TrainingDatasetController.uploadDataset.bind(TrainingDatasetController)
)

/**
 * GET /api/v1/training-datasets
 * Get all datasets for the user
 * Query params:
 *   - skip: number (default: 0)
 *   - limit: number (default: 20)
 */
router.get('/', TrainingDatasetController.getDatasets.bind(TrainingDatasetController))

/**
 * GET /api/v1/training-datasets/stats
 * Get statistics about datasets
 */
router.get('/stats', TrainingDatasetController.getStatistics.bind(TrainingDatasetController))

/**
 * GET /api/v1/training-datasets/:id
 * Get a single dataset
 */
router.get('/:id', TrainingDatasetController.getDataset.bind(TrainingDatasetController))

/**
 * DELETE /api/v1/training-datasets/:id
 * Delete a dataset
 * Query params:
 *   - deleteSamples: boolean (default: false) - whether to delete associated samples
 */
router.delete('/:id', TrainingDatasetController.deleteDataset.bind(TrainingDatasetController))

export default router
