import { Types } from 'mongoose'

export interface SocketUser {
  id: string
  username: string
  email: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  currentRoom?: string
}

export interface ChatMessage {
  _id?: Types.ObjectId
  roomId: string
  userId: string
  username: string
  message: string
  type: 'text' | 'code' | 'file' | 'system'
  metadata?: {
    language?: string // for code blocks
    fileName?: string // for files
    fileSize?: number
    fileUrl?: string
  }
  reactions?: { emoji: string; userIds: string[] }[]
  isEdited?: boolean
  editedAt?: Date
  createdAt: Date
  updatedAt?: Date
}

export interface ChatRoom {
  _id?: Types.ObjectId
  name: string
  description?: string
  type: 'private' | 'public' | 'direct'
  owner: string
  members: string[]
  aiProvider?: 'ollama' | 'groq' | 'openai' | 'anthropic' | 'google'
  aiModel?: string
  settings?: {
    maxMessages?: number
    autoArchive?: boolean
    allowFiles?: boolean
    allowCode?: boolean
  }
  createdAt: Date
  updatedAt?: Date
}

export interface AIProviderConfig {
  type: 'ollama' | 'groq' | 'openai' | 'anthropic' | 'google'
  apiKey?: string
  baseUrl?: string // for Ollama
  model: string
}

export interface SocketEvents {
  // Client -> Server
  'join:room': { roomId: string; userId: string; username: string }
  'leave:room': { roomId: string; userId: string }
  'message:send': { roomId: string; message: string; type: 'text' | 'code'; metadata?: any }
  'message:edit': { messageId: string; newMessage: string }
  'message:delete': { messageId: string }
  'message:reaction': { messageId: string; emoji: string; action: 'add' | 'remove' }
  'typing:start': { roomId: string; userId: string }
  'typing:stop': { roomId: string; userId: string }
  'user:status': { userId: string; status: 'online' | 'offline' | 'away' }
  'ai:respond': { roomId: string; message: string; model?: string }
  'call:start': { roomId: string; to: string; callData: any }
  'call:accept': { roomId: string; callData: any }
  'call:reject': { roomId: string }
  'disconnect': void

  // Server -> Client
  'message:new': ChatMessage
  'message:updated': ChatMessage
  'message:deleted': { messageId: string }
  'user:joined': { userId: string; username: string }
  'user:left': { userId: string; username: string }
  'users:list': { users: SocketUser[] }
  'typing:indicator': { userId: string; isTyping: boolean }
  'ai:response': { message: string; type: 'text' | 'code'; model: string }
  'error': { code: string; message: string }
  'notification': { title: string; message: string; type: 'info' | 'warning' | 'error' }
}

export interface AIConversationContext {
  roomId: string
  recentMessages: ChatMessage[]
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}
