import AiModelConfig from './AiModelConfig.model'
import { IAiModelConfig, IAgent } from './AiModelConfig.type'

class AiModelConfig_Service {
  async setupAiModelConfig(data: IAiModelConfig): Promise<IAiModelConfig> {
    return await AiModelConfig.create(data)
  }

  async addAgent(userId: string, agent: IAgent): Promise<IAiModelConfig | null> {
    return await AiModelConfig.findOneAndUpdate(
      { userId },
      { $addToSet: { agents: agent } },
      { new: true }
    )
  }

  async removeAgent(userId: string, agentId: string): Promise<IAiModelConfig | null> {
    if (!agentId) {
      throw new Error('Agent ID is required to remove an agent.')
    }

    const config = await AiModelConfig.findOneAndUpdate(
      { userId },
      { $pull: { agents: { _id: agentId } } },
      { new: true }
    ).exec()

    if (!config) {
      throw new Error('AI Model Config not found for the user.')
    }

    return config
  }

  async getConfig(userId: string): Promise<IAiModelConfig | null> {
    return await AiModelConfig.findOne({ userId }).select('-agents.key').exec()
  }

  async updateConfig(
    userId: string,
    updates: Partial<IAiModelConfig>
  ): Promise<IAiModelConfig | null> {
    return await AiModelConfig.findOneAndUpdate({ userId }, updates, {
      new: true,
    })
      .select('-agents.key')
      .exec()
  }
}

export default new AiModelConfig_Service()
