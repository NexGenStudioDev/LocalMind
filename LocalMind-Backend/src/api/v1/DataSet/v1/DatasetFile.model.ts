import { Schema, model } from 'mongoose'
import { IDatasetFile } from './DataSet.type'

const DatasetFileSchema = new Schema<IDatasetFile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    rowCount: {
      type: Number,
    },
    error: {
      type: String,
    },
  },
  { timestamps: true }
)

export const DatasetFile = model<IDatasetFile>('DatasetFile', DatasetFileSchema)
