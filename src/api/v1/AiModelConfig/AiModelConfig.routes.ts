import { Router } from 'express'
import AiModelConfigController from './AiModelConfig.controller'
const router: Router = Router()

router.post('/v1/config/agents', AiModelConfigController.setupAiModelConfig)

export { router as AiModelConfigRoutes }
