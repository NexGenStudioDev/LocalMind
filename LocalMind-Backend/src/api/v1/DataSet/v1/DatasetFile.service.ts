import { DatasetFile } from './DatasetFile.model'
import { TrainingSample } from './TrainingSample.model'
import { IDatasetFile } from './DataSet.type'
import { EmbeddingUtils } from './Embedding.utils'
import fs from 'fs'
import path from 'path'
// @ts-expect-error - csv-parser does not have type definitions
import csv from 'csv-parser'
import * as xlsx from 'xlsx'
import pdf from 'pdf-parse'

/**
 * DatasetFileService - Manages the lifecycle of uploaded dataset files.
 * This includes saving metadata, parsing content, and generating training samples.
 */
class DatasetFileService {
  /**
   * Saves the metadata of an uploaded file to the database.
   */
  public async saveFileMetadata(userId: string, file: Express.Multer.File): Promise<IDatasetFile> {
    return await DatasetFile.create({
      userId,
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      status: 'pending',
    })
  }

  /**
   * Processes an uploaded file based on its extension and creates TrainingSample records.
   */
  public async processFile(fileId: string): Promise<void> {
    const fileRecord = await DatasetFile.findById(fileId)
    if (!fileRecord) throw new Error('File record not found')

    try {
      await DatasetFile.findByIdAndUpdate(fileId, { status: 'processing' })

      const ext = path.extname(fileRecord.originalName).toLowerCase()
      let samples: AsyncIterable<Record<string, unknown>>

      // Route to the appropriate parser based on file extension
      switch (ext) {
        case '.json':
          samples = this.parseJsonGenerator(fileRecord.path)
          break
        case '.csv':
          samples = this.parseCsvGenerator(fileRecord.path)
          break
        case '.txt':
        case '.md':
          samples = this.parseTextGenerator(fileRecord.path)
          break
        case '.xlsx':
          samples = this.parseExcelGenerator(fileRecord.path)
          break
        case '.pdf':
          samples = this.parsePdfGenerator(fileRecord.path)
          break
        default:
          throw new Error(`No parser implemented for ${ext}`)
      }

      // Create TrainingSample records for each parsed item
      let successCount = 0
      for await (const item of samples) {
        try {
          const question =
            (item.question as string) || (item.Question as string) || (item.prompt as string)
          const answer =
            (item.answer as string) || (item.Answer as string) || (item.response as string)

          if (!question || !answer) continue

          const embedding = await EmbeddingUtils.generateEmbedding(question)
          await TrainingSample.create({
            userId: fileRecord.userId,
            question,
            type: (item.type as string) || 'qa',
            answerTemplate: {
              answer,
              sections: [],
              suggestions: [],
            },
            embedding,
            sourceType: 'dataset',
            datasetId: fileRecord._id,
            tags: Array.isArray(item.tags) ? item.tags : [],
          })
          successCount++
        } catch (err) {
          console.error('Failed to process sample item:', err)
        }
      }

      await DatasetFile.findByIdAndUpdate(fileId, {
        status: 'completed',
        rowCount: successCount,
      })
    } catch (error: unknown) {
      console.error('File processing error:', error)
      await DatasetFile.findByIdAndUpdate(fileId, {
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  private async *parseJsonGenerator(filePath: string): AsyncGenerator<Record<string, unknown>> {
    const content = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)
    if (Array.isArray(data)) {
      for (const item of data) yield item
    } else {
      yield data
    }
  }

  private async *parseCsvGenerator(filePath: string): AsyncGenerator<Record<string, unknown>> {
    const stream = fs.createReadStream(filePath).pipe(csv())
    for await (const data of stream) {
      yield data as Record<string, unknown>
    }
  }

  private async *parseTextGenerator(filePath: string): AsyncGenerator<Record<string, unknown>> {
    const content = fs.readFileSync(filePath, 'utf-8')
    const chunks = content.split(/\n\s*\n/).filter(c => c.trim().length > 0)
    for (const chunk of chunks) {
      yield {
        question: chunk.substring(0, 100) + '...',
        answer: chunk,
      }
    }
  }

  private async *parseExcelGenerator(filePath: string): AsyncGenerator<Record<string, unknown>> {
    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) return
    const worksheet = workbook.Sheets[sheetName]
    if (!worksheet) return
    const data = xlsx.utils.sheet_to_json(worksheet) as Record<string, unknown>[]
    for (const item of data) yield item
  }

  private async *parsePdfGenerator(filePath: string): AsyncGenerator<Record<string, unknown>> {
    const dataBuffer = fs.readFileSync(filePath)
    // @ts-expect-error - pdf-parse is not correctly typed for ESM
    const data = await (pdf as (buffer: Buffer) => Promise<{ text: string }>)(dataBuffer)
    const chunks = data.text.split(/\n\s*\n/).filter((c: string) => c.trim().length > 0)
    for (const chunk of chunks) {
      yield {
        question: chunk.substring(0, 100) + '...',
        answer: chunk,
      }
    }
  }
}

export default new DatasetFileService()
