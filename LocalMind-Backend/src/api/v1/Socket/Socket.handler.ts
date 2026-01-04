import { Server, Socket } from 'socket.io'
import { ChatRoom, IChatRoom } from './ChatRoom.model'
import { ChatMessage, IChatMessage } from './ChatMessage.model'
import { SocketUser, SocketEvents, AIConversationContext } from './Socket.types'
import { Types } from 'mongoose'
import AIProviderFactory from '../Ai-model/AIProviderFactory'

class SocketHandler {
  private io: Server
  private activeUsers: Map<string, SocketUser> = new Map()
  private userSockets: Map<string, string[]> = new Map() // userId -> socketIds
  private typingUsers: Map<string, Set<string>> = new Map() // roomId -> Set of userIds

  constructor(io: Server) {
    this.io = io
  }

  /**
   * Initialize all Socket.IO event handlers
   */
  initialize() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`)

      // Authentication middleware would go here
      const userId = socket.handshake.auth.userId
      const username = socket.handshake.auth.username

      if (!userId) {
        socket.disconnect()
        return
      }

      // Track user
      this.registerUser(userId, username, socket.id)

      // Event handlers
      socket.on('join:room', (data) => this.handleJoinRoom(socket, data))
      socket.on('leave:room', (data) => this.handleLeaveRoom(socket, data))
      socket.on('message:send', (data) => this.handleMessageSend(socket, data))
      socket.on('message:edit', (data) => this.handleMessageEdit(socket, data))
      socket.on('message:delete', (data) => this.handleMessageDelete(socket, data))
      socket.on('message:reaction', (data) => this.handleMessageReaction(socket, data))
      socket.on('typing:start', (data) => this.handleTypingStart(socket, data))
      socket.on('typing:stop', (data) => this.handleTypingStop(socket, data))
      socket.on('ai:respond', (data) => this.handleAIResponse(socket, data))
      socket.on('disconnect', () => this.handleDisconnect(socket, userId))
    })
  }

  /**
   * Register user and track their socket connection
   */
  private registerUser(userId: string, username: string, socketId: string) {
    const user: SocketUser = {
      id: userId,
      username,
      email: '',
      status: 'online',
    }

    this.activeUsers.set(userId, user)

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, [])
    }
    this.userSockets.get(userId)!.push(socketId)

    // Broadcast user online status
    this.io.emit('notification', {
      title: 'User Online',
      message: `${username} is now online`,
      type: 'info',
    })
  }

  /**
   * Handle user joining a room
   */
  private async handleJoinRoom(socket: Socket, data: { roomId: string; userId: string; username: string }) {
    try {
      const { roomId, userId, username } = data

      // Verify user has access to room
      const room = await ChatRoom.findOne({
        _id: roomId,
        $or: [{ members: userId }, { owner: userId }],
      })

      if (!room) {
        socket.emit('error', {
          code: 'ROOM_NOT_FOUND',
          message: 'Room not found or access denied',
        })
        return
      }

      // Join socket.io room
      socket.join(roomId)

      // Load recent messages
      const recentMessages = await ChatMessage.find({ roomId })
        .sort({ createdAt: -1 })
        .limit(50)
        .exec()

      // Emit user joined
      this.io.to(roomId).emit('user:joined', {
        userId,
        username,
      })

      // Send recent messages to joining user
      socket.emit('message:new', recentMessages.reverse())

      // Send active users in room
      const activeRoomUsers = Array.from(this.activeUsers.values()).filter(u =>
        room.members.some(m => m.toString() === u.id)
      )

      socket.emit('users:list', { users: activeRoomUsers })

      console.log(`User ${username} joined room ${roomId}`)
    } catch (error) {
      console.error('Error joining room:', error)
      socket.emit('error', {
        code: 'JOIN_ERROR',
        message: 'Failed to join room',
      })
    }
  }

  /**
   * Handle user leaving a room
   */
  private async handleLeaveRoom(socket: Socket, data: { roomId: string; userId: string }) {
    try {
      const { roomId, userId } = data
      const user = this.activeUsers.get(userId)

      if (!user) return

      socket.leave(roomId)

      this.io.to(roomId).emit('user:left', {
        userId,
        username: user.username,
      })

      console.log(`User ${user.username} left room ${roomId}`)
    } catch (error) {
      console.error('Error leaving room:', error)
    }
  }

  /**
   * Handle message send
   */
  private async handleMessageSend(
    socket: Socket,
    data: { roomId: string; message: string; type: 'text' | 'code'; metadata?: any }
  ) {
    try {
      const userId = Array.from(this.userSockets.entries()).find(([_, socketIds]) =>
        socketIds.includes(socket.id)
      )?.[0]

      if (!userId) {
        socket.emit('error', {
          code: 'AUTH_ERROR',
          message: 'User not authenticated',
        })
        return
      }

      const user = this.activeUsers.get(userId)
      if (!user) return

      const { roomId, message, type, metadata } = data

      // Verify room exists
      const room = await ChatRoom.findById(roomId)
      if (!room) {
        socket.emit('error', {
          code: 'ROOM_NOT_FOUND',
          message: 'Room not found',
        })
        return
      }

      // Create message
      const newMessage = await ChatMessage.create({
        roomId: new Types.ObjectId(roomId),
        userId: new Types.ObjectId(userId),
        username: user.username,
        message,
        type,
        metadata,
      })

      // Broadcast message
      this.io.to(roomId).emit('message:new', newMessage)

      console.log(`Message from ${user.username} in room ${roomId}`)
    } catch (error) {
      console.error('Error sending message:', error)
      socket.emit('error', {
        code: 'MESSAGE_ERROR',
        message: 'Failed to send message',
      })
    }
  }

  /**
   * Handle message edit
   */
  private async handleMessageEdit(socket: Socket, data: { messageId: string; newMessage: string }) {
    try {
      const { messageId, newMessage } = data

      const updated = await ChatMessage.findByIdAndUpdate(
        messageId,
        {
          message: newMessage,
          isEdited: true,
          editedAt: new Date(),
        },
        { new: true }
      )

      if (!updated) {
        socket.emit('error', {
          code: 'MESSAGE_NOT_FOUND',
          message: 'Message not found',
        })
        return
      }

      const roomId = updated.roomId.toString()
      this.io.to(roomId).emit('message:updated', updated)
    } catch (error) {
      console.error('Error editing message:', error)
      socket.emit('error', {
        code: 'EDIT_ERROR',
        message: 'Failed to edit message',
      })
    }
  }

  /**
   * Handle message delete
   */
  private async handleMessageDelete(socket: Socket, data: { messageId: string }) {
    try {
      const { messageId } = data

      const message = await ChatMessage.findByIdAndDelete(messageId)

      if (!message) {
        socket.emit('error', {
          code: 'MESSAGE_NOT_FOUND',
          message: 'Message not found',
        })
        return
      }

      const roomId = message.roomId.toString()
      this.io.to(roomId).emit('message:deleted', { messageId })
    } catch (error) {
      console.error('Error deleting message:', error)
      socket.emit('error', {
        code: 'DELETE_ERROR',
        message: 'Failed to delete message',
      })
    }
  }

  /**
   * Handle message reaction
   */
  private async handleMessageReaction(socket: Socket, data: { messageId: string; emoji: string; action: 'add' | 'remove' }) {
    try {
      const { messageId, emoji, action } = data

      const userId = Array.from(this.userSockets.entries()).find(([_, socketIds]) =>
        socketIds.includes(socket.id)
      )?.[0]

      if (!userId) return

      const message = await ChatMessage.findById(messageId)
      if (!message) return

      if (!message.reactions) {
        message.reactions = []
      }

      const reactionIndex = message.reactions.findIndex(r => r.emoji === emoji)

      if (action === 'add') {
        if (reactionIndex === -1) {
          message.reactions.push({
            emoji,
            userIds: [new Types.ObjectId(userId)],
          })
        } else if (!message.reactions[reactionIndex].userIds.some(id => id.toString() === userId)) {
          message.reactions[reactionIndex].userIds.push(new Types.ObjectId(userId))
        }
      } else if (action === 'remove' && reactionIndex !== -1) {
        message.reactions[reactionIndex].userIds = message.reactions[reactionIndex].userIds.filter(
          id => id.toString() !== userId
        )
        if (message.reactions[reactionIndex].userIds.length === 0) {
          message.reactions.splice(reactionIndex, 1)
        }
      }

      await message.save()

      const roomId = message.roomId.toString()
      this.io.to(roomId).emit('message:updated', message)
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  /**
   * Handle typing indicator
   */
  private handleTypingStart(socket: Socket, data: { roomId: string; userId: string }) {
    const { roomId, userId } = data

    if (!this.typingUsers.has(roomId)) {
      this.typingUsers.set(roomId, new Set())
    }

    this.typingUsers.get(roomId)!.add(userId)

    this.io.to(roomId).emit('typing:indicator', {
      userId,
      isTyping: true,
    })
  }

  /**
   * Handle typing stop
   */
  private handleTypingStop(socket: Socket, data: { roomId: string; userId: string }) {
    const { roomId, userId } = data

    if (this.typingUsers.has(roomId)) {
      this.typingUsers.get(roomId)!.delete(userId)
    }

    this.io.to(roomId).emit('typing:indicator', {
      userId,
      isTyping: false,
    })
  }

  /**
   * Handle AI response
   */
  private async handleAIResponse(socket: Socket, data: { roomId: string; message: string; model?: string }) {
    try {
      const { roomId, message, model } = data

      const room = await ChatRoom.findById(roomId)
      if (!room || !room.aiProvider || !room.aiModel) {
        socket.emit('error', {
          code: 'AI_NOT_CONFIGURED',
          message: 'AI provider not configured for this room',
        })
        return
      }

      // Get recent messages for context
      const recentMessages = await ChatMessage.find({ roomId })
        .sort({ createdAt: -1 })
        .limit(10)
        .exec()

      const context: AIConversationContext = {
        roomId,
        recentMessages: recentMessages.reverse(),
        temperature: 0.7,
        maxTokens: 2000,
      }

      // Get AI provider
      const aiProvider = AIProviderFactory.getProvider({
        type: room.aiProvider as any,
        model: room.aiModel,
      })

      // Generate response
      const response = await aiProvider.chat(message, context)

      // Broadcast AI response
      this.io.to(roomId).emit('ai:response', {
        message: response.message,
        type: 'text',
        model: room.aiModel,
      })

      // Save AI message to history
      await ChatMessage.create({
        roomId: new Types.ObjectId(roomId),
        userId: new Types.ObjectId('000000000000000000000000'), // Special AI user ID
        username: `AI-${room.aiModel}`,
        message: response.message,
        type: 'text',
      })
    } catch (error) {
      console.error('Error calling AI:', error)
      socket.emit('error', {
        code: 'AI_ERROR',
        message: 'Failed to get AI response',
      })
    }
  }

  /**
   * Handle user disconnect
   */
  private handleDisconnect(socket: Socket, userId: string) {
    const socketIds = this.userSockets.get(userId) || []
    const index = socketIds.indexOf(socket.id)

    if (index > -1) {
      socketIds.splice(index, 1)
    }

    // Remove user if no more connections
    if (socketIds.length === 0) {
      this.userSockets.delete(userId)
      const user = this.activeUsers.get(userId)
      if (user) {
        this.activeUsers.delete(userId)
        this.io.emit('notification', {
          title: 'User Offline',
          message: `${user.username} is now offline`,
          type: 'info',
        })
      }
    }

    console.log(`User disconnected: ${socket.id}`)
  }
}

export default SocketHandler
