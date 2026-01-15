import express from 'express'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
const app: express.Application = express()
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import { GoogleRoutes } from '../api/v1/Ai-model/Google/Google.routes'
import { DataSetRoutes } from '../api/v1/DataSet/v1/DataSet.routes'
import { userRoutes } from '../api/v1/user/user.routes'
import { OllamaRouter } from '../api/v1/Ai-model/Ollama/Ollama.routes'
import { GroqRouter } from '../api/v1/Ai-model/Groq/Groq.routes'
import { agentRoutes } from '../api/v1/Agent/agent.routes'

import { TunnelRoutes } from '../api/v1/Tunnel/Tunnel.routes'

logger.token('time', () => new Date().toLocaleString())
app.use(logger(':time :method :url :status'))

app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
app.use('/api', GoogleRoutes, userRoutes, DataSetRoutes, OllamaRouter, GroqRouter, agentRoutes)
app.use('/api', GoogleRoutes, userRoutes, DataSetRoutes, OllamaRouter, GroqRouter, TunnelRoutes)

// Serve static files from public directory (for frontend in production)
const publicPath = path.join(__dirname, '../../public')
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath))

  // SPA fallback: serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(publicPath, 'index.html'))
    }
  })
}

export default app
