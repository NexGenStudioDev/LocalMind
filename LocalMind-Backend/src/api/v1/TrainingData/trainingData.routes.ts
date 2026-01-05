import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import TrainingDataController from './trainingData.controller'

const router: Router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'uploads', 'datasets'))
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueName = `${uuidv4()}${ext}`
        cb(null, uniqueName)
    }
})

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/json',
        'text/plain',
        'text/markdown',
        'application/pdf'
    ]

    const allowedExts = ['.csv', '.xls', '.xlsx', '.json', '.txt', '.md', '.pdf']
    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`))
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
})

// ==================== TRAINING SAMPLES ROUTES ====================

// Create a new training sample (manual entry)
router.post('/v1/training-samples', TrainingDataController.createSample)

// Get all training samples with optional filters
router.get('/v1/training-samples', TrainingDataController.getAllSamples)

// Get training sample statistics
router.get('/v1/training-samples/stats', TrainingDataController.getSampleStats)

// Vector search for training samples
router.post('/v1/training-samples/search', TrainingDataController.searchSamples)

// Get a single training sample by ID
router.get('/v1/training-samples/:id', TrainingDataController.getSampleById)

// Update a training sample
router.put('/v1/training-samples/:id', TrainingDataController.updateSample)

// Delete a training sample
router.delete('/v1/training-samples/:id', TrainingDataController.deleteSample)

// ==================== DATASET FILES ROUTES ====================

// Upload a dataset file
router.post('/v1/training-datasets/upload', upload.single('file'), TrainingDataController.uploadDataset)

// Get all datasets
router.get('/v1/training-datasets', TrainingDataController.getAllDatasets)

// Get dataset statistics
router.get('/v1/training-datasets/stats', TrainingDataController.getDatasetStats)

// Get a single dataset by ID
router.get('/v1/training-datasets/:id', TrainingDataController.getDatasetById)

// Preview dataset content before processing
router.get('/v1/training-datasets/:id/preview', TrainingDataController.previewDataset)

// Process a dataset file
router.post('/v1/training-datasets/:id/process', TrainingDataController.processDataset)

// Delete a dataset
router.delete('/v1/training-datasets/:id', TrainingDataController.deleteDataset)

export { router as TrainingDataRoutes }
