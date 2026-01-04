import { Router } from 'express'
import langchainController from './langchain.controller'

const router: Router = Router()

/**
 * LangChain Routes
 *
 * Endpoints for LangChain-powered AI operations
 */

// Health check
router.get('/v1/langchain/health', langchainController.healthCheck)

// Test endpoint
router.get('/v1/langchain/test', langchainController.test)

// Chat with system + user prompts
router.post('/v1/langchain/chat', langchainController.chat)

// Simple user prompt
router.post('/v1/langchain/prompt', langchainController.prompt)

// Custom template execution
router.post('/v1/langchain/template', langchainController.customTemplate)

export { router as LangChainRouter }
