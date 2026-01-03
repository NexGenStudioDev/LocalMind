import express from 'express'
const app: express.Application = express()
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import { GoogleRoutes } from '../api/v1/Ai-model/Google/Google.routes'
import { DataSetRoutes } from '../api/v1/DataSet/v1/DataSet.routes'
import { userRoutes } from '../api/v1/user/user.routes'
import { OllamaRouter } from '../api/v1/Ai-model/Ollama/Ollama.routes'
import { GroqRouter } from '../api/v1/Ai-model/Groq/Groq.routes'


logger.token('time', () => new Date().toLocaleString())
app.use(logger(':time :method :url :status'))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', GoogleRoutes, userRoutes, DataSetRoutes, OllamaRouter, GroqRouter)

export default app
