import { Request, Response } from 'express'
import DatasetFileService from './DatasetFile.service'
import { SendResponse } from '../../../../utils/SendResponse.utils'

/**
 * DatasetFileController - Handles file upload and processing requests.
 */
class DatasetFileController {
  /**
   * POST /api/v1/training-datasets/upload
   * Receives a file, saves metadata, and returns the file record.
   */
  public async upload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        SendResponse.error(res, 'No file uploaded', 400)
        return
      }

      const userId = req.user?._id?.toString()
      if (!userId) {
        SendResponse.error(res, 'User not authenticated', 401)
        return
      }

      const fileRecord = await DatasetFileService.saveFileMetadata(userId, req.file)

      SendResponse.success(
        res,
        'File uploaded successfully. You can now trigger processing.',
        fileRecord,
        201
      )
    } catch (error: unknown) {
      SendResponse.error(
        res,
        'File upload failed',
        500,
        error instanceof Error ? error.message : String(error)
      )
    }
  }

  /**
   * POST /api/v1/training-datasets/:id/process
   * Triggers the background processing of an uploaded file.
   */
  public async process(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      if (!id) {
        SendResponse.error(res, 'File ID is required', 400)
        return
      }

      // Start processing in the background
      DatasetFileService.processFile(id).catch(err => {
        console.error(`Background processing failed for file ${id}:`, err)
      })

      SendResponse.success(res, 'Processing started in the background', { fileId: id })
    } catch (error: unknown) {
      SendResponse.error(
        res,
        'Failed to start processing',
        500,
        error instanceof Error ? error.message : String(error)
      )
    }
  }
}

export default new DatasetFileController()
