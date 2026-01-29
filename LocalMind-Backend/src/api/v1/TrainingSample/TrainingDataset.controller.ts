import { Request, Response, NextFunction } from 'express'
import TrainingDatasetService from './TrainingDataset.service'
import * as multer from 'multer'
import * as path from 'path'
import * as os from 'os'

// Configure multer for file uploads
const uploadDir = path.join(os.tmpdir(), 'training-datasets')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    cb(null, `${timestamp}-${random}-${file.originalname}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['text/csv', 'application/json', 'text/markdown', 'text/plain']
    const allowedExts = ['.csv', '.json', '.md', '.markdown', '.txt']

    const ext = path.extname(file.originalname).toLowerCase()
    const isMimeAllowed = allowedMimes.includes(file.mimetype)
    const isExtAllowed = allowedExts.includes(ext)

    if (isMimeAllowed || isExtAllowed) {
      cb(null, true)
    } else {
      cb(new Error(`File type not supported. Allowed: ${allowedExts.join(', ')}`))
    }
  },
})

class TrainingDatasetController {
  /**
   * POST /api/v1/training-datasets/upload
   * Upload and process a training dataset file
   */
  async uploadDataset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      if (!req.file) {
        res.status(400).json({ error: 'No file provided' })
        return
      }

      const { name, description } = req.body

      if (!name) {
        res.status(400).json({ error: 'Dataset name is required' })
        return
      }

      // Determine file type from extension
      const ext = path.extname(req.file.originalname).toLowerCase()
      let fileType: 'csv' | 'json' | 'markdown' | 'text'

      switch (ext) {
        case '.csv':
          fileType = 'csv'
          break
        case '.json':
          fileType = 'json'
          break
        case '.md':
        case '.markdown':
          fileType = 'markdown'
          break
        case '.txt':
          fileType = 'text'
          break
        default:
          res.status(400).json({ error: 'Unsupported file type' })
          return
      }

      // Create dataset record
      const dataset = await TrainingDatasetService.createDataset(
        userId,
        req.file.originalname,
        fileType,
        req.file.size,
        name,
        description
      )

      // Process dataset asynchronously
      TrainingDatasetService.processDataset(dataset._id.toString(), userId, req.file.path).catch(error => {
        console.error('Error processing dataset:', error)
      })

      res.status(201).json({
        success: true,
        data: dataset,
        message: 'Dataset uploaded successfully and is being processed',
      })
    } catch (error: any) {
      console.error('Error uploading dataset:', error)
      res.status(500).json({ error: error.message || 'Failed to upload dataset' })
    }
  }

  /**
   * GET /api/v1/training-datasets
   * Get all datasets for a user
   */
  async getDatasets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { skip = 0, limit = 20 } = req.query

      const result = await TrainingDatasetService.getDatasets(
        userId,
        parseInt(skip as string) || 0,
        parseInt(limit as string) || 20
      )

      res.status(200).json({
        success: true,
        data: result.datasets,
        pagination: {
          skip: parseInt(skip as string) || 0,
          limit: parseInt(limit as string) || 20,
          total: result.total,
        },
      })
    } catch (error) {
      console.error('Error fetching datasets:', error)
      res.status(500).json({ error: 'Failed to fetch datasets' })
    }
  }

  /**
   * GET /api/v1/training-datasets/:id
   * Get dataset by ID
   */
  async getDataset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const dataset = await TrainingDatasetService.getDataset(id, userId)

      if (!dataset) {
        res.status(404).json({ error: 'Dataset not found' })
        return
      }

      res.status(200).json({
        success: true,
        data: dataset,
      })
    } catch (error) {
      console.error('Error fetching dataset:', error)
      res.status(500).json({ error: 'Failed to fetch dataset' })
    }
  }

  /**
   * DELETE /api/v1/training-datasets/:id
   * Delete dataset
   */
  async deleteDataset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params
      const { deleteSamples = false } = req.query

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const success = await TrainingDatasetService.deleteDataset(id, userId, deleteSamples === 'true')

      if (!success) {
        res.status(404).json({ error: 'Dataset not found' })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Dataset deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting dataset:', error)
      res.status(500).json({ error: 'Failed to delete dataset' })
    }
  }

  /**
   * GET /api/v1/training-datasets/stats
   * Get dataset statistics
   */
  async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const stats = await TrainingDatasetService.getStatistics(userId)

      res.status(200).json({
        success: true,
        data: stats,
      })
    } catch (error) {
      console.error('Error fetching statistics:', error)
      res.status(500).json({ error: 'Failed to fetch statistics' })
    }
  }

  /**
   * Get multer upload middleware
   */
  getUploadMiddleware() {
    return upload.single('file')
  }
}

export default new TrainingDatasetController()
