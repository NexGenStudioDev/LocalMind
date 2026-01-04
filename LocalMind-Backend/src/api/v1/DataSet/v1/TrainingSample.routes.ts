import { Router } from 'express'
import TrainingSampleController from './TrainingSample.controller'
import UserMiddleware from '../../user/user.middleware'

const router = Router()

/**
 * Training Sample Routes
 * All routes are protected by UserMiddleware to ensure only authenticated users
 * can manage their training data.
 */

// Apply authentication middleware to all routes in this router
router.use(UserMiddleware.middleware)

// CRUD Endpoints
router.post('/', TrainingSampleController.create)
router.get('/', TrainingSampleController.getAll)
router.post('/search', TrainingSampleController.search) // Semantic search endpoint
router.get('/:id', TrainingSampleController.getOne)
router.put('/:id', TrainingSampleController.update)
router.delete('/:id', TrainingSampleController.delete)

export const TrainingSampleRoutes: Router = router
