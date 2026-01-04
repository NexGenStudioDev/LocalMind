import { Router } from 'express'
import ChatRoomController from './ChatRoom.controller'

const router = Router()

/**
 * Chat Room Routes
 * All routes require authentication
 */

/**
 * POST /api/v1/chat/rooms
 * Create a new chat room
 */
router.post('/', ChatRoomController.createRoom.bind(ChatRoomController))

/**
 * GET /api/v1/chat/rooms
 * Get all chat rooms for user
 */
router.get('/', ChatRoomController.getUserRooms.bind(ChatRoomController))

/**
 * GET /api/v1/chat/rooms/:id
 * Get specific room
 */
router.get('/:id', ChatRoomController.getRoom.bind(ChatRoomController))

/**
 * PUT /api/v1/chat/rooms/:id
 * Update room
 */
router.put('/:id', ChatRoomController.updateRoom.bind(ChatRoomController))

/**
 * DELETE /api/v1/chat/rooms/:id
 * Delete room
 */
router.delete('/:id', ChatRoomController.deleteRoom.bind(ChatRoomController))

/**
 * POST /api/v1/chat/rooms/:id/members
 * Add member to room
 */
router.post('/:id/members', ChatRoomController.addMember.bind(ChatRoomController))

/**
 * GET /api/v1/chat/rooms/:id/messages
 * Get messages in room
 */
router.get('/:id/messages', ChatRoomController.getRoomMessages.bind(ChatRoomController))

/**
 * GET /api/v1/chat/rooms/:id/search
 * Search messages in room
 */
router.get('/:id/search', ChatRoomController.searchMessages.bind(ChatRoomController))

export default router
