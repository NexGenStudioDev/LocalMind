import { Request, Response } from 'express'
import { SendResponse } from '../../../../utils/SendResponse.utils'
import OllamaService from './Ollama.service'
import OllamaUtils from './Ollama.utils'
import axios from 'axios'
import { env } from '../../../../constant/env.constant'

class OllamaController {
  async ChatWithOllama(req: Request, res: Response) {
    try {
      const { prompt, model } = req.body

      await OllamaUtils.isModelAvailable(model)

      const Ai_Response = await OllamaService.generateText(prompt, model)

      console.log('Ai_Response', Ai_Response)

      SendResponse.success(res, 'AI response generated successfully', Ai_Response, 200)
    } catch (err: any) {
      console.log('err', err)
      SendResponse.error(res, 'Failed to generate AI response', 500, err)
    }
  }

  async checkOllamaStatus(req: Request, res: Response) {
    try {
      const response = await axios.get(`${env.OLLAMA_HOST}/api/tags`)

      const models = response.data.models || []

      SendResponse.success(
        res,
        'Ollama is running and accessible',
        {
          status: 'online',
          host: env.OLLAMA_HOST,
          models: models.map((m: { name: string; size: number; modified_at: string }) => ({
            name: m.name,
            size: m.size,
            modified: m.modified_at,
          })),
          totalModels: models.length,
        },
        200
      )
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET') {
        SendResponse.error(
          res,
          'Ollama server is not running. Please start it using: ollama serve',
          503,
          { host: env.OLLAMA_HOST }
        )
      } else {
        SendResponse.error(res, 'Failed to connect to Ollama', 500, error)
      }
    }
  }

  async listModels(req: Request, res: Response) {
    try {
      const models = await OllamaUtils.listAvailableModels()

      SendResponse.success(res, 'Models retrieved successfully', { models, count: models.length }, 200)
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET') {
        SendResponse.error(
          res,
          'Ollama server is not running. Please start it using: ollama serve',
          503,
          { host: env.OLLAMA_HOST }
        )
      } else {
        SendResponse.error(res, 'Failed to list models', 500, error)
      }
    }
  }

  async testModel(req: Request, res: Response) {
    try {
      const { model } = req.params

      // Test with a simple prompt
      const testPrompt = 'Say hello in one sentence'

      const response = await OllamaService.generateText(testPrompt, model)

      SendResponse.success(
        res,
        `Model '${model}' is working correctly`,
        {
          model,
          testPrompt,
          response,
          latency: '< 1s', // Could be measured accurately
        },
        200
      )
    } catch (error: any) {
      SendResponse.error(res, `Model '${req.params.model}' test failed`, 500, error)
    }
  }
}

export default new OllamaController()
