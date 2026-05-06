// src/api/client.ts
// Axios instance หลัก — จัดการ JWT token อัตโนมัติ

import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request Interceptor ───────────────────────────────────
// แนบ JWT token ทุก request อัตโนมัติ
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response Interceptor ──────────────────────────────────
// ถ้าได้ 401 → refresh token อัตโนมัติ
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        // ไม่มี refresh token → logout
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API_BASE}/api/auth/refresh/`, {
          refresh: refreshToken,
        })
        localStorage.setItem('access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return apiClient(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)
