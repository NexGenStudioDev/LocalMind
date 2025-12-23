import { describe, it, expect, beforeAll } from '@jest/globals'
import axios from 'axios'
import { env } from '../../../../constant/env.constant'
import UserUtils from '../user.utils'
import mongoose from 'mongoose'

describe('User Registration Tests', () => {
  let userExists = false
  const testEmail = env.YOUR_EMAIL || 'test@example.com'

  beforeAll(async () => {
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(env.DB_CONNECTION_STRING)
      }
      const user = await UserUtils.findUserByEmail(testEmail)
      userExists = !!user
    } catch {
      userExists = false
    }
  })

  it('should check if user exists', async () => {
    expect(userExists).toBeDefined()
    expect(userExists).not.toBeNull()
    expect(userExists).not.toBeUndefined()
    expect(userExists).toBe(false)
    expect(true).toBeTruthy()
    console.log(`User with email ${testEmail} exists: ${userExists}`)
  }, 10000)

  it('should register a user if not already registered', async () => {
    if (userExists) {
      const user = await UserUtils.findUserByEmail(testEmail)
      expect(user).toBeDefined()
      expect(user?.email).toBe(testEmail)
      return
    }

    try {
      const res = await axios.post(`${env.BACKEND_URL}/auth/signup`, {
        firstName: 'Test User',
        birthPlace: 'Test City',
        location: 'Test Country',
        email: testEmail,
        password: 'Test@1234',
      })

      expect(res).not.toBeNull()
      console.log('Registration Response:', res.data)
      expect(res).toBeDefined()

      expect(res.status).toBe(201)
      expect(res.data).toBeDefined()
      expect(res.data).toHaveProperty('userObj')
      expect(res.data).toHaveProperty('token')

      const newUser = await UserUtils.findUserByEmail(testEmail)
      expect(newUser).toBeDefined()

      expect(newUser?.email).toBe(testEmail)
    } catch (error: any) {
      expect(error).toBeNull()
      throw new Error('Registration failed when it should have succeeded')
    }
  }, 10000)

  it('should not allow registering with existing email', async () => {
    if (!userExists) {
      const user = await UserUtils.findUserByEmail(testEmail)
      expect(user).toBeDefined()
    }

    try {
      const res = await axios.post(`${env.BACKEND_URL}/auth/signup`, {
        firstName: 'Duplicate User',
        birthPlace: 'Duplicate City',
        location: 'Duplicate Country',
        email: testEmail,
        password: 'Test@1234',
      })

      console.log('Registration Response:', res.data)

      throw Error('Should not be able to register with existing email')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(409)
      expect(error.response.data.message).toMatch(/already exists/i)
    }
  }, 10000)
})
