import { Router } from 'express'
import DatasetFileController from './DatasetFile.controller'
import { datasetUpload } from './DataSet.middleware'
import UserMiddleware from '../../user/user.middleware'

const router = Router()

/**
 * Dataset File Routes
 * Handles uploading and processing of large datasets for AI training.
 */

router.use(UserMiddleware.middleware)

// Upload a new dataset file
router.post('/upload', datasetUpload.single('dataset'), DatasetFileController.upload)

// Trigger processing of an uploaded file
router.post('/:id/process', DatasetFileController.process)

export const DatasetFileRoutes: Router = router
