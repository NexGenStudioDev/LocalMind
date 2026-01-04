import { env } from './constant/env.constant'
import mongooseConection from './config/mongoose.connection'
import app from './routes/app'

const PORT = Number(env.PORT) || 3000
const APP_ENV = env.APP_ENV || 'development'
const HOST = '0.0.0.0'


app.get('/', async (_req, res) => {
  res.send('Hello from LocalMind backend!')
})

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running in ${APP_ENV} mode at http://${HOST}:${PORT}`)

  mongooseConection()

  if (APP_ENV === 'development') {
    console.log('🔒 Local-only access enabled (via localhost)')
  } else {
    console.log('🌍 Production mode — server is exposed externally')
  }
})
