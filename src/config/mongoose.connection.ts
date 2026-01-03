import mongoose from 'mongoose'
import { env } from '../constant/env.constant'

const mongooseConection = () => {
  mongoose
    .connect(env.DB_CONNECTION_STRING, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.info('Mongoose connection established.')
    })
    .catch((err) => {
      console.error('Mongoose connection error:', err)
      setTimeout(mongooseConection, 5000)
    })
}

export default mongooseConection
