import { Types } from 'mongoose'
import { ChatRoom, IChatRoom } from './ChatRoom.model'
import { ChatMessage } from './ChatMessage.model'

class ChatRoomService {
  /**
   * Create a new chat room
   */
  async createRoom(userId: string, data: any): Promise<IChatRoom> {
    const room = await ChatRoom.create({
      name: data.name,
      description: data.description,
      type: data.type || 'public',
      owner: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)],
      aiProvider: data.aiProvider,
      aiModel: data.aiModel,
      settings: data.settings,
    })

    return room
  }

  /**
   * Get all rooms for a user
   */
  async getUserRooms(userId: string, skip: number = 0, limit: number = 20): Promise<{ rooms: IChatRoom[]; total: number }> {
    const [rooms, total] = await Promise.all([
      ChatRoom.find({
        $or: [{ owner: userId }, { members: userId }],
        isActive: true,
      })
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .exec(),
      ChatRoom.countDocuments({
        $or: [{ owner: userId }, { members: userId }],
        isActive: true,
      }),
    ])

    return { rooms, total }
  }

  /**
   * Get room by ID
   */
  async getRoom(roomId: string, userId: string): Promise<IChatRoom | null> {
    return await ChatRoom.findOne({
      _id: roomId,
      $or: [{ owner: userId }, { members: userId }],
    })
  }

  /**
   * Add member to room
   */
  async addMember(roomId: string, userId: string, memberId: string): Promise<IChatRoom | null> {
    const room = await ChatRoom.findOne({
      _id: roomId,
      owner: userId,
    })

    if (!room) {
      throw new Error('Room not found or access denied')
    }

    if (!room.members.some(m => m.toString() === memberId)) {
      room.members.push(new Types.ObjectId(memberId))
      await room.save()
    }

    return room
  }

  /**
   * Remove member from room
   */
  async removeMember(roomId: string, userId: string, memberId: string): Promise<IChatRoom | null> {
    const room = await ChatRoom.findOne({
      _id: roomId,
      owner: userId,
    })

    if (!room) {
      throw new Error('Room not found or access denied')
    }

    room.members = room.members.filter(m => m.toString() !== memberId)
    await room.save()

    return room
  }

  /**
   * Update room
   */
  async updateRoom(roomId: string, userId: string, data: any): Promise<IChatRoom | null> {
    const room = await ChatRoom.findOneAndUpdate(
      {
        _id: roomId,
        owner: userId,
      },
      data,
      { new: true }
    )

    return room
  }

  /**
   * Delete room
   */
  async deleteRoom(roomId: string, userId: string): Promise<boolean> {
    const room = await ChatRoom.findOneAndUpdate(
      {
        _id: roomId,
        owner: userId,
      },
      { isActive: false },
      { new: true }
    )

    return !!room
  }

  /**
   * Get room messages
   */
  async getRoomMessages(roomId: string, userId: string, skip: number = 0, limit: number = 50): Promise<any> {
    // Verify access
    const room = await this.getRoom(roomId, userId)
    if (!room) {
      throw new Error('Room not found or access denied')
    }

    const [messages, total] = await Promise.all([
      ChatMessage.find({ roomId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      ChatMessage.countDocuments({ roomId }),
    ])

    return { messages: messages.reverse(), total }
  }

  /**
   * Search messages in room
   */
  async searchMessages(roomId: string, userId: string, query: string): Promise<any[]> {
    // Verify access
    const room = await this.getRoom(roomId, userId)
    if (!room) {
      throw new Error('Room not found or access denied')
    }

    return await ChatMessage.find({
      roomId,
      message: { $regex: query, $options: 'i' },
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .exec()
  }
}

export default new ChatRoomService()
