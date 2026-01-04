import { Request, Response } from 'express'
import AiModelConfigUtility from './AiModelConfig.utility'
import UserUtils from '../user/user.utils'
import { SendResponse } from '../../../utils/SendResponse.utils'
import { aiModelConfig_Constant } from './AiModelConfig.constant'
import AiModelConfigService from './AiModelConfig.service'
import { aiModelConfig_CreateSchema, aiModelConfig_UpdateSchema } from './AiModelConfig.validator'
import { IAgent } from './AiModelConfig.type'

class AiModelConfig_Controller {
  public async setupAiModelConfig(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token
      if (!token) throw new Error('Authentication token missing')

      const FindUserByToken = await UserUtils.VerifyUserToken(token)

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
          agents: [],
          system_prompt,
        })
      }

      // Add agents without duplicates (check in-memory)
      const existingModels = new Set(
        (existingConfig?.agents || CreateConfig?.agents || []).map((a: IAgent) => a.model)
      )

      for (const agent of agents as IAgent[]) {
        if (!existingModels.has(agent.model)) {
          await AiModelConfigService.addAgent(String(FindUserByToken._id), agent)
          existingModels.add(agent.model)
        }
      }

      const configToReturn = await AiModelConfigUtility.findAiModelConfigByUserId(
        String(FindUserByToken._id)
      )

      SendResponse.success(
        res,
        aiModelConfig_Constant.AGENT_SETUP_SUCCESS,
        { config: configToReturn },
        201
      )
    } catch (error) {
      SendResponse.error(
        res,
        (error as Error).message || 'Failed to set up AI Model Config',
        500,
        error
      )
    }
  }

  public async getAiModelConfig(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?._id || (req as any).user?.id

      if (!userId) {
        SendResponse.error(res, 'Authentication required', 401, null)
        return
      }

      const config = await AiModelConfigService.getConfig(String(userId))

      if (!config) {
        SendResponse.error(res, 'No AI Model Configuration found', 404, null)
        return
      }

      SendResponse.success(res, 'AI Model Configuration retrieved successfully', {
        config,
      })
    } catch (error) {
      SendResponse.error(
        res,
        (error as Error).message || 'Failed to retrieve AI Model Config',
        500,
        error
      )
    }
  }

  public async updateAiModelConfig(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?._id || (req as any).user?.id

      if (!userId) {
        SendResponse.error(res, 'Authentication required', 401, null)
        return
      }

      const ValidateData = await aiModelConfig_UpdateSchema.parseAsync(req.body)

      const updatedConfig = await AiModelConfigService.updateConfig(String(userId), ValidateData)

      if (!updatedConfig) {
        SendResponse.error(res, 'AI Model Configuration not found', 404, null)
        return
      }

      SendResponse.success(res, 'AI Model Configuration updated successfully', {
        config: updatedConfig,
      })
    } catch (error) {
      if ((error as any).code === 'P2025') {
        SendResponse.error(res, 'AI Model Configuration not found', 404, null)
        return
      }

      SendResponse.error(
        res,
        (error as Error).message || 'Failed to update AI Model Config',
        500,
        error
      )
    }
  }

  public async removeAgent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?._id || (req as any).user?.id
      const { agentId } = req.params

      if (!userId) {
        SendResponse.error(res, 'Authentication required', 401, null)
        return
      }

      if (!agentId) {
        SendResponse.error(res, 'Agent ID is required', 400, null)
        return
      }

      const updatedConfig = await AiModelConfigService.removeAgent(String(userId), agentId)

      SendResponse.success(res, 'Agent removed successfully', {
        config: updatedConfig,
      })
    } catch (error) {
      SendResponse.error(
        res,
        (error as Error).message || 'Failed to remove agent',
        500,
        error
      )
    }
  }
}

export default new AiModelConfig_Controller()
