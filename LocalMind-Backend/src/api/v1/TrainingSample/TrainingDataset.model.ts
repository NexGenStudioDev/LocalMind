import { Schema, Document, Types, model } from 'mongoose'

export interface ITrainingDataset extends Document {
  userId: Types.ObjectId
  name: string
  description?: string
  fileName: string
  fileType: 'csv' | 'json' | 'markdown' | 'text'
  fileSize: number // in bytes
  sampleCount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  errorMessage?: string
  importedAt?: Date
  isActive: boolean
  metadata?: {
    headers?: string[]
    delimiter?: string
    encoding?: string
  }
  createdAt: Date
  updatedAt: Date
}

const TrainingDatasetSchema = new Schema<ITrainingDataset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    fileName: {
      type: String,
      required: true,
      index: true,
    },
    fileType: {
      type: String,
      enum: ['csv', 'json', 'markdown', 'text'],
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    sampleCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    errorMessage: String,
    importedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      headers: [String],
      delimiter: String,
      encoding: String,
    },
  },
  {
    timestamps: true,
  }
)

// Compound indices for common queries
TrainingDatasetSchema.index({ userId: 1, status: 1 })
TrainingDatasetSchema.index({ userId: 1, isActive: 1 })
TrainingDatasetSchema.index({ userId: 1, createdAt: -1 })

export const TrainingDataset = model<ITrainingDataset>('TrainingDataset', TrainingDatasetSchema)
