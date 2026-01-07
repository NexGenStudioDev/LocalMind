import { Router } from 'express'
import AgentController from './agent.controller'

const router = Router()

router.post('/v1/agent-runs', AgentController.createRun)
router.post('/v1/agent-runs/:id/execute', AgentController.executeRun)
router.get('/v1/agent-runs/:id', AgentController.getRunStatus)
router.get('/v1/agent-runs/:id/logs', AgentController.getRunLogs)

export { router as agentRoutes }
