import { Router } from 'express'
import DataSetController from './DataSet.controller'
import DataSetValidator from './DataSet.validator'
import { upload } from './DataSet.multer'

const router: Router = Router()

/**
 * @route   POST /api/v1/dataset/upload
 * @desc    Upload and process a dataset file (CSV, PDF, TXT, JSON, TSV)
 * @access  Public (add authentication if needed)
 */
router.post(
  '/upload',
  upload.single('file'), // 'file' is the field name for the uploaded file
  DataSetValidator.validateFileUpload,
  DataSetController.uploadDataSet
)

/**
 * @route   GET /api/v1/dataset/formats
 * @desc    Get list of supported file formats
 * @access  Public
 */
router.get('/formats', DataSetController.getSupportedFormats)

export { router as DataSetRoutes }
