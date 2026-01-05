import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Updated schema matching SignUp.tsx (removed confirmPassword, added role)
const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  role: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  birthPlace: z.string().min(1, 'Birth place is required'),
  location: z.string().min(1, 'Location is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[@$!%*?&]/, 'Must contain special character'),
  portfolioUrl: z.string().url('Please enter a valid URL').or(z.literal('')),
  bio: z.string().max(50, 'Bio must be less than 50 characters'),
})

describe('SignUp Schema Validation', () => {
  const validFormData = {
    firstName: 'John',
    role: '',
    email: 'john@example.com',
    birthPlace: 'New York',
    location: 'California',
    password: 'ValidPass@123',
    portfolioUrl: '',
    bio: 'A developer',
  }

  describe('Valid Input Tests', () => {
    it('should accept valid complete form data', () => {
      const result = signUpSchema.safeParse(validFormData)
      expect(result.success).toBe(true)
    })

    it('should accept empty portfolioUrl', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        portfolioUrl: '',
      })
      expect(result.success).toBe(true)
    })

    it('should accept valid portfolioUrl', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        portfolioUrl: 'https://portfolio.example.com',
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty bio', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        bio: '',
      })
      expect(result.success).toBe(true)
    })

    it('should accept form with role', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        role: 'Product Manager',
      })
      expect(result.success).toBe(true)
    })

    it('should accept form without role (optional)', () => {
      const { role, ...dataWithoutRole } = validFormData
      const result = signUpSchema.safeParse(dataWithoutRole)
      expect(result.success).toBe(true)
    })
  })

  describe('Password Validation Tests', () => {
    it('should reject password without uppercase letter', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        password: 'lowercase@123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('uppercase')
      }
    })

    it('should reject password without lowercase letter', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        password: 'UPPERCASE@123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('lowercase')
      }
    })

    it('should reject password without number', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        password: 'NoNumber@Pass',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('number')
      }
    })

    it('should reject password without special character', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        password: 'NoSpecial123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('special')
      }
    })

    it('should reject password shorter than 8 characters', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        password: 'Sh@1',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('8 characters')
      }
    })
  })

  describe('Required Fields Tests', () => {
    it('should reject empty firstName', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        firstName: '',
      })
      expect(result.success).toBe(false)
    })

    it('should reject empty email', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        email: '',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid email format', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        email: 'invalid-email',
      })
      expect(result.success).toBe(false)
    })

    it('should reject empty birthPlace', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        birthPlace: '',
      })
      expect(result.success).toBe(false)
    })

    it('should reject empty location', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        location: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Bio Validation Tests', () => {
    it('should reject bio longer than 50 characters', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        bio: 'A'.repeat(51),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('50 characters')
      }
    })

    it('should accept bio exactly 50 characters', () => {
      const result = signUpSchema.safeParse({
        ...validFormData,
        bio: 'A'.repeat(50),
      })
      expect(result.success).toBe(true)
    })
  })
})
