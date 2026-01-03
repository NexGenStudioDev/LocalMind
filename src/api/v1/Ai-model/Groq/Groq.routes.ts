import { Router } from 'express'
import GroqController from './Groq.controller'
const router: Router = Router()

router.post('/v1/chat-with-groq', GroqController.generateChartWithGroq)

export { router as GroqRouter }
