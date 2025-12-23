import mongoose, { Schema, Model } from 'mongoose'
import { IUser } from './user.type'
import { AllowedUserRoles } from './user.constant'

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: AllowedUserRoles,
      default: 'user',
    },
    birthPlace: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    portfolioUrl: {
      type: String,
      default: null,
      trim: true,
    },
    bio: {
      type: String,
      default: null,
      trim: true,
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
