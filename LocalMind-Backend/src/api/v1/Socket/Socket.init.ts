import { Server as HTTPServer } from 'http'
import { Server, Socket } from 'socket.io'
import SocketHandler from './Socket.handler'

/**
 * Initialize Socket.IO server with authentication and handlers
 */
export function initializeSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingInterval: 25000,
    pingTimeout: 20000,
  })

  // Authentication middleware
  io.use((socket: Socket, next) => {
    const userId = socket.handshake.auth.userId
    const token = socket.handshake.auth.token

    if (!userId || !token) {
      return next(new Error('Authentication error'))
    }

    // You should verify the token here with your auth system
    // For now, we'll just check if userId exists
    socket.userId = userId
    next()
  })

  // Initialize socket handler
  const socketHandler = new SocketHandler(io)
  socketHandler.initialize()

  return io
}

export default initializeSocket
