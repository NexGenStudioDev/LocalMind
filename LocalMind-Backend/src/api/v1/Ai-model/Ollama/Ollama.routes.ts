// Ollama.routes.ts
import { Router } from 'express'
import OllamaController from './Ollama.controller'

const router: Router = Router()

// Chat endpoint
router.post('/v1/chat-with-ollama', OllamaController.ChartWithOllama)

// Health check and status
router.get('/v1/ollama/status', OllamaController.checkOllamaStatus)

// List all available models
router.get('/v1/ollama/models', OllamaController.listModels)

// Test a specific model
router.get('/v1/ollama/test/:model', OllamaController.testModel)

export { router as OllamaRouter }
