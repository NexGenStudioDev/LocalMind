import { Schema, model, Types, Document } from 'mongoose'

// Section Schema for structured answer sections
const SectionSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true }
    },
    { _id: false }
)

// Answer Template Schema for structured responses
const AnswerTemplateSchema = new Schema(
    {
        greeting: { type: String },
        answer: { type: String, required: true },
        sections: { type: [SectionSchema], default: [] },
        suggestions: { type: [String], default: [] }
    },
    { _id: false }
)

// Training Sample Interface
export interface ITrainingSample extends Document {
    question: string
    type: 'qa' | 'snippet' | 'doc' | 'faq' | 'other'
    answerTemplate: {
        greeting?: string
        answer: string
        sections?: { title: string; content: string }[]
        suggestions?: string[]
    }
    codeSnippet?: string
    embedding: number[]
    filePath?: string
    fileMimeType?: string
    fileSizeInBytes?: number
    sourceType: 'manual' | 'dataset'
    datasetId?: Types.ObjectId
    tags: string[]
    language: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

// Training Sample Schema
const TrainingSampleSchema = new Schema<ITrainingSample>(
    {
        question: { type: String, required: true, index: true },
        type: {
            type: String,
            enum: ['qa', 'snippet', 'doc', 'faq', 'other'],
            default: 'qa',
            index: true
        },
        answerTemplate: { type: AnswerTemplateSchema, required: true },
        codeSnippet: { type: String },

        // Vector embedding for semantic search
        embedding: {
            type: [Number],
            required: true,
            index: true
        },

        // File metadata (for dataset-sourced samples)
        filePath: { type: String },
        fileMimeType: { type: String },
        fileSizeInBytes: { type: Number },

        // Source tracking
        sourceType: {
            type: String,
            enum: ['manual', 'dataset'],
            default: 'manual',
            index: true
        },
        datasetId: { type: Schema.Types.ObjectId, ref: 'DatasetFile' },

        // Organization
        tags: { type: [String], default: [], index: true },
        language: { type: String, default: 'en' },

        // Status
        isActive: { type: Boolean, default: true, index: true }
    },
    { timestamps: true }
)

// Create compound indexes for common queries
TrainingSampleSchema.index({ type: 1, isActive: 1 })
TrainingSampleSchema.index({ sourceType: 1, isActive: 1 })
TrainingSampleSchema.index({ tags: 1, isActive: 1 })

export const TrainingSample = model<ITrainingSample>('TrainingSample', TrainingSampleSchema)
