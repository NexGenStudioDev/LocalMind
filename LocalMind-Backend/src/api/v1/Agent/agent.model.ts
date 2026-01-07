import mongoose, { Schema } from 'mongoose'
import { IAgentRun, IAgentStepLog } from './agent.type'
import { AgentRoles, RunStatuses, StepStatuses } from './agent.constant'

const agentConfigSchema = new Schema({
    agentId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: AgentRoles, required: true },
    systemPrompt: { type: String, required: true },
    tools: [{ type: String }],
    priority: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
}, { _id: false })

const agentRunSchema = new Schema<IAgentRun>({
    runName: { type: String, required: true },
    status: { type: String, enum: RunStatuses, default: 'pending' },
    agents: [agentConfigSchema],
    currentAgent: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date }
}, { timestamps: true })

const agentStepLogSchema = new Schema<IAgentStepLog>({
    runId: { type: 'ObjectId', ref: 'AgentRun', required: true },
    agentId: { type: String, required: true },
    inputPrompt: { type: String, required: true },
    output: { type: String, required: true },
    status: { type: String, enum: StepStatuses, required: true },
    executionTimeMs: { type: Number, required: true }
}, { timestamps: true })

export const AgentRunModel = mongoose.model<IAgentRun>('AgentRun', agentRunSchema)
export const AgentStepLogModel = mongoose.model<IAgentStepLog>('AgentStepLog', agentStepLogSchema)
