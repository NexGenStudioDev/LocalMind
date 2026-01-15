import { Request, Response } from 'express'
import AiModelConfigUtility from './AiModelConfig.utility'
import UserUtils from '../user/user.utils'
import { SendResponse } from '../../../utils/SendResponse.utils'
import { aiModelConfig_Constant } from './AiModelConfig.constant'
import AiModelConfigService from './AiModelConfig.service'
import { aiModelConfig_CreateSchema } from './AiModelConfig.validator'
import { IAgent } from './AiModelConfig.type'

class AiModelConfig_Controller {
  public async createAiModelConfig(_data: unknown) {}

  public async setupAiModelConfig(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token
      if (!token) throw new Error('Authentication token missing')

      const FindUserByToken = await UserUtils.verifyToken(token)

      if (!FindUserByToken) throw new Error('Invalid authentication token')

      const ValidateData = await aiModelConfig_CreateSchema.parseAsync(req.body)

      const { agents, system_prompt } = ValidateData

      const existingConfig = await AiModelConfigUtility.findAiModelConfigByUserId(
        String(FindUserByToken._id)
      )

      let CreateConfig: any = null
      if (!existingConfig) {
        CreateConfig = await AiModelConfigService.setupAiModelConfig({
          userId: String(FindUserByToken._id),
          agents: [{} as IAgent],
          system_prompt,
        })
      }

      await Promise.all(
        (agents as IAgent[]).map(async (agent) => {
          const isAlreadyAdded = await AiModelConfigUtility.findAiModelConfigById_And_ModelName(
            String(FindUserByToken._id),
            agent.model
          )
          if (!isAlreadyAdded) {
            await AiModelConfigService.addAgent(String(FindUserByToken._id), agent)
          }
        })
      )

      const configToReturn = CreateConfig || existingConfig

      SendResponse.success(
        res,
        aiModelConfig_Constant.AGENT_SETUP_SUCCESS,
        { config: configToReturn },
        201
      )
    } catch (error) {
      console.error('Error in setupAiModelConfig:', error)

      SendResponse.error(
        res,
        (error as Error).message || 'Failed to set up AI Model Config',
        500,
        error
      )
    }
  }

  public async updateAiModelConfig(_data: unknown) {}

  public async deleteAiModelConfig(_data: unknown) {}
}

export default new AiModelConfig_Controller()
