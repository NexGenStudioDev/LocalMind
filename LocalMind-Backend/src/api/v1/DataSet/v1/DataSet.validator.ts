import { Request, Response, NextFunction } from 'express'
import { SendResponse } from '../../../../utils/SendResponse.utils'
import { FileFormat } from './DataSet.type'

/**
 * File upload validation middleware
 */
class DataSetValidator {
  /**
   * Allowed file extensions
   */
  private readonly ALLOWED_EXTENSIONS = ['.csv', '.pdf', '.txt', '.json', '.tsv']

  /**
   * Allowed MIME types
   */
  private readonly ALLOWED_MIME_TYPES = [
    'text/csv',
    'application/pdf',
    'text/plain',
    'application/json',
    'text/tab-separated-values',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  /**
   * Maximum file size (10MB)
   */
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

  /**
   * Validate uploaded file
   */
  public validateFileUpload = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      // Check if file exists in request
      if (!req.file) {
        SendResponse.error(res, 'No file uploaded', 400)
        return
      }

      const file = req.file

      // Validate file size
      if (file.size > this.MAX_FILE_SIZE) {
        SendResponse.error(
          res,
          `File size exceeds maximum limit of ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`,
          400
        )
        return
      }

      // Validate file size (minimum)
      if (file.size === 0) {
        SendResponse.error(res, 'Uploaded file is empty', 400)
        return
      }

      // Validate file extension
      const fileExtension = file.originalname
        .toLowerCase()
        .substring(file.originalname.lastIndexOf('.'))

      if (!this.ALLOWED_EXTENSIONS.includes(fileExtension)) {
        SendResponse.error(
          res,
          `Invalid file extension. Allowed extensions: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
          400
        )
        return
      }

      // Validate MIME type
      if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        SendResponse.error(
          res,
          `Invalid file type. Allowed types: ${this.ALLOWED_MIME_TYPES.join(', ')}`,
          400
        )
        return
      }

      // All validations passed
      next()
    } catch (error: any) {
      SendResponse.error(res, 'File validation failed', 400, error.message)
    }
  }

  /**
   * Validate file format parameter
   */
  public validateFileFormat = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const { format } = req.query

    if (format && !Object.values(FileFormat).includes(format as FileFormat)) {
      SendResponse.error(
        res,
        `Invalid format. Supported formats: ${Object.values(FileFormat).join(', ')}`,
        400
      )
      return
    }

    next()
  }
}

export default new DataSetValidator()
