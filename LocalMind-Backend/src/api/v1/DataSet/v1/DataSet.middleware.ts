import { Request } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { env } from '../../../constant/env.constant'

/**
 * DatasetUploadMiddleware - Configures storage and file filtering for dataset uploads.
 * This middleware ensures that only supported file types are accepted and stored correctly.
 */

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'datasets')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Create a unique filename with the original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Supported extensions for AI training data
  const allowedExtensions = ['.pdf', '.csv', '.xlsx', '.json', '.txt', '.md']
  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedExtensions.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`Unsupported file type: ${ext}. Supported types: ${allowedExtensions.join(', ')}`))
  }
}

export const datasetUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: Number(env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // Use env or default to 10MB
  },
})
