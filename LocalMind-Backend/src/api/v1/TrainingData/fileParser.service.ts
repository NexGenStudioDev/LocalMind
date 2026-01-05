import { CSVLoader } from '@langchain/community/document_loaders/fs/csv'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

interface ParsedRow {
    question: string
    answer: string
    type?: string
    tags?: string[]
    codeSnippet?: string
}

interface ParseResult {
    success: boolean
    data: ParsedRow[]
    error?: string
    totalRows: number
}

class FileParserService {
    /**
     * Parse file based on its type
     */
    async parseFile(filePath: string, fileType: string): Promise<ParseResult> {
        try {
            switch (fileType.toLowerCase()) {
                case 'csv':
                    return await this.parseCSV(filePath)
                case 'excel':
                case 'xlsx':
                    return await this.parseExcel(filePath)
                case 'json':
                    return await this.parseJSON(filePath)
                case 'txt':
                    return await this.parseTXT(filePath)
                case 'md':
                    return await this.parseMarkdown(filePath)
                case 'pdf':
                    return await this.parsePDF(filePath)
                default:
                    return {
                        success: false,
                        data: [],
                        error: `Unsupported file type: ${fileType}`,
                        totalRows: 0
                    }
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                error: error.message,
                totalRows: 0
            }
        }
    }

    /**
     * Parse CSV file
     */
    async parseCSV(filePath: string): Promise<ParseResult> {
        try {
            const loader = new CSVLoader(filePath)
            const documents = await loader.load()

            const data: ParsedRow[] = documents.map(doc => {
                const content = doc.pageContent
                const lines = content.split('\n')
                const parsed: Record<string, string> = {}

                lines.forEach(line => {
                    const [key, ...valueParts] = line.split(':')
                    if (key && valueParts.length) {
                        parsed[key.trim().toLowerCase()] = valueParts.join(':').trim()
                    }
                })

                return {
                    question: parsed.question || parsed.q || content.substring(0, 100),
                    answer: parsed.answer || parsed.a || content,
                    type: parsed.type || 'qa',
                    tags: parsed.tags ? parsed.tags.split(',').map(t => t.trim()) : [],
                    codeSnippet: parsed.code || parsed.snippet
                }
            })

            return {
                success: true,
                data,
                totalRows: data.length
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                error: `Failed to parse CSV: ${error.message}`,
                totalRows: 0
            }
        }
    }

    /**
     * Parse Excel file
     */
    async parseExcel(filePath: string): Promise<ParseResult> {
        try {
            const workbook = XLSX.readFile(filePath)
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[]

            const data: ParsedRow[] = jsonData.map(row => ({
                question: row.question || row.Question || row.Q || '',
                answer: row.answer || row.Answer || row.A || '',
                type: row.type || row.Type || 'qa',
                tags: row.tags ? String(row.tags).split(',').map(t => t.trim()) : [],
                codeSnippet: row.code || row.Code || row.snippet || row.Snippet
            })).filter(row => row.question && row.answer)

            return {
                success: true,
                data,
                totalRows: data.length
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                error: `Failed to parse Excel: ${error.message}`,
                totalRows: 0
            }
        }
    }

    /**
     * Parse JSON file
     */
    async parseJSON(filePath: string): Promise<ParseResult> {
        try {
            const content = fs.readFileSync(filePath, 'utf-8')
            const jsonData = JSON.parse(content)

            // Support both array and object with data property
            const items = Array.isArray(jsonData) ? jsonData : (jsonData.data || jsonData.items || [jsonData])

            const data: ParsedRow[] = items.map((item: any) => ({
                question: item.question || item.q || item.query || '',
                answer: item.answer || item.a || item.response || '',
                type: item.type || 'qa',
                tags: item.tags || [],
                codeSnippet: item.code || item.codeSnippet || item.snippet
            })).filter((row: ParsedRow) => row.question && row.answer)

            return {
                success: true,
                data,
                totalRows: data.length
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                error: `Failed to parse JSON: ${error.message}`,
                totalRows: 0
            }
        }
    }

    /**
     * Parse TXT file (Q&A pairs separated by blank lines)
     */
    async parseTXT(filePath: string): Promise<ParseResult> {
        try {
            const loader = new TextLoader(filePath)
            const documents = await loader.load()
            const content = documents[0]?.pageContent || ''

            // Split by double newlines for Q&A pairs
            const blocks = content.split(/\n\n+/).filter(b => b.trim())
            const data: ParsedRow[] = []

            for (let i = 0; i < blocks.length; i += 2) {
                const question = blocks[i]?.replace(/^Q:\s*/i, '').trim()
                const answer = blocks[i + 1]?.replace(/^A:\s*/i, '').trim()

                if (question && answer) {
                    data.push({
                        question,
                        answer,
                        type: 'qa'
                    })
                }
            }

            // If no Q&A pairs found, treat each block as a doc
            if (data.length === 0 && blocks.length > 0) {
                blocks.forEach((block, idx) => {
                    data.push({
                        question: `Document Section ${idx + 1}`,
                        answer: block.trim(),
                        type: 'doc'
                    })
                })
            }

            return {
                success: true,
                data,
                totalRows: data.length
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                error: `Failed to parse TXT: ${error.message}`,
                totalRows: 0
            }
        }
    }

    /**
     * Parse Markdown file (by headers)
     */
    async parseMarkdown(filePath: string): Promise<ParseResult> {
        try {
            const content = fs.readFileSync(filePath, 'utf-8')

            // Split by headers
            const sections = content.split(/^#{1,3}\s+/m).filter(s => s.trim())
            const data: ParsedRow[] = []

            sections.forEach(section => {
                const lines = section.split('\n')
                const title = lines[0]?.trim()
                const body = lines.slice(1).join('\n').trim()

                if (title && body) {
                    data.push({
                        question: title,
                        answer: body,
                        type: 'doc'
                    })
                }
            })

            return {
                success: true,
                data,
                totalRows: data.length
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                error: `Failed to parse Markdown: ${error.message}`,
                totalRows: 0
            }
        }
    }

    /**
     * Parse PDF file
     */
    async parsePDF(filePath: string): Promise<ParseResult> {
        try {
            const loader = new PDFLoader(filePath, {
                splitPages: true
            })
            const documents = await loader.load()

            const data: ParsedRow[] = documents.map((doc, idx) => ({
                question: `Page ${idx + 1}`,
                answer: doc.pageContent.trim(),
                type: 'doc'
            })).filter(row => row.answer.length > 10)

            return {
                success: true,
                data,
                totalRows: data.length
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                error: `Failed to parse PDF: ${error.message}`,
                totalRows: 0
            }
        }
    }

    /**
     * Get file type from MIME type
     */
    getFileTypeFromMime(mimeType: string): string {
        const mimeMap: Record<string, string> = {
            'text/csv': 'csv',
            'application/vnd.ms-excel': 'excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
            'application/json': 'json',
            'text/plain': 'txt',
            'text/markdown': 'md',
            'application/pdf': 'pdf'
        }
        return mimeMap[mimeType] || 'unknown'
    }

    /**
     * Get file type from extension
     */
    getFileTypeFromExtension(filename: string): string {
        const ext = path.extname(filename).toLowerCase().replace('.', '')
        const extMap: Record<string, string> = {
            'csv': 'csv',
            'xls': 'excel',
            'xlsx': 'excel',
            'json': 'json',
            'txt': 'txt',
            'md': 'md',
            'markdown': 'md',
            'pdf': 'pdf'
        }
        return extMap[ext] || 'unknown'
    }
}

export default new FileParserService()
