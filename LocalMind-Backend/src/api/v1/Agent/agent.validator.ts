import { z } from 'zod'
import { AgentRoles, AgentConstants } from './agent.constant'

export const agentConfigSchema = z.object({
    agentId: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(AgentRoles),
    systemPrompt: z.string().min(1),
    tools: z.array(z.string()),
    priority: z.number().default(AgentConstants.DEFAULT_PRIORITY),
    isActive: z.boolean().default(true)
})

export const createRunSchema = z.object({
    runName: z.string().min(1),
    agents: z.array(agentConfigSchema).max(AgentConstants.MAX_AGENTS_PER_RUN)
})
