import { Router } from 'express'
import TrainingSampleController from './TrainingSample.controller'

const router = Router()

/**
 * Training Sample Routes
 * All routes require authentication
 */

/**
 * POST /api/v1/training-samples
 * Create a new training sample
 * Body: {
 *   question: string,
 *   answerTemplate: { answer, format, structure },
 *   type: 'qa' | 'snippet' | 'doc' | 'faq' | 'other',
 *   sourceType: 'manual' | 'dataset',
 *   tags: string[],
 *   language: string
 * }
 */
router.post('/', TrainingSampleController.createTrainingSample.bind(TrainingSampleController))

/**
 * GET /api/v1/training-samples
 * Get all training samples with filtering
 * Query params:
 *   - type: string[] (comma-separated)
 *   - tags: string[] (comma-separated)
 *   - sourceType: 'manual' | 'dataset'
 *   - isActive: boolean
 *   - language: string
 *   - skip: number (default: 0)
 *   - limit: number (default: 20)
 */
router.get('/', TrainingSampleController.getSamples.bind(TrainingSampleController))

/**
 * GET /api/v1/training-samples/stats
 * Get statistics about training samples
 */
router.get('/stats', TrainingSampleController.getStatistics.bind(TrainingSampleController))

/**
 * GET /api/v1/training-samples/:id
 * Get a single training sample
 */
router.get('/:id', TrainingSampleController.getSampleById.bind(TrainingSampleController))

/**
 * PUT /api/v1/training-samples/:id
 * Update a training sample
 */
router.put('/:id', TrainingSampleController.updateSample.bind(TrainingSampleController))

/**
 * DELETE /api/v1/training-samples/:id
 * Delete a training sample (soft delete)
 */
router.delete('/:id', TrainingSampleController.deleteSample.bind(TrainingSampleController))

/**
 * POST /api/v1/training-samples/search
 * Vector semantic search
 * Body: {
 *   query: string,
 *   topK: number (default: 5),
 *   filters: {
 *     type?: string[],
 *     tags?: string[],
 *     sourceType?: 'manual' | 'dataset',
 *     language?: string
 *   }
 * }
 */
router.post('/search', TrainingSampleController.vectorSearch.bind(TrainingSampleController))

export default router
