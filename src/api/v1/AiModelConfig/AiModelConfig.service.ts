import { console } from 'inspector'
import AiModelConfig from './AiModelConfig.model'
import { IAiModelConfig, IAgent } from './AiModelConfig.type'

class AiModelConfig_Service {
  async setupAiModelConfig(data: IAiModelConfig): Promise<IAiModelConfig> {
    return await AiModelConfig.create(data)
  }

  async addAgent(userId: string, agent: IAgent): Promise<IAiModelConfig | null> {
    console.log('Adding agent for userId:', userId, 'with agent:', agent)
    return await AiModelConfig.findOneAndUpdate(
      { userId },
      { $push: { agents: agent } },
      { new: true }
    )
  }

  async removeAgent(userId: string, _agentId: string): Promise<IAiModelConfig | null> {
    const config = (await AiModelConfig.findOne({ userId }).exec()) as any

    if (!config) {
      throw new Error('AI Model Config not found for the user.')
    }

    return await config.save()
  }
}

export default new AiModelConfig_Service()
