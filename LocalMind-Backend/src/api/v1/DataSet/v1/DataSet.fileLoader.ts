import { CSVLoader } from '@langchain/community/document_loaders/fs/csv'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { Document } from '@langchain/core/documents'
import { FileFormat, UploadedFileMetadata } from './DataSet.type'
import * as fs from 'fs'
import * as path from 'path'

/**
 * File loader class to handle different file formats
 */
class FileLoaderUtils {
  /**
   * Detect file format from file extension or MIME type
   */
  public detectFileFormat(filename: string, mimeType?: string): FileFormat | null {
    const extension = path.extname(filename).toLowerCase().slice(1)

    const formatMap: Record<string, FileFormat> = {
      csv: FileFormat.CSV,
      xlsx: FileFormat.XLSX,
      xls: FileFormat.XLSX,
      tsv: FileFormat.TSV,
      json: FileFormat.JSON,
      pdf: FileFormat.PDF,
      txt: FileFormat.TXT,
    }

    // Try by extension first
    if (formatMap[extension]) {
      return formatMap[extension]
    }

    // Try by MIME type
    if (mimeType) {
      const mimeFormatMap: Record<string, FileFormat> = {
        'text/csv': FileFormat.CSV,
        'application/vnd.ms-excel': FileFormat.XLSX,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          FileFormat.XLSX,
        'text/tab-separated-values': FileFormat.TSV,
        'application/json': FileFormat.JSON,
        'application/pdf': FileFormat.PDF,
        'text/plain': FileFormat.TXT,
      }

      if (mimeFormatMap[mimeType]) {
        return mimeFormatMap[mimeType]
      }
    }

    return null
  }

  /**
   * Load documents from a CSV file
   */
  private async loadCSV(filePath: string): Promise<Document[]> {
    const loader = new CSVLoader(filePath)
    return await loader.load()
  }

  /**
   * Load documents from a PDF file
   */
  private async loadPDF(filePath: string): Promise<Document[]> {
    const loader = new PDFLoader(filePath, {
      splitPages: false, // Load entire PDF as one document
    })
    return await loader.load()
  }

  /**
   * Load documents from a TXT file
   */
  private async loadTXT(filePath: string): Promise<Document[]> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')

      // Split by double newlines to separate Q&A pairs or paragraphs
      const sections = fileContent
        .split(/\n\n+/)
        .filter((section) => section.trim().length > 0)

      if (sections.length === 0) {
        // If no double newlines, treat entire content as one document
        return [
          new Document({
            pageContent: fileContent,
            metadata: { source: filePath },
          }),
        ]
      }

      // Create a document for each section
      const documents = sections.map((section, index) => {
        return new Document({
          pageContent: section.trim(),
          metadata: { source: filePath, section: index },
        })
      })

      return documents
    } catch (error) {
      throw new Error(`Failed to load TXT file: ${error}`)
    }
  }

  /**
   * Load documents from a JSON file
   */
  private async loadJSON(filePath: string): Promise<Document[]> {
    try {
      // Read the JSON file
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const jsonData = JSON.parse(fileContent)

      // Check if it's an array of Q&A pairs
      if (Array.isArray(jsonData)) {
        // Convert array to documents
        const documents = jsonData.map((item, index) => {
          const pageContent = JSON.stringify(item)
          return new Document({
            pageContent,
            metadata: { source: filePath, row: index },
          })
        })
        return documents
      }

      // If it's a single object, wrap it in an array
      const pageContent = JSON.stringify(jsonData)
      return [
        new Document({
          pageContent,
          metadata: { source: filePath },
        }),
      ]
    } catch (error) {
      throw new Error(`Failed to parse JSON file: ${error}`)
    }
  }

  /**
   * Load documents from a TSV file
   */
  private async loadTSV(filePath: string): Promise<Document[]> {
    // TSV is similar to CSV but with tab delimiter
    const loader = new CSVLoader(filePath, {
      separator: '\t',
    })
    return await loader.load()
  }

  /**
   * Main method to load file based on format
   */
  public async loadFile(
    filePath: string,
    format: FileFormat
  ): Promise<Document[]> {
    // Validate file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    try {
      switch (format) {
        case FileFormat.CSV:
          return await this.loadCSV(filePath)

        case FileFormat.PDF:
          return await this.loadPDF(filePath)

        case FileFormat.TXT:
          return await this.loadTXT(filePath)

        case FileFormat.JSON:
          return await this.loadJSON(filePath)

        case FileFormat.TSV:
          return await this.loadTSV(filePath)

        case FileFormat.XLSX:
          // For Excel files, you'll need to convert to CSV first
          // or use a library like 'xlsx' to parse them
          throw new Error(
            'XLSX format not yet implemented. Please convert to CSV.'
          )

        default:
          throw new Error(`Unsupported file format: ${format}`)
      }
    } catch (error) {
      throw new Error(`Failed to load file: ${error}`)
    }
  }

  /**
   * Get file metadata
   */
  public getFileMetadata(filePath: string): UploadedFileMetadata {
    const stats = fs.statSync(filePath)
    const filename = path.basename(filePath)
    const format = this.detectFileFormat(filename)

    if (!format) {
      throw new Error(`Unable to detect file format for: ${filename}`)
    }

    return {
      originalName: filename,
      mimeType: this.getMimeType(format),
      size: stats.size,
      path: filePath,
      format,
    }
  }

  /**
   * Get MIME type from file format
   */
  private getMimeType(format: FileFormat): string {
    const mimeTypes: Record<FileFormat, string> = {
      [FileFormat.CSV]: 'text/csv',
      [FileFormat.XLSX]:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      [FileFormat.TSV]: 'text/tab-separated-values',
      [FileFormat.JSON]: 'application/json',
      [FileFormat.PDF]: 'application/pdf',
      [FileFormat.TXT]: 'text/plain',
    }

    return mimeTypes[format] || 'application/octet-stream'
  }
}

export default new FileLoaderUtils()
