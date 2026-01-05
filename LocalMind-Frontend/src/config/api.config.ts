// API Configuration
// Centralized API base URL to avoid hardcoding

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/v1/auth/signup`,
    LOGIN: `${API_BASE_URL}/api/v1/user/login`,
    PROFILE: `${API_BASE_URL}/api/v1/user/profile`,
  },
} as const
