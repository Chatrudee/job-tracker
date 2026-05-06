// src/api/jobs.ts
import { apiClient } from './client'
import type {
  JobApplication,
  JobApplicationCreate,
  Stats,
  AISuggestion,
  PaginatedResponse,
} from '../types'

export const jobsAPI = {
  // GET /api/jobs/
  list: async (params?: {
    status?: string
    search?: string
    page?: number
  }): Promise<PaginatedResponse<JobApplication>> => {
    const { data } = await apiClient.get('/api/jobs/', { params })
    return data
  },

  // POST /api/jobs/
  create: async (payload: JobApplicationCreate): Promise<JobApplication> => {
    const { data } = await apiClient.post('/api/jobs/', payload)
    return data
  },

  // GET /api/jobs/:id/
  get: async (id: number): Promise<JobApplication> => {
    const { data } = await apiClient.get(`/api/jobs/${id}/`)
    return data
  },

  // PATCH /api/jobs/:id/
  update: async (id: number, payload: Partial<JobApplicationCreate>): Promise<JobApplication> => {
    const { data } = await apiClient.patch(`/api/jobs/${id}/`, payload)
    return data
  },

  // DELETE /api/jobs/:id/
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/jobs/${id}/`)
  },

  // GET /api/jobs/stats/
  getStats: async (): Promise<Stats> => {
    const { data } = await apiClient.get('/api/jobs/stats/')
    return data
  },

  // POST /api/jobs/:id/ai-suggest/
  aiSuggest: async (id: number): Promise<AISuggestion> => {
    const { data } = await apiClient.post(`/api/jobs/${id}/ai-suggest/`)
    return data
  },
}
