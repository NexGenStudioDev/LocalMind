import { Schema, Types, model } from 'mongoose'
import { IAgent, IAiModelConfig } from './AiModelConfig.type'
import { AvailableAiModelConfigAgents } from './AiModelConfig.constant'

const AgentSchema = new Schema<IAgent>({
  provider: {
    type: String,
    required: true,
    enum: AvailableAiModelConfigAgents,
  },
  type: {
    type: String,
    required: true,
    enum: ['cloud', 'on-premise'],
  },
  model: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    select: false,
  },
})

const AiModelConfigSchema = new Schema<IAiModelConfig>(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agents: {
      type: [AgentSchema],
      validate: {
        validator: (agents: IAgent[]) => agents.length > 0,
        message: 'At least one agent is required.',
      },
    },
    system_prompt: {
      type: String,
      required: true,
      default:
        'You are a helpful AI assistant trained to answer customer support questions accurately and politely.',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const AiModelConfig = model<IAiModelConfig>('AiModelConfig', AiModelConfigSchema)

export default AiModelConfig
