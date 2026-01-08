/**
 * API Service for backend communication
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
  }

  /**
   * Generic fetch method
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const token = localStorage.getItem('authToken')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error: any) {
      throw new Error(error.message || 'An error occurred')
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    return this.request('/v1/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  /**
   * Register user
   */
  async register(userData: {
    firstName: string
    email: string
    password: string
    birthPlace: string
    location: string
    bio?: string
    portfolioUrl?: string
  }): Promise<ApiResponse<any>> {
    return this.request('/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/v1/auth/profile', {
      method: 'GET',
    })
  }

  /**
   * Generate API Key
   */
  async generateApiKey(): Promise<ApiResponse<any>> {
    return this.request('/v1/auth/apiKey/generate', {
      method: 'GET',
    })
  }

  /**
   * Get API Key
   */
  async getApiKey(): Promise<ApiResponse<any>> {
    return this.request('/v1/auth/apiKey', {
      method: 'GET',
    })
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('authToken')
    localStorage.removeItem('rememberedEmail')
  }
}

export default new ApiService()
