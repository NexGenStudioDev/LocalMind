import { Document, Types } from 'mongoose'

export interface ISection {
  title: string
  content: string
}

export interface IAnswerTemplate {
  greeting?: string
  answer: string
  sections: ISection[]
  suggestions: string[]
}

export interface IAgent {
  provider: string
  model: string
  isPaid: boolean
}

export interface ITrainingSample extends Document {
  userId: Types.ObjectId
  question: string
  type: 'qa' | 'snippet' | 'doc' | 'faq' | 'other'
  answerTemplate: IAnswerTemplate
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

export interface ITrainingDataset extends Document {
  userId: Types.ObjectId
  fileName: string
  filePath: string
  fileMimeType: string
  fileSizeInBytes: number
  totalSamples: number
  processedSamples: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}

export interface IEmbeddingResponse {
  embedding: number[]
  modelUsed: string
}

export interface IVectorSearchRequest {
  query: string
  topK?: number
  filters?: {
    type?: string[]
    tags?: string[]
    sourceType?: 'manual' | 'dataset'
    isActive?: boolean
    language?: string
  }
}

export interface IVectorSearchResult {
  samples: ITrainingSample[]
  totalResults: number
  searchTime: number
}
