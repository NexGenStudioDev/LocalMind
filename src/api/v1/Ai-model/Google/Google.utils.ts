import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { LangchainPromptTemplate } from '../../../../Template/v1/Ai.template'
import { env } from '../../../../constant/env.constant'

interface GeminiUtilsOptions {
  modelName?: string
  temperature?: number
  apiKey?: string
  maxOutputTokens?: number
}

class GeminiUtils {
  private model: ChatGoogleGenerativeAI
  private modelName: string
  private apiKey!: string
  private temperature: number
  private maxOutputTokens: number

  constructor(options: GeminiUtilsOptions = {}) {
    this.modelName = options.modelName || 'gemini-2.5-pro'
    this.temperature = options.temperature ?? 0.7
    this.maxOutputTokens = options.maxOutputTokens ?? 2048
    this.apiKey = env.GOOGLE_API_KEY ? env.GOOGLE_API_KEY : options.apiKey || ''

    this.model = new ChatGoogleGenerativeAI({
      apiKey: this.apiKey,
      model: this.modelName,
      maxRetries: 1,
      streamUsage: false,

      temperature: this.temperature,
      maxOutputTokens: this.maxOutputTokens,
    })
  }

  async generateResponse(
    promptTemplate: LangchainPromptTemplate,
    inputValues: Record<string, any> = {}
  ): Promise<string> {
    try {
      const formattedPrompt = await promptTemplate.format(inputValues)
      const response = await this.model.invoke(formattedPrompt)
      if (typeof response === 'object' && 'content' in response) {
        return (response as any).content
      }
      return response as string
    } catch (error) {
      console.error('GeminiService Error:', error)
      throw new Error('Failed to generate response from Gemini.')
    }
  }
}

export default GeminiUtils
