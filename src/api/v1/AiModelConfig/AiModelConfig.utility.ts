import AiModelConfig from './AiModelConfig.model'
import { IAiModelConfig } from './AiModelConfig.type'

class AiModelConfigUtility {
  public async findAllAiModelConfigs(): Promise<IAiModelConfig[]> {
    return await AiModelConfig.find().exec()
  }

  public async findAiModelConfigById_And_ModelName(
    id: string,
    modelName: string
  ): Promise<IAiModelConfig | null> {
    return await AiModelConfig.findOne({ _id: id, 'agents.model': modelName }).exec()
  }

  public async findAiModelConfigByUserId(id: string): Promise<IAiModelConfig | null> {
    return await AiModelConfig.findById(id).exec()
  }

  public async findAiModelConfigsByUserId(userId: string): Promise<IAiModelConfig[]> {
    return await AiModelConfig.find({ userId }).exec()
  }

  public async doesAiModelConfigExist(id: string): Promise<boolean> {
    const count = await AiModelConfig.countDocuments({ _id: id }).exec()
    return count > 0
  }

  public async isUserOwnerOfAiModelConfig(userId: string, configId: string): Promise<boolean> {
    const config = await AiModelConfig.findOne({
      _id: configId,
      userId,
    }).exec()
    return !!config
  }
}

export default new AiModelConfigUtility()
