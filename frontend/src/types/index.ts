// src/types/index.ts
// TypeScript types ทั้งหมดของ app — define ที่นี่ที่เดียว

export type JobStatus =
  | 'applied'
  | 'interviewing'
  | 'offered'
  | 'rejected'
  | 'withdrawn'

export interface JobApplication {
  id: number
  company: string
  position: string
  status: JobStatus
  applied_date: string
  notes: string
  job_url: string
  salary_range: string
  days_since_applied: number
  created_at: string
  updated_at: string
}

export interface JobApplicationCreate {
  company: string
  position: string
  status: JobStatus
  applied_date: string
  notes?: string
  job_url?: string
  salary_range?: string
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginResponse {
  access: string
  refresh: string
}

export interface RegisterResponse {
  user: User
  tokens: AuthTokens
  message: string
}

export interface Stats {
  total: number
  applied: number
  interviewing: number
  offered: number
  rejected: number
  withdrawn: number
  success_rate: number
}

export interface AISuggestion {
  subject: string
  body: string
  full: string
  job: {
    company: string
    position: string
    status: string
  }
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
