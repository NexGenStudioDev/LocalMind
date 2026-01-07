import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { env } from '../constant/env.constant'

/**
 * LangChain Service for AI Processing
 *
 * Provides reusable LangChain utilities for:
 * - OpenAI ChatGPT integration
 * - Prompt template management
 * - Runnable sequence chains
 * - System + User prompt flows
 *
 * @example
 * ```ts
 * import langchainService from './services/langchain.service'
 *
 * const response = await langchainService.runSimplePrompt(
 *   'You are a helpful assistant',
 *   'Explain quantum computing'
 * )
 * ```
 */
class LangChainService {
  private chatModel: ChatOpenAI

  constructor() {
    if (!env.OPENAI_API_KEY) {
      throw new Error(
        'OPENAI_API_KEY is not configured. Please set it in your .env file to use LangChain with OpenAI.'
      )
    }

    this.chatModel = new ChatOpenAI({
      modelName: env.OPENAI_MODEL || 'gpt-4o-mini',
      openAIApiKey: env.OPENAI_API_KEY,
      temperature: 0.7,
      maxTokens: 2000,
      timeout: 30000, // 30 seconds
    })
  }

  /**
   * Get the ChatOpenAI model instance
   *
   * @returns {ChatOpenAI} Configured ChatOpenAI client
   */
  public getChatModel(): ChatOpenAI {
    return this.chatModel
  }

  /**
   * Run a simple prompt with system and user messages
   *
   * Creates a basic chain with:
   * 1. System message (defines AI behavior/role)
   * 2. User message (the actual query)
   * 3. LLM invocation
   * 4. Response parsing
   *
   * @param systemPrompt - Instructions for AI behavior (e.g., "You are a helpful assistant")
   * @param userPrompt - The user's question or request
   * @returns Promise<string> - AI response text
   *
   * @throws Error if API key is missing or request fails
   *
   * @example
   * ```ts
   * const response = await langchainService.runSimplePrompt(
   *   'You are a coding expert',
   *   'Write a Python hello world program'
   * )
   * console.log(response) // "print('Hello, World!')"
   * ```
   */
  public async runSimplePrompt(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      // Create prompt template with system and user messages
      const promptTemplate = ChatPromptTemplate.fromMessages([
        ['system', systemPrompt],
        ['user', '{userInput}'],
      ])

      // Create a runnable sequence chain
      const chain = RunnableSequence.from([promptTemplate, this.chatModel])

      // Execute the chain
      const response = await chain.invoke({
        userInput: userPrompt,
      })

      // Parse and return the response
      if (typeof response.content === 'string') {
        return response.content
      } else {
        // Handle potential array content
        return JSON.stringify(response.content)
      }
    } catch (error: any) {
      throw new Error(`LangChain invocation failed: ${error.message}`)
    }
  }

  /**
   * Run a simple prompt with just user message (no system prompt)
   *
   * @param userPrompt - The user's question
   * @returns Promise<string> - AI response
   */
  public async runUserPrompt(userPrompt: string): Promise<string> {
    try {
      const response = await this.chatModel.invoke(userPrompt)

      if (typeof response.content === 'string') {
        return response.content
      } else {
        return JSON.stringify(response.content)
      }
    } catch (error: any) {
      throw new Error(`LangChain invocation failed: ${error.message}`)
    }
  }

  /**
   * Run a prompt with custom template variables
   *
   * @param templateString - Template with placeholders like {variable}
   * @param variables - Object with variable values
   * @returns Promise<string> - AI response
   *
   * @example
   * ```ts
   * await langchainService.runCustomTemplate(
   *   'Translate {text} from {fromLang} to {toLang}',
   *   { text: 'Hello', fromLang: 'English', toLang: 'Spanish' }
   * )
   * ```
   */
  public async runCustomTemplate(
    templateString: string,
    variables: Record<string, any>
  ): Promise<string> {
    try {
      const promptTemplate = ChatPromptTemplate.fromTemplate(templateString)
      const chain = RunnableSequence.from([promptTemplate, this.chatModel])

      const response = await chain.invoke(variables)

      if (typeof response.content === 'string') {
        return response.content
      } else {
        return JSON.stringify(response.content)
      }
    } catch (error: any) {
      throw new Error(`LangChain custom template failed: ${error.message}`)
    }
  }

  /**
   * Stream a response token by token
   *
   * @param systemPrompt - System instructions
   * @param userPrompt - User query
   * @param onToken - Callback for each token
   * @returns Promise<string> - Complete response
   */
  public async streamPrompt(
    systemPrompt: string,
    userPrompt: string,
    onToken?: (token: string) => void
  ): Promise<string> {
    try {
      const promptTemplate = ChatPromptTemplate.fromMessages([
        ['system', systemPrompt],
        ['user', '{userInput}'],
      ])

      const chain = RunnableSequence.from([promptTemplate, this.chatModel])

      const stream = await chain.stream({
        userInput: userPrompt,
      })

      let fullResponse = ''

      for await (const chunk of stream) {
        const content = chunk.content.toString()
        fullResponse += content

        if (onToken) {
          onToken(content)
        }
      }

      return fullResponse
    } catch (error: any) {
      throw new Error(`LangChain streaming failed: ${error.message}`)
    }
  }
}

// Export singleton instance
export default new LangChainService()
