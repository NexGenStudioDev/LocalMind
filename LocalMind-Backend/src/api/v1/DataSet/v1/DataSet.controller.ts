import { Request, Response } from 'express'
import path from 'path'
import * as fs from 'fs'
import { SendResponse } from '../../../../utils/SendResponse.utils'
import DataSetService from './DataSet.service'
import FileLoaderUtils from './DataSet.fileLoader'
import { FileFormat } from './DataSet.type'

class DataSetController {
  /**
   * Upload and process dataset with support for multiple file formats
   * Supports: CSV, PDF, TXT, JSON, TSV
   */
  public async uploadDataSet(req: Request, res: Response): Promise<void> {
    try {
      // Check if file was uploaded
      if (!req.file) {
        SendResponse.error(res, 'No file uploaded', 400)
        return
      }

      const uploadedFile = req.file
      const filePath = uploadedFile.path

      // Detect file format
      const fileFormat = FileLoaderUtils.detectFileFormat(
        uploadedFile.originalname,
        uploadedFile.mimetype
      )

      if (!fileFormat) {
        // Clean up uploaded file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
        SendResponse.error(
          res,
          'Unsupported file format. Supported formats: CSV, PDF, TXT, JSON, TSV',
          400
        )
        return
      }

      // Load documents from file
      const documents = await FileLoaderUtils.loadFile(filePath, fileFormat)

      if (!documents || documents.length === 0) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
        SendResponse.error(res, 'No data found in the uploaded file', 400)
        return
      }

      // Process the dataset
      const processedData = await DataSetService.Prepate_DataSet(documents)

      // Clean up uploaded file after processing
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      SendResponse.success(
        res,
        `Dataset uploaded and processed successfully (Format: ${fileFormat.toUpperCase()})`,
        JSON.parse(processedData)
      )
    } catch (error: any) {
      // Clean up uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      SendResponse.error(
        res,
        'Failed to upload and process dataset',
        500,
        error.message
      )
    }
  }

  /**
   * Get list of supported file formats
   */
  public async getSupportedFormats(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const formats = Object.values(FileFormat)
      SendResponse.success(res, 'Supported file formats', {
        formats,
        description: {
          csv: 'Comma-separated values file',
          xlsx: 'Excel spreadsheet (not yet fully supported)',
          tsv: 'Tab-separated values file',
          json: 'JSON file with Q&A pairs',
          pdf: 'PDF document',
          txt: 'Plain text file',
        },
      })
    } catch (error: any) {
      SendResponse.error(res, 'Failed to get supported formats', 500, error)
    }
  }
}

export default new DataSetController()
