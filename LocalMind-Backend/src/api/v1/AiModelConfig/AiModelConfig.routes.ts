import { Router } from 'express'
import AiModelConfigController from './AiModelConfig.controller'
import { userMiddleware } from '../user/user.middleware'

const router: Router = Router()

// POST: Create/setup AI model config
router.post('/v1/config/agents', AiModelConfigController.setupAiModelConfig)

// GET: Retrieve AI model config (no plaintext API keys)
router.get('/v1/get/ai-model-config', userMiddleware, AiModelConfigController.getAiModelConfig)

// PUT: Update AI model config
router.put('/v1/update/ai-model-config', userMiddleware, AiModelConfigController.updateAiModelConfig)

// DELETE: Remove a specific agent from config
router.delete('/v1/config/agents/:agentId', userMiddleware, AiModelConfigController.removeAgent)

export { router as AiModelConfigRoutes }
