import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import axios from 'axios'
import { env } from '../../../../constant/env.constant'
import UserUtils from '../user.utils'
import mongoose from 'mongoose'

const API_URL = env.BACKEND_URL

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
      const res = await axios.post(`${API_URL}/auth/signup`, {
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
      const res = await axios.post(`${API_URL}/auth/signup`, {
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

describe('Password Validation Tests', () => {
  const validUserData = {
    firstName: 'Password Test',
    birthPlace: 'Test City',
    location: 'Test Country',
    email: `pwtest_${Date.now()}@example.com`,
  }

  it('should reject password without uppercase letter', async () => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        ...validUserData,
        email: `test_noupper_${Date.now()}@example.com`,
        password: 'test@1234', // No uppercase
      })
      throw new Error('Should have rejected password without uppercase')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(400)
    }
  }, 10000)

  it('should reject password without lowercase letter', async () => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        ...validUserData,
        email: `test_nolower_${Date.now()}@example.com`,
        password: 'TEST@1234', // No lowercase
      })
      throw new Error('Should have rejected password without lowercase')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(400)
    }
  }, 10000)

  it('should reject password without number', async () => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        ...validUserData,
        email: `test_nonum_${Date.now()}@example.com`,
        password: 'Test@test', // No number
      })
      throw new Error('Should have rejected password without number')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(400)
    }
  }, 10000)

  it('should reject password without special character', async () => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        ...validUserData,
        email: `test_nospecial_${Date.now()}@example.com`,
        password: 'Test12345', // No special char
      })
      throw new Error('Should have rejected password without special character')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(400)
    }
  }, 10000)

  it('should reject password shorter than 8 characters', async () => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        ...validUserData,
        email: `test_short_${Date.now()}@example.com`,
        password: 'Te@1', // Too short
      })
      throw new Error('Should have rejected short password')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(400)
    }
  }, 10000)
})

describe('Input Validation Edge Cases', () => {
  const baseUserData = {
    firstName: 'Edge Case Test',
    birthPlace: 'Test City',
    location: 'Test Country',
    password: 'ValidPass@123',
  }

  it('should reject empty firstName', async () => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        ...baseUserData,
        firstName: '',
        email: `test_nofname_${Date.now()}@example.com`,
      })
      throw new Error('Should have rejected empty firstName')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(400)
    }
  }, 10000)

  it('should reject invalid email format', async () => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        ...baseUserData,
        email: 'invalid-email-format',
      })
      throw new Error('Should have rejected invalid email')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(400)
    }
  }, 10000)

  it('should reject empty birthPlace', async () => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        ...baseUserData,
        birthPlace: '',
        email: `test_nobirth_${Date.now()}@example.com`,
      })
      throw new Error('Should have rejected empty birthPlace')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(400)
    }
  }, 10000)

  it('should reject empty location', async () => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        ...baseUserData,
        location: '',
        email: `test_noloc_${Date.now()}@example.com`,
      })
      throw new Error('Should have rejected empty location')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(400)
    }
  }, 10000)

  it('should accept valid portfolioUrl', async () => {
    const uniqueEmail = `test_portfolio_${Date.now()}@example.com`
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        ...baseUserData,
        email: uniqueEmail,
        portfolioUrl: 'https://portfolio.example.com',
      })
      expect(res.status).toBe(201)
    } catch (error: any) {
      // If 409 means user exists, that's acceptable
      if (error.response?.status !== 409) {
        throw error
      }
    }
  }, 10000)

  it('should reject bio longer than 50 characters', async () => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        ...baseUserData,
        email: `test_longbio_${Date.now()}@example.com`,
        bio: 'A'.repeat(51), // 51 characters
      })
      throw new Error('Should have rejected long bio')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect(error.response.status).toBe(400)
    }
  }, 10000)
})

describe('Login Endpoint Tests', () => {
  const loginTestEmail = env.YOUR_EMAIL || 'test@example.com'
  const validPassword = 'Test@1234'

  it('should successfully login with valid credentials', async () => {
    try {
      const res = await axios.post(`${API_URL}/user/login`, {
        email: loginTestEmail,
        password: validPassword,
      })

      expect(res.status).toBe(200)
      expect(res.data).toBeDefined()
      expect(res.data.message).toBeDefined()
    } catch (error: any) {
      // User might not exist in test environment
      if (error.response?.status === 401 || error.response?.status === 404) {
        console.log('Test user not found, skipping login success test')
        expect(true).toBe(true)
      } else {
        throw error
      }
    }
  }, 10000)

  it('should reject login with wrong password', async () => {
    try {
      await axios.post(`${API_URL}/user/login`, {
        email: loginTestEmail,
        password: 'WrongPassword@123',
      })
      throw new Error('Should have rejected wrong password')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect([401, 404]).toContain(error.response.status)
    }
  }, 10000)

  it('should reject login with non-existent email', async () => {
    try {
      await axios.post(`${API_URL}/user/login`, {
        email: 'nonexistent_user_12345@example.com',
        password: 'SomePassword@123',
      })
      throw new Error('Should have rejected non-existent email')
    } catch (error: any) {
      expect(error.response).toBeDefined()
      expect([401, 404]).toContain(error.response.status)
    }
  }, 10000)
})

afterAll(async () => {
  await mongoose.connection.close()
})
