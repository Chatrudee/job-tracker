// src/api/auth.ts
import { apiClient } from './client'
import type { LoginResponse, RegisterResponse, User } from '../types'

export const authAPI = {
  // POST /api/auth/login/
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post('/api/auth/login/', { username, password })
    return data
  },

  // POST /api/auth/register/
  register: async (payload: {
    username: string
    email: string
    password: string
    password2: string
    first_name?: string
    last_name?: string
  }): Promise<RegisterResponse> => {
    const { data } = await apiClient.post('/api/auth/register/', payload)
    return data
  },

  // GET /api/auth/profile/
  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get('/api/auth/profile/')
    return data
  },
}
