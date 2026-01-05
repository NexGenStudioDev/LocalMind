import { Schema, model, Document } from 'mongoose'

// Dataset File Interface
export interface IDatasetFile extends Document {
    originalName: string
    storedName: string
    filePath: string
    mimeType: string
    sizeInBytes: number
    fileType: 'pdf' | 'csv' | 'excel' | 'json' | 'txt' | 'md'
    status: 'uploaded' | 'processing' | 'completed' | 'failed'
    processedAt?: Date
    totalSamplesGenerated: number
    errorMessage?: string
    metadata: Record<string, unknown>
    createdAt: Date
    updatedAt: Date
}

// Dataset File Schema
const DatasetFileSchema = new Schema<IDatasetFile>(
    {
        originalName: { type: String, required: true },
        storedName: { type: String, required: true, unique: true },
        filePath: { type: String, required: true },
        mimeType: { type: String, required: true },
        sizeInBytes: { type: Number, required: true },
        fileType: {
            type: String,
            enum: ['pdf', 'csv', 'excel', 'json', 'txt', 'md'],
            required: true,
            index: true
        },
        status: {
            type: String,
            enum: ['uploaded', 'processing', 'completed', 'failed'],
            default: 'uploaded',
            index: true
        },
        processedAt: { type: Date },
        totalSamplesGenerated: { type: Number, default: 0 },
        errorMessage: { type: String },
        metadata: { type: Schema.Types.Mixed, default: {} }
    },
    { timestamps: true }
)

// Indexes for common queries
DatasetFileSchema.index({ status: 1, createdAt: -1 })
DatasetFileSchema.index({ fileType: 1, status: 1 })

export const DatasetFile = model<IDatasetFile>('DatasetFile', DatasetFileSchema)
