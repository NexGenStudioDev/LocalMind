import { Request, Response } from 'express'
import { SendResponse } from '../../../utils/SendResponse.utils'
import TrainingSampleService from './trainingSample.service'
import DatasetFileService from './datasetFile.service'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

class TrainingDataController {
    // ==================== TRAINING SAMPLES ====================

    /**
     * Create a new training sample (manual entry)
     */
    async createSample(req: Request, res: Response): Promise<void> {
        try {
            const {
                question,
                type,
                answerTemplate,
                codeSnippet,
                tags,
                language
            } = req.body

            if (!question || !answerTemplate?.answer) {
                SendResponse.error(res, 'Question and answer are required', 400)
                return
            }

            const sample = await TrainingSampleService.create({
                question,
                type: type || 'qa',
                answerTemplate,
                codeSnippet,
                tags: tags || [],
                language: language || 'en',
                sourceType: 'manual'
            })

            SendResponse.success(res, 'Training sample created successfully', sample, 201)
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Get all training samples with filters
     */
    async getAllSamples(req: Request, res: Response): Promise<void> {
        try {
            const { type, sourceType, tags, isActive, language } = req.query

            const filters = {
                type: type as string,
                sourceType: sourceType as string,
                language: language as string,
                isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
                tags: tags ? (tags as string).split(',') : undefined
            }

            const samples = await TrainingSampleService.getAll(filters)
            SendResponse.success(res, 'Training samples fetched successfully', samples)
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Get a single training sample by ID
     */
    async getSampleById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const sample = await TrainingSampleService.getById(id)

            if (!sample) {
                SendResponse.error(res, 'Training sample not found', 404)
                return
            }

            SendResponse.success(res, 'Training sample fetched successfully', sample)
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Update a training sample
     */
    async updateSample(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const updateData = req.body

            const sample = await TrainingSampleService.update(id, updateData)

            if (!sample) {
                SendResponse.error(res, 'Training sample not found', 404)
                return
            }

            SendResponse.success(res, 'Training sample updated successfully', sample)
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Delete a training sample (soft delete)
     */
    async deleteSample(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const { hard } = req.query

            let result
            if (hard === 'true') {
                result = await TrainingSampleService.hardDelete(id)
            } else {
                result = await TrainingSampleService.softDelete(id)
            }

            if (!result) {
                SendResponse.error(res, 'Training sample not found', 404)
                return
            }

            SendResponse.success(res, 'Training sample deleted successfully', { deleted: true })
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Vector search for training samples
     */
    async searchSamples(req: Request, res: Response): Promise<void> {
        try {
            const { query, topK, filters } = req.body

            if (!query) {
                SendResponse.error(res, 'Query is required', 400)
                return
            }

            const results = await TrainingSampleService.vectorSearch({
                query,
                topK: topK || 5,
                filters: filters || {}
            })

            SendResponse.success(res, 'Search completed successfully', results)
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Get training sample statistics
     */
    async getSampleStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await TrainingSampleService.getStats()
            SendResponse.success(res, 'Stats fetched successfully', stats)
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    // ==================== DATASET FILES ====================

    /**
     * Upload a dataset file
     */
    async uploadDataset(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                SendResponse.error(res, 'No file uploaded', 400)
                return
            }

            const { originalname, filename, path: filePath, mimetype, size } = req.file

            const result = await DatasetFileService.createDatasetRecord(
                originalname,
                filename,
                filePath,
                mimetype,
                size
            )

            if (!result.success) {
                SendResponse.error(res, result.error || 'Failed to upload dataset', 400)
                return
            }

            SendResponse.success(res, 'Dataset uploaded successfully', result.dataset, 201)
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Get all datasets
     */
    async getAllDatasets(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.query
            const datasets = await DatasetFileService.getAll(status as string)
            SendResponse.success(res, 'Datasets fetched successfully', datasets)
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Get a single dataset by ID
     */
    async getDatasetById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const dataset = await DatasetFileService.getById(id)

            if (!dataset) {
                SendResponse.error(res, 'Dataset not found', 404)
                return
            }

            SendResponse.success(res, 'Dataset fetched successfully', dataset)
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Process a dataset file
     */
    async processDataset(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params

            const result = await DatasetFileService.processDataset(id)

            if (!result.success) {
                SendResponse.error(res, result.error || 'Failed to process dataset', 400)
                return
            }

            SendResponse.success(res, 'Dataset processed successfully', {
                samplesCreated: result.samplesCreated
            })
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Preview dataset content before processing
     */
    async previewDataset(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const { limit } = req.query

            const result = await DatasetFileService.previewDataset(
                id,
                limit ? parseInt(limit as string) : 10
            )

            if (!result.success) {
                SendResponse.error(res, result.error || 'Failed to preview dataset', 400)
                return
            }

            SendResponse.success(res, 'Dataset preview fetched successfully', {
                preview: result.preview,
                totalRows: result.totalRows
            })
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Delete a dataset
     */
    async deleteDataset(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const { deleteFile } = req.query

            const result = await DatasetFileService.delete(id, deleteFile !== 'false')

            if (!result) {
                SendResponse.error(res, 'Dataset not found', 404)
                return
            }

            SendResponse.success(res, 'Dataset deleted successfully', { deleted: true })
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }

    /**
     * Get dataset statistics
     */
    async getDatasetStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await DatasetFileService.getStats()
            SendResponse.success(res, 'Dataset stats fetched successfully', stats)
        } catch (error: any) {
            SendResponse.error(res, error.message, 500, error)
        }
    }
}

export default new TrainingDataController()
