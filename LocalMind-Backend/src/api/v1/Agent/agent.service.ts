import { AgentRunModel, AgentStepLogModel } from './agent.model'
import { IAgentConfig, IAgentRun, IAgentStepLog } from './agent.type'

export const createAgentRun = async (
    runName: string,
    agents: IAgentConfig[]
): Promise<IAgentRun> => {
    const run = new AgentRunModel({
        runName,
        agents,
        status: 'pending',
    })
    return await run.save()
}

export const getAgentRun = async (runId: string): Promise<IAgentRun | null> => {
    return await AgentRunModel.findById(runId).exec()
}

export const getAgentRunLogs = async (runId: string): Promise<IAgentStepLog[]> => {
    return await AgentStepLogModel.find({ runId }).sort({ createdAt: 1 }).exec()
}

export const executeAgentRun = async (runId: string) => {
    const run = await AgentRunModel.findById(runId)
    if (!run) throw new Error('Run not found')

    if (run.status === 'running' || run.status === 'completed') {
        return run
    }

    run.status = 'running'
    run.startedAt = new Date()
    await run.save()

    // Start execution in background
    processRun(run)

    return run
}

const processRun = async (run: any) => {
    try {
        // Sort agents by priority (lower number = higher priority, or vice versa? 
        // Usually priority 1 is high. But if it's a sequence, maybe 1, 2, 3...
        // The requirement says "Sort agents by priority". I'll assume ascending order of priority field.
        const agents = run.agents.sort((a: IAgentConfig, b: IAgentConfig) => a.priority - b.priority)
        let previousOutput = ''

        for (const agent of agents) {
            if (!agent.isActive) continue

            run.currentAgent = agent.agentId
            await run.save()

            const start = Date.now()

            // Simulate AI processing delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Placeholder for AI invocation
            const input = previousOutput || 'Start of Run'
            const executionOutput = `[${agent.name}]: Executed task based on prompt. Input len: ${input.length}`

            const log = new AgentStepLogModel({
                runId: run._id,
                agentId: agent.agentId,
                inputPrompt: input,
                output: executionOutput,
                status: 'success',
                executionTimeMs: Date.now() - start
            })
            await log.save()

            previousOutput = executionOutput
        }

        run.status = 'completed'
        run.completedAt = new Date()
        run.currentAgent = undefined
        await run.save()

    } catch (error) {
        console.error('Run execution error:', error)
        run.status = 'failed'
        await run.save()
    }
}
