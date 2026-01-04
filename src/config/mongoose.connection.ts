import mongoose from 'mongoose'
import { env } from '../constant/env.constant'

const mongooseConection = () => {
  mongoose
    .connect(env.DB_CONNECTION_STRING, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log('Mongoose Connection.')
    })
    .catch((err) => {
      console.log(err)
      setTimeout(mongooseConection, 5000)
    })
}

export default mongooseConection
