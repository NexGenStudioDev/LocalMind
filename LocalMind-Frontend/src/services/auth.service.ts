import axios, { AxiosError } from 'axios'
import { API_ENDPOINTS } from '../config/api.config'
import type { SignUpPayload, AuthResponse, ApiError } from '../types/auth.types'

const authApi = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function registerUser(data: SignUpPayload): Promise<AuthResponse> {
  try {
    const response = await authApi.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError = error.response.data as ApiError
      throw new Error(apiError.message || 'Registration failed')
    }
    throw new Error('Network error. Please try again.')
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await authApi.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, { email, password })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError = error.response.data as ApiError
      throw new Error(apiError.message || 'Login failed')
    }
    throw new Error('Network error. Please try again.')
  }
}
