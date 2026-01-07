export const AgentRoles = ['planner', 'researcher', 'executor', 'validator', 'custom'] as const
export const RunStatuses = ['pending', 'running', 'blocked', 'completed', 'failed'] as const
export const StepStatuses = ['success', 'error'] as const

export const AgentConstants = {
    MAX_AGENTS_PER_RUN: 7,
    DEFAULT_PRIORITY: 1,
}
