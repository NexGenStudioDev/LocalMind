import AiModelConfig from './AiModelConfig.model'
import { IAiModelConfig, IAgent } from './AiModelConfig.type'

class AiModelConfig_Service {
  async setupAiModelConfig(data: IAiModelConfig): Promise<IAiModelConfig> {
    return await AiModelConfig.create(data)
  }

  async addAgent(userId: string, agent: IAgent): Promise<IAiModelConfig | null> {
    // Use $addToSet to prevent duplicate agents being added
    return await AiModelConfig.findOneAndUpdate(
      { userId },
      { $addToSet: { agents: agent } },
      { new: true }
    )
  }

  async removeAgent(userId: string, agentId: string): Promise<IAiModelConfig | null> {
    return await AiModelConfig.findOneAndUpdate(
      { userId },
      { $pull: { agents: { _id: agentId } } },
      { new: true }
    )
  }
}

export default new AiModelConfig_Service()
