import { Schema, Document, Types, model } from 'mongoose'

export interface IChatMessage extends Document {
  roomId: Types.ObjectId
  userId: Types.ObjectId
  username: string
  message: string
  type: 'text' | 'code' | 'file' | 'system'
  metadata?: {
    language?: string
    fileName?: string
    fileSize?: number
    fileUrl?: string
  }
  reactions?: Array<{
    emoji: string
    userIds: Types.ObjectId[]
  }>
  isEdited: boolean
  editedAt?: Date
  createdAt: Date
  updatedAt?: Date
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    type: {
      type: String,
      enum: ['text', 'code', 'file', 'system'],
      default: 'text',
    },
    metadata: {
      language: String,
      fileName: String,
      fileSize: Number,
      fileUrl: String,
    },
    reactions: [
      {
        emoji: String,
        userIds: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Indices for performance
ChatMessageSchema.index({ roomId: 1, createdAt: -1 })
ChatMessageSchema.index({ userId: 1, createdAt: -1 })
ChatMessageSchema.index({ roomId: 1, userId: 1 })

export const ChatMessage = model<IChatMessage>('ChatMessage', ChatMessageSchema)
