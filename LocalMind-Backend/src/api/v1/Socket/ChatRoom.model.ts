import { Schema, Document, Types, model } from 'mongoose'

export interface IChatRoom extends Document {
  name: string
  description?: string
  type: 'private' | 'public' | 'direct'
  owner: Types.ObjectId
  members: Types.ObjectId[]
  aiProvider?: 'ollama' | 'groq' | 'openai' | 'anthropic' | 'google'
  aiModel?: string
  settings?: {
    maxMessages?: number
    autoArchive?: boolean
    allowFiles?: boolean
    allowCode?: boolean
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ChatRoomSchema = new Schema<IChatRoom>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ['private', 'public', 'direct'],
      default: 'public',
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    aiProvider: {
      type: String,
      enum: ['ollama', 'groq', 'openai', 'anthropic', 'google'],
    },
    aiModel: String,
    settings: {
      maxMessages: {
        type: Number,
        default: 1000,
      },
      autoArchive: {
        type: Boolean,
        default: false,
      },
      allowFiles: {
        type: Boolean,
        default: true,
      },
      allowCode: {
        type: Boolean,
        default: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound indices
ChatRoomSchema.index({ owner: 1, isActive: 1 })
ChatRoomSchema.index({ members: 1, isActive: 1 })
ChatRoomSchema.index({ type: 1, isActive: 1 })
ChatRoomSchema.index({ createdAt: -1 })

export const ChatRoom = model<IChatRoom>('ChatRoom', ChatRoomSchema)
