import { Schema, model } from 'mongoose'
import { ITrainingSample } from './DataSet.type'

const SectionSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
)

const AnswerTemplateSchema = new Schema(
  {
    greeting: { type: String },
    answer: { type: String, required: true },
    sections: { type: [SectionSchema], default: [] },
    suggestions: { type: [String], default: [] },
  },
  { _id: false }
)

const TrainingSampleSchema = new Schema<ITrainingSample>(
  {
    question: { type: String, required: true },
    type: {
      type: String,
      enum: ['qa', 'snippet', 'doc', 'faq', 'documentation', 'conversation', 'code', 'other'],
      default: 'qa',
    },
    answerTemplate: { type: AnswerTemplateSchema, required: true },
    codeSnippet: { type: String },

    embedding: {
      type: [Number],
      index: true,
      required: true,
    },

    filePath: { type: String },
    fileMimeType: { type: String },
    fileSizeInBytes: { type: Number },

    sourceType: {
      type: String,
      enum: ['manual', 'dataset'],
      default: 'manual',
    },
    datasetId: { type: Schema.Types.ObjectId, ref: 'DatasetFile' },

    tags: [{ type: String }],
    language: { type: String, default: 'en' },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const TrainingSample = model<ITrainingSample>('TrainingSample', TrainingSampleSchema)
