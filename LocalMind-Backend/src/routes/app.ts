import express from 'express'
import path from 'path'
import fs from 'fs'
const app: express.Application = express()
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import { GoogleRoutes } from '../api/v1/Ai-model/Google/Google.routes'
import { DataSetRoutes } from '../api/v1/DataSet/v1/DataSet.routes'
import { userRoutes } from '../api/v1/user/user.routes'
import { OllamaRouter } from '../api/v1/Ai-model/Ollama/Ollama.routes'
import { GroqRouter } from '../api/v1/Ai-model/Groq/Groq.routes'
import { TrainingSampleRoutes } from '../api/v1/DataSet/v1/TrainingSample.routes'


logger.token('time', () => new Date().toLocaleString())
app.use(logger(':time :method :url :status'))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
app.use(
  '/api',
  GoogleRoutes,
  userRoutes,
  DataSetRoutes,
  OllamaRouter,
  GroqRouter,
  TrainingSampleRoutes
)

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
