import { Types } from 'mongoose'
import { DatasetFile, IDatasetFile } from './datasetFile.model'
import FileParserService from './fileParser.service'
import TrainingSampleService from './trainingSample.service'
import * as fs from 'fs'
import * as path from 'path'

interface UploadResult {
    success: boolean
    dataset?: IDatasetFile
    error?: string
}

interface ProcessResult {
    success: boolean
    samplesCreated: number
    error?: string
}

class DatasetFileService {
    private uploadDir: string = path.join(process.cwd(), 'uploads', 'datasets')

    constructor() {
        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true })
        }
    }

    /**
     * Create a new dataset file record after upload
     */
    async createDatasetRecord(
        originalName: string,
        storedName: string,
        filePath: string,
        mimeType: string,
        sizeInBytes: number
    ): Promise<UploadResult> {
        try {
            const fileType = FileParserService.getFileTypeFromExtension(originalName)

            if (fileType === 'unknown') {
                return {
                    success: false,
                    error: `Unsupported file type: ${path.extname(originalName)}`
                }
            }

            const dataset = new DatasetFile({
                originalName,
                storedName,
                filePath,
                mimeType,
                sizeInBytes,
                fileType,
                status: 'uploaded'
            })

            await dataset.save()

            return {
                success: true,
                dataset
            }
        } catch (error: any) {
            return {
                success: false,
                error: `Failed to create dataset record: ${error.message}`
            }
        }
    }

    /**
     * Process a dataset file and generate training samples
     */
    async processDataset(datasetId: string): Promise<ProcessResult> {
        try {
            const dataset = await DatasetFile.findById(datasetId)
            if (!dataset) {
                return { success: false, samplesCreated: 0, error: 'Dataset not found' }
            }

            // Update status to processing
            dataset.status = 'processing'
            await dataset.save()

            // Parse the file
            const parseResult = await FileParserService.parseFile(
                dataset.filePath,
                dataset.fileType
            )

            if (!parseResult.success) {
                dataset.status = 'failed'
                dataset.errorMessage = parseResult.error
                await dataset.save()
                return { success: false, samplesCreated: 0, error: parseResult.error }
            }

            // Create training samples from parsed data
            const sampleInputs = parseResult.data.map(row => ({
                question: row.question,
                type: (row.type as 'qa' | 'snippet' | 'doc' | 'faq' | 'other') || 'qa',
                answerTemplate: {
                    answer: row.answer,
                    sections: [],
                    suggestions: []
                },
                codeSnippet: row.codeSnippet,
                tags: row.tags || [],
                sourceType: 'dataset' as const,
                datasetId: dataset._id.toString(),
                filePath: dataset.filePath,
                fileMimeType: dataset.mimeType,
                fileSizeInBytes: dataset.sizeInBytes
            }))

            const samples = await TrainingSampleService.createBulk(sampleInputs)

            // Update dataset status
            dataset.status = 'completed'
            dataset.processedAt = new Date()
            dataset.totalSamplesGenerated = samples.length
            await dataset.save()

            return {
                success: true,
                samplesCreated: samples.length
            }
        } catch (error: any) {
            // Update status to failed
            await DatasetFile.findByIdAndUpdate(datasetId, {
                status: 'failed',
                errorMessage: error.message
            })

            return {
                success: false,
                samplesCreated: 0,
                error: error.message
            }
        }
    }

    /**
     * Get all dataset files with optional status filter
     */
    async getAll(status?: string): Promise<IDatasetFile[]> {
        try {
            const query = status ? { status } : {}
            return await DatasetFile.find(query).sort({ createdAt: -1 }).lean()
        } catch (error: any) {
            throw new Error(`Failed to fetch datasets: ${error.message}`)
        }
    }

    /**
     * Get a single dataset by ID
     */
    async getById(id: string): Promise<IDatasetFile | null> {
        try {
            return await DatasetFile.findById(id).lean()
        } catch (error: any) {
            throw new Error(`Failed to fetch dataset: ${error.message}`)
        }
    }

    /**
     * Delete a dataset and its associated training samples
     */
    async delete(id: string, deleteFile: boolean = true): Promise<boolean> {
        try {
            const dataset = await DatasetFile.findById(id)
            if (!dataset) return false

            // Delete the physical file if requested
            if (deleteFile && fs.existsSync(dataset.filePath)) {
                fs.unlinkSync(dataset.filePath)
            }

            // Soft delete associated training samples
            const { TrainingSample } = await import('./trainingSample.model')
            await TrainingSample.updateMany(
                { datasetId: new Types.ObjectId(id) },
                { $set: { isActive: false } }
            )

            // Delete the dataset record
            await DatasetFile.findByIdAndDelete(id)

            return true
        } catch (error: any) {
            throw new Error(`Failed to delete dataset: ${error.message}`)
        }
    }

    /**
     * Get dataset statistics
     */
    async getStats(): Promise<{
        total: number
        byStatus: Record<string, number>
        byType: Record<string, number>
        totalSamples: number
    }> {
        try {
            const [total, byStatus, byType, totalSamplesAgg] = await Promise.all([
                DatasetFile.countDocuments(),
                DatasetFile.aggregate([
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ]),
                DatasetFile.aggregate([
                    { $group: { _id: '$fileType', count: { $sum: 1 } } }
                ]),
                DatasetFile.aggregate([
                    { $group: { _id: null, total: { $sum: '$totalSamplesGenerated' } } }
                ])
            ])

            return {
                total,
                byStatus: Object.fromEntries(byStatus.map(s => [s._id, s.count])),
                byType: Object.fromEntries(byType.map(t => [t._id, t.count])),
                totalSamples: totalSamplesAgg[0]?.total || 0
            }
        } catch (error: any) {
            throw new Error(`Failed to fetch stats: ${error.message}`)
        }
    }

    /**
     * Preview parsed content before processing
     */
    async previewDataset(datasetId: string, limit: number = 10): Promise<{
        success: boolean
        preview: any[]
        totalRows: number
        error?: string
    }> {
        try {
            const dataset = await DatasetFile.findById(datasetId)
            if (!dataset) {
                return { success: false, preview: [], totalRows: 0, error: 'Dataset not found' }
            }

            const parseResult = await FileParserService.parseFile(
                dataset.filePath,
                dataset.fileType
            )

            if (!parseResult.success) {
                return {
                    success: false,
                    preview: [],
                    totalRows: 0,
                    error: parseResult.error
                }
            }

            return {
                success: true,
                preview: parseResult.data.slice(0, limit),
                totalRows: parseResult.totalRows
            }
        } catch (error: any) {
            return {
                success: false,
                preview: [],
                totalRows: 0,
                error: error.message
            }
        }
    }
}

export default new DatasetFileService()
