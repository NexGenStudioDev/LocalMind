import { ObjectId } from 'mongoose'

export interface IAgent {
  _id?: ObjectId
  provider: string
  type: string
  model: string
  key?: string
}

export interface IAiModelConfig {
  userId?: string | ObjectId
  agents: [IAgent]
  system_prompt?: string
  createdAt?: Date
  updatedAt?: Date
}
