// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api/auth'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ตรวจสอบ token ตอน app เริ่ม
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) { setLoading(false); return }

    authAPI.getProfile()
      .then(setUser)
      .catch(() => localStorage.clear())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const data = await authAPI.login(username, password)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const profile = await authAPI.getProfile()
    setUser(profile)
    return profile
  }, [])

  const register = useCallback(async (payload: {
    username: string; email: string
    password: string; password2: string
    first_name?: string; last_name?: string
  }) => {
    const data = await authAPI.register(payload)
    localStorage.setItem('access_token', data.tokens.access)
    localStorage.setItem('refresh_token', data.tokens.refresh)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    window.location.href = '/login'
  }, [])

  return { user, loading, isAuthenticated: !!user, login, register, logout }
}
