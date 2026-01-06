// Training Data Types

export interface Section {
    title: string
    content: string
}

export interface AnswerTemplate {
    greeting?: string
    answer: string
    sections?: Section[]
    suggestions?: string[]
}

export interface CreateTrainingSampleInput {
    question: string
    type?: 'qa' | 'snippet' | 'doc' | 'faq' | 'other'
    answerTemplate: AnswerTemplate
    codeSnippet?: string
    tags?: string[]
    language?: string
}

export interface UpdateTrainingSampleInput extends Partial<CreateTrainingSampleInput> {
    isActive?: boolean
}

export interface TrainingSampleFilters {
    type?: string
    tags?: string[]
    isActive?: boolean
    sourceType?: 'manual' | 'dataset'
    language?: string
}

export interface VectorSearchInput {
    query: string
    topK?: number
    filters?: TrainingSampleFilters
}

export interface VectorSearchResult {
    sample: any
    similarity: number
}

export interface DatasetUploadResult {
    success: boolean
    dataset?: any
    error?: string
}

export interface DatasetProcessResult {
    success: boolean
    samplesCreated: number
    error?: string
}

export interface ParsedRow {
    question: string
    answer: string
    type?: string
    tags?: string[]
    codeSnippet?: string
}

export interface ParseResult {
    success: boolean
    data: ParsedRow[]
    error?: string
    totalRows: number
}

export interface TrainingSampleStats {
    total: number
    byType: Record<string, number>
    bySource: Record<string, number>
    activeCount: number
}

export interface DatasetStats {
    total: number
    byStatus: Record<string, number>
    byType: Record<string, number>
    totalSamples: number
}
