import { Request, Response } from 'express'
import { createRunSchema } from './agent.validator'
import { createAgentRun, executeAgentRun, getAgentRun, getAgentRunLogs } from './agent.service'
import { SendResponse } from '../../../utils/SendResponse.utils'
import { StatusConstant } from '../../../constant/Status.constant'

class AgentController {
    constructor() {
        this.createRun = this.createRun.bind(this)
        this.executeRun = this.executeRun.bind(this)
        this.getRunStatus = this.getRunStatus.bind(this)
        this.getRunLogs = this.getRunLogs.bind(this)
    }

    async createRun(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = await createRunSchema.parseAsync(req.body)
            // Cast the agents to any to bypass strict type checking if needed vs Validator types
            const run = await createAgentRun(validatedData.runName, validatedData.agents as any)
            SendResponse.success(res, 'Agent run created successfully', run, StatusConstant.CREATED)
        } catch (err: any) {
            SendResponse.error(res, err.message, StatusConstant.BAD_REQUEST, err)
        }
    }

    async executeRun(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const run = await executeAgentRun(id)
            SendResponse.success(res, 'Agent run execution started', run, StatusConstant.OK)
        } catch (err: any) {
            SendResponse.error(res, err.message, StatusConstant.INTERNAL_SERVER_ERROR, err)
        }
    }

    async getRunStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const run = await getAgentRun(id)
            if (!run) {
                SendResponse.error(res, 'Run not found', StatusConstant.NOT_FOUND)
                return
            }
            SendResponse.success(res, 'Agent run status fetched', run, StatusConstant.OK)
        } catch (err: any) {
            SendResponse.error(res, err.message, StatusConstant.INTERNAL_SERVER_ERROR, err)
        }
    }

    async getRunLogs(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const logs = await getAgentRunLogs(id)
            SendResponse.success(res, 'Agent run logs fetched', logs, StatusConstant.OK)
        } catch (err: any) {
            SendResponse.error(res, err.message, StatusConstant.INTERNAL_SERVER_ERROR, err)
        }
    }
}

export default new AgentController()
