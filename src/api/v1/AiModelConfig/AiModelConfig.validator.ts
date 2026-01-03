import { z } from 'zod'

export const agentSchema = z.object({
  provider: z
    .string('Provider is required')
    .trim()
    .min(2, 'Provider name must be at least 2 characters long')
    .max(50, 'Provider name too long (max 50 characters)'),

  type: z.enum(['cloud', 'on-premise'], {
    message: "Type must be either 'cloud' or 'on-premise'",
  }),

  model: z
    .string('Model name is required')
    .trim()
    .min(1, 'Model cannot be empty')
    .max(100, 'Model name too long (max 100 characters)'),

  key: z
    .string('API key is required')
    .trim()
    .min(10, 'Key must be at least 10 characters long for security')
    .max(200, 'Key too long (max 200 characters)')
    .optional(),
})

export const aiModelConfig_CreateSchema = z.object({
  agents: z
    .array(agentSchema, { message: 'Agents array is required' })
    .min(1, 'At least one agent is required'),

  system_prompt: z
    .string('System prompt is required')
    .trim()
    .min(10, 'System prompt must be at least 10 characters long')
    .max(1000, 'System prompt too long (max 1000 characters)'),
})

export const aiModelConfig_UpdateSchema = z.object({
  agents: z.array(agentSchema).min(1, 'At least one agent is required').optional(),

  system_prompt: z
    .string()
    .trim()
    .min(10, 'System prompt must be at least 10 characters long')
    .max(1000, 'System prompt too long (max 1000 characters)')
    .optional(),
})

export type AiModelConfigCreateInput = z.infer<typeof aiModelConfig_CreateSchema>
export type AiModelConfigUpdateInput = z.infer<typeof aiModelConfig_UpdateSchema>
export type AgentInput = z.infer<typeof agentSchema>
