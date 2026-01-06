import { AgentRoles, RunStatuses, StepStatuses } from './agent.constant'

export type AgentRole = (typeof AgentRoles)[number]
export type RunStatus = (typeof RunStatuses)[number]
export type StepStatus = (typeof StepStatuses)[number]

export interface IAgentConfig {
    agentId: string
    name: string
    type: AgentRole
    systemPrompt: string
    tools: string[]
    priority: number
    isActive: boolean
}

export interface IAgentRun {
    _id?: string
    runName: string
    status: RunStatus
    agents: IAgentConfig[]
    currentAgent?: string
    startedAt?: Date
    completedAt?: Date
    createdAt?: Date
    updatedAt?: Date
}

export interface IAgentStepLog {
    _id?: string
    runId: string
    agentId: string
    inputPrompt: string
    output: string
    status: StepStatus
    executionTimeMs: number
    createdAt?: Date
}
