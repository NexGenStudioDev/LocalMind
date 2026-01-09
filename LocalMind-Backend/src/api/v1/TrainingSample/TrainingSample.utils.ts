import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

export interface ParsedSample {
  question: string
  answerTemplate: {
    answer: string
    format?: string
    structure?: string[]
  }
  type: 'qa' | 'snippet' | 'doc' | 'faq' | 'other'
  tags?: string[]
  language?: string
  sourceType: 'dataset'
}

/**
 * Utility class for parsing training data files
 */
export class TrainingSampleFileParser {
  /**
   * Parse CSV file for training samples
   * Expected format: question,answer,type,tags,language
   */
  static async parseCSV(filePath: string): Promise<ParsedSample[]> {
    const samples: ParsedSample[] = []

    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath)
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      })

      let isFirstLine = true

      rl.on('line', (line: string) => {
        // Skip header row
        if (isFirstLine) {
          isFirstLine = false
          return
        }

        try {
          const [question, answer, type, tags, language] = line.split(',').map(s => s.trim())

          if (!question || !answer) {
            console.warn('Skipping invalid CSV row:', line)
            return
          }

          const sample: ParsedSample = {
            question,
            answerTemplate: {
              answer,
              format: 'text',
            },
            type: (type || 'qa') as any,
            tags: tags ? tags.split(';').map(t => t.trim()) : [],
            language: language || 'en',
            sourceType: 'dataset',
          }

          samples.push(sample)
        } catch (error) {
          console.warn('Error parsing CSV line:', line, error)
        }
      })

      rl.on('close', () => {
        resolve(samples)
      })

      rl.on('error', reject)
    })
  }

  /**
   * Parse JSON file for training samples
   * Expected format: Array of objects with question, answer, type, tags, language
   */
  static async parseJSON(filePath: string): Promise<ParsedSample[]> {
    const content = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)

    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of samples')
    }

    return data.map((item: any) => {
      if (!item.question || !item.answerTemplate?.answer) {
        throw new Error('Each sample must have question and answerTemplate.answer')
      }

      return {
        question: item.question,
        answerTemplate: {
          answer: item.answerTemplate.answer,
          format: item.answerTemplate.format || 'text',
          structure: item.answerTemplate.structure || [],
        },
        type: item.type || 'qa',
        tags: item.tags || [],
        language: item.language || 'en',
        sourceType: 'dataset',
      } as ParsedSample
    })
  }

  /**
   * Parse Markdown file for training samples
   * Format: ## Question\nAnswer text\nTags: tag1, tag2\n---\n
   */
  static async parseMarkdown(filePath: string): Promise<ParsedSample[]> {
    const content = fs.readFileSync(filePath, 'utf-8')
    const sections = content.split('---').map(s => s.trim()).filter(s => s)

    return sections.map((section, index) => {
      const lines = section.split('\n').filter(l => l.trim())

      if (lines.length < 2) {
        throw new Error(`Invalid markdown section ${index}: must have at least question and answer`)
      }

      // Extract question (first ## header)
      const questionMatch = lines[0].match(/^#+\s+(.+)$/)
      const question = questionMatch ? questionMatch[1] : lines[0]

      // Extract answer (everything except question and metadata)
      let answer = ''
      let tags: string[] = []
      let language = 'en'

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        if (line.startsWith('Tags:')) {
          tags = line
            .replace('Tags:', '')
            .split(',')
            .map(t => t.trim())
        } else if (line.startsWith('Language:')) {
          language = line.replace('Language:', '').trim()
        } else if (!line.startsWith('---')) {
          answer += line + '\n'
        }
      }

      return {
        question,
        answerTemplate: {
          answer: answer.trim(),
          format: 'markdown',
        },
        type: 'doc',
        tags,
        language,
        sourceType: 'dataset',
      } as ParsedSample
    })
  }

  /**
   * Parse Text file for training samples
   * Simple format: pairs of questions and answers separated by newlines
   */
  static async parseText(filePath: string): Promise<ParsedSample[]> {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n').filter(l => l.trim())

    const samples: ParsedSample[] = []

    for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
        samples.push({
          question: lines[i],
          answerTemplate: {
            answer: lines[i + 1],
            format: 'text',
          },
          type: 'qa',
          tags: [],
          language: 'en',
          sourceType: 'dataset',
        })
      }
    }

    return samples
  }

  /**
   * Auto-detect and parse file based on extension
   */
  static async parseFile(filePath: string): Promise<ParsedSample[]> {
    const ext = path.extname(filePath).toLowerCase()

    switch (ext) {
      case '.csv':
        return this.parseCSV(filePath)
      case '.json':
        return this.parseJSON(filePath)
      case '.md':
      case '.markdown':
        return this.parseMarkdown(filePath)
      case '.txt':
        return this.parseText(filePath)
      default:
        throw new Error(`Unsupported file format: ${ext}`)
    }
  }

  /**
   * Validate parsed samples
   */
  static validateSamples(samples: ParsedSample[]): { valid: ParsedSample[]; errors: string[] } {
    const valid: ParsedSample[] = []
    const errors: string[] = []

    samples.forEach((sample, index) => {
      const errs: string[] = []

      if (!sample.question || sample.question.trim().length < 5) {
        errs.push(`Question too short (min 5 chars)`)
      }

      if (!sample.answerTemplate.answer || sample.answerTemplate.answer.trim().length < 5) {
        errs.push(`Answer too short (min 5 chars)`)
      }

      if (!['qa', 'snippet', 'doc', 'faq', 'other'].includes(sample.type)) {
        errs.push(`Invalid type: ${sample.type}`)
      }

      if (errs.length === 0) {
        valid.push(sample)
      } else {
        errors.push(`Sample ${index}: ${errs.join('; ')}`)
      }
    })

    return { valid, errors }
  }
}

export default TrainingSampleFileParser
