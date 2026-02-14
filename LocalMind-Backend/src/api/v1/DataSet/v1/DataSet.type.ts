/**
 * Supported file formats for dataset upload
 */
export enum FileFormat {
  CSV = 'csv',
  XLSX = 'xlsx',
  TSV = 'tsv',
  JSON = 'json',
  PDF = 'pdf',
  TXT = 'txt',
}

/**
 * Interface for question-answer pair extracted from dataset
 */
export interface QuestionAnswerPair {
  question: string
  answer: string
}

/**
 * Interface for validation error
 */
export interface ValidationError {
  row?: number
  fieldName: string
  error_message: string
}

/**
 * Interface for dataset processing result
 */
export interface DataSetProcessingResult {
  success: boolean
  data?: QuestionAnswerPair[]
  errors?: ValidationError[]
}

/**
 * Interface for file upload metadata
 */
export interface UploadedFileMetadata {
  originalName: string
  mimeType: string
  size: number
  path: string
  format: FileFormat
}
