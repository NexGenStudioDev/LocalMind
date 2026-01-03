// Ollama.routes.ts
import { Router } from 'express'
import OllamaController from './Ollama.controller'

const router: Router = Router()

router.post('/v1/chat-with-ollama', OllamaController.ChartWithOllama)

export { router as OllamaRouter }
