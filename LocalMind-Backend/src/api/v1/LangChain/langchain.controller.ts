import { Request, Response } from 'express'
import { SendResponse } from '../utils/SendResponse.utils'
import langchainService from '../services/langchain.service'

/**
 * LangChain Controller
 *
 * Handles HTTP requests for LangChain-powered AI operations.
 * Provides endpoints for:
 * - Simple chat with system + user prompts
 * - User-only prompts
 * - Custom template execution
 * - Streaming responses
 */
class LangChainController {
  /**
   * Simple chat endpoint with system and user prompts
   *
   * POST /api/v1/langchain/chat
   * Body: { systemPrompt: string, userPrompt: string }
   */
  async chat(req: Request, res: Response) {
    try {
      const { systemPrompt, userPrompt } = req.body

      if (!userPrompt) {
        return SendResponse.error(res, 'userPrompt is required', 400)
      }

      const defaultSystemPrompt =
        systemPrompt || 'You are a helpful AI assistant powered by LocalMind.'

      const response = await langchainService.runSimplePrompt(defaultSystemPrompt, userPrompt)

      SendResponse.success(
        res,
        'AI response generated successfully',
        {
          response,
          systemPrompt: defaultSystemPrompt,
          userPrompt,
        },
        200
      )
    } catch (error: any) {
      console.error('LangChain chat error:', error)
      SendResponse.error(res, 'Failed to generate AI response', 500, { error: error.message })
    }
  }

  /**
   * User prompt only (no system message)
   *
   * POST /api/v1/langchain/prompt
   * Body: { prompt: string }
   */
  async prompt(req: Request, res: Response) {
    try {
      const { prompt } = req.body

      if (!prompt) {
        return SendResponse.error(res, 'prompt is required', 400)
      }

      const response = await langchainService.runUserPrompt(prompt)

      SendResponse.success(
        res,
        'AI response generated successfully',
        {
          response,
          prompt,
        },
        200
      )
    } catch (error: any) {
      console.error('LangChain prompt error:', error)
      SendResponse.error(res, 'Failed to generate AI response', 500, { error: error.message })
    }
  }

  /**
   * Custom template with variables
   *
   * POST /api/v1/langchain/template
   * Body: { template: string, variables: object }
   */
  async customTemplate(req: Request, res: Response) {
    try {
      const { template, variables } = req.body

      if (!template) {
        return SendResponse.error(res, 'template is required', 400)
      }

      if (!variables || typeof variables !== 'object') {
        return SendResponse.error(res, 'variables must be an object', 400)
      }

      const response = await langchainService.runCustomTemplate(template, variables)

      SendResponse.success(
        res,
        'Template executed successfully',
        {
          response,
          template,
          variables,
        },
        200
      )
    } catch (error: any) {
      console.error('LangChain template error:', error)
      SendResponse.error(res, 'Failed to execute template', 500, { error: error.message })
    }
  }

  /**
   * Health check endpoint to verify LangChain is configured
   *
   * GET /api/v1/langchain/health
   */
  async healthCheck(req: Request, res: Response) {
    try {
      const model = langchainService.getChatModel()

      SendResponse.success(
        res,
        'LangChain is configured and ready',
        {
          status: 'operational',
          model: model.modelName,
          temperature: model.temperature,
          maxTokens: model.maxTokens,
        },
        200
      )
    } catch (error: any) {
      SendResponse.error(res, 'LangChain is not properly configured', 500, { error: error.message })
    }
  }

  /**
   * Test endpoint with a simple query
   *
   * GET /api/v1/langchain/test
   */
  async test(req: Request, res: Response) {
    try {
      const testPrompt = 'Say hello in one sentence and confirm you are working correctly.'

      const response = await langchainService.runSimplePrompt(
        'You are a helpful AI assistant.',
        testPrompt
      )

      SendResponse.success(
        res,
        'LangChain test successful',
        {
          testPrompt,
          response,
          timestamp: new Date().toISOString(),
        },
        200
      )
    } catch (error: any) {
      SendResponse.error(res, 'LangChain test failed', 500, { error: error.message })
    }
  }
}

export default new LangChainController()
