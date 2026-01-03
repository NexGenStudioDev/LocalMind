import { Request, Response } from 'express'
import GoogleService from './Google.service'
import { SendResponse } from '../../../../utils/SendResponse.utils'

class Google_Controller {
  async ChatWithGoogleAI(req: Request, res: Response) {
    try {
      const { Prompt } = req.body

      const Ai_Response = await GoogleService.ChatWithGoogleAI(Prompt)

      SendResponse.success(res, 'AI response generated successfully', Ai_Response)
    } catch (error) {
      SendResponse.error(res, 'Failed to generate AI response', 500, error)
    }
  }
}

export default new Google_Controller()
