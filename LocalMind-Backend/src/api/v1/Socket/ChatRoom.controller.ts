import { Request, Response } from 'express'
import ChatRoomService from './ChatRoom.service'

class ChatRoomController {
  /**
   * POST /api/v1/chat/rooms
   * Create a new chat room
   */
  async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { name, description, type, aiProvider, aiModel } = req.body

      if (!name) {
        res.status(400).json({ error: 'Room name is required' })
        return
      }

      const room = await ChatRoomService.createRoom(userId, {
        name,
        description,
        type,
        aiProvider,
        aiModel,
      })

      res.status(201).json({
        success: true,
        data: room,
        message: 'Chat room created successfully',
      })
    } catch (error: any) {
      console.error('Error creating room:', error)
      res.status(500).json({ error: 'Failed to create room' })
    }
  }

  /**
   * GET /api/v1/chat/rooms
   * Get all rooms for user
   */
  async getUserRooms(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { skip = 0, limit = 20 } = req.query

      const result = await ChatRoomService.getUserRooms(
        userId,
        parseInt(skip as string) || 0,
        parseInt(limit as string) || 20
      )

      res.status(200).json({
        success: true,
        data: result.rooms,
        pagination: {
          skip: parseInt(skip as string) || 0,
          limit: parseInt(limit as string) || 20,
          total: result.total,
        },
      })
    } catch (error) {
      console.error('Error fetching rooms:', error)
      res.status(500).json({ error: 'Failed to fetch rooms' })
    }
  }

  /**
   * GET /api/v1/chat/rooms/:id
   * Get room by ID
   */
  async getRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const room = await ChatRoomService.getRoom(id, userId)

      if (!room) {
        res.status(404).json({ error: 'Room not found' })
        return
      }

      res.status(200).json({
        success: true,
        data: room,
      })
    } catch (error) {
      console.error('Error fetching room:', error)
      res.status(500).json({ error: 'Failed to fetch room' })
    }
  }

  /**
   * PUT /api/v1/chat/rooms/:id
   * Update room
   */
  async updateRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const room = await ChatRoomService.updateRoom(id, userId, req.body)

      if (!room) {
        res.status(404).json({ error: 'Room not found' })
        return
      }

      res.status(200).json({
        success: true,
        data: room,
        message: 'Room updated successfully',
      })
    } catch (error: any) {
      console.error('Error updating room:', error)
      res.status(500).json({ error: error.message || 'Failed to update room' })
    }
  }

  /**
   * DELETE /api/v1/chat/rooms/:id
   * Delete room
   */
  async deleteRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const success = await ChatRoomService.deleteRoom(id, userId)

      if (!success) {
        res.status(404).json({ error: 'Room not found' })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Room deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting room:', error)
      res.status(500).json({ error: 'Failed to delete room' })
    }
  }

  /**
   * POST /api/v1/chat/rooms/:id/members
   * Add member to room
   */
  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params
      const { memberId } = req.body

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const room = await ChatRoomService.addMember(id, userId, memberId)

      if (!room) {
        res.status(404).json({ error: 'Room not found' })
        return
      }

      res.status(200).json({
        success: true,
        data: room,
        message: 'Member added successfully',
      })
    } catch (error: any) {
      console.error('Error adding member:', error)
      res.status(500).json({ error: error.message || 'Failed to add member' })
    }
  }

  /**
   * GET /api/v1/chat/rooms/:id/messages
   * Get room messages
   */
  async getRoomMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params
      const { skip = 0, limit = 50 } = req.query

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const result = await ChatRoomService.getRoomMessages(
        id,
        userId,
        parseInt(skip as string) || 0,
        parseInt(limit as string) || 50
      )

      res.status(200).json({
        success: true,
        data: result.messages,
        pagination: {
          skip: parseInt(skip as string) || 0,
          limit: parseInt(limit as string) || 50,
          total: result.total,
        },
      })
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      res.status(500).json({ error: error.message || 'Failed to fetch messages' })
    }
  }

  /**
   * GET /api/v1/chat/rooms/:id/search
   * Search messages in room
   */
  async searchMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      const { id } = req.params
      const { query } = req.query

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      if (!query) {
        res.status(400).json({ error: 'Search query is required' })
        return
      }

      const messages = await ChatRoomService.searchMessages(id, userId, query as string)

      res.status(200).json({
        success: true,
        data: messages,
      })
    } catch (error: any) {
      console.error('Error searching messages:', error)
      res.status(500).json({ error: error.message || 'Failed to search messages' })
    }
  }
}

export default new ChatRoomController()
