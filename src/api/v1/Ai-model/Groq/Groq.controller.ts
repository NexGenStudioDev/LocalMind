import { Request, Response } from 'express'
import { SendResponse } from '../../../../utils/SendResponse.utils'
import GroqService from './Groq.service'
import GROQ_TYPE from './Groq.constant'

class GroqController {
  async generateChartWithGroq(req: Request, res: Response) {
    try {
      const { model, apiKey, message } = req.body

      const chat = await GroqService.ChartWithGroq({ model, apiKey, message })

      if (!chat) {
        throw new Error(GROQ_TYPE.FAILED_TO_GET_RESPONSE_FROM_GROQ)
      }

      SendResponse.success(res, GROQ_TYPE.GET_RESPONSE_FROM_GROQ_SUCCESS, chat)
    } catch (error: any) {
      SendResponse.error(res, error.message, 500, error)
    }
  }
}

export default new GroqController()
