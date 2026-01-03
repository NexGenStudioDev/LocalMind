import { Router } from 'express'
import GoogleController from './Google.controller'
const router: Router = Router()

router.post('/v1/chat/gemini', GoogleController.ChatWithGoogleAI)

export { router as GoogleRoutes }
