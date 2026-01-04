import { Schema, model, Types } from 'mongoose'
import { ITrainingSample, ISection, IAnswerTemplate } from './TrainingSample.types'

// Section schema for structured answers
const SectionSchema = new Schema<ISection>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
)

// Answer template schema
const AnswerTemplateSchema = new Schema<IAnswerTemplate>(
  {
    greeting: {
      type: String,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    sections: {
      type: [SectionSchema],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
)

// Main Training Sample schema
const TrainingSampleSchema = new Schema<ITrainingSample>(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['qa', 'snippet', 'doc', 'faq', 'other'],
      default: 'qa',
      index: true,
    },
    answerTemplate: {
      type: AnswerTemplateSchema,
      required: true,
    },
    codeSnippet: {
      type: String,
      default: null,
    },
    // Vector embedding for semantic search
    embedding: {
      type: [Number],
      required: true,
      // Note: For MongoDB Atlas Vector Search, add vector index in MongoDB
      // db.createIndex({ "embedding": "vector" })
    },
    filePath: {
      type: String,
      default: null,
    },
    fileMimeType: {
      type: String,
      default: null,
    },
    fileSizeInBytes: {
      type: Number,
      default: null,
    },
    sourceType: {
      type: String,
      enum: ['manual', 'dataset'],
      default: 'manual',
      index: true,
    },
    datasetId: {
      type: Types.ObjectId,
      ref: 'TrainingDataset',
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    language: {
      type: String,
      default: 'en',
      trim: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// Compound indices for common queries
TrainingSampleSchema.index({ userId: 1, isActive: 1 })
TrainingSampleSchema.index({ userId: 1, type: 1 })
TrainingSampleSchema.index({ userId: 1, sourceType: 1 })
TrainingSampleSchema.index({ tags: 1, userId: 1 })

export const TrainingSample = model<ITrainingSample>('TrainingSample', TrainingSampleSchema)
