import mongoose, { Schema, Model } from 'mongoose'
import { IUser } from './user.type'

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: 'user',
    },
    apikey: {
      type: String,
      default: null,
    },
    model: {
      type: String,
      default: null,
    },
    modelApiKey: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default User
