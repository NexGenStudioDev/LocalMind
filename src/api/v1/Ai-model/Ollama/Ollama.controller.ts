import { Request, Response } from 'express'
import { SendResponse } from '../../../../utils/SendResponse.utils'
import OllamaService from './Ollama.service'
import OllamaUtils from './Ollama.utils'

class OllamaController {
  async ChartWithOllama(req: Request, res: Response) {
    try {
      const { prompt, model } = req.body

      await OllamaUtils.isModelAvailable(model)

      const Ai_Response = await OllamaService.generateText(prompt, model)

      console.debug('Ai_Response ready')

      SendResponse.success(res, 'AI response generated successfully', Ai_Response, 200)
    } catch (err: any) {
      console.error('Failed to generate AI response', err)
      SendResponse.error(res, 'Failed to generate AI response', 500, err)
    }
  }
}

export default new OllamaController()
