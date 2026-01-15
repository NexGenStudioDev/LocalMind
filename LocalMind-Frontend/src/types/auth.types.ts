// Authentication Types

export interface SignUpPayload {
  firstName: string
  email: string
  password: string
  birthPlace: string
  location: string
  portfolioUrl: string
  bio: string
  role: 'user'
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    username: string
    email: string
    token: string
  }
}

export interface ApiError {
  success: false
  message: string
  error?: unknown
}
