// src/hooks/useJobs.ts
import { useState, useEffect, useCallback } from 'react'
import { jobsAPI } from '../api/jobs'
import type { JobApplication, Stats, AISuggestion } from '../types'

export function useJobs(filters?: { status?: string; search?: string }) {
  const [jobs, setJobs]       = useState<JobApplication[]>([])
  const [stats, setStats]     = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [jobsRes, statsRes] = await Promise.all([
        jobsAPI.list(filters),
        jobsAPI.getStats(),
      ])
      setJobs(jobsRes.results)
      setStats(statsRes)
    } catch {
      setError('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }, [filters?.status, filters?.search])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const createJob = async (payload: Parameters<typeof jobsAPI.create>[0]) => {
    const job = await jobsAPI.create(payload)
    setJobs(prev => [job, ...prev])
    return job
  }

  const updateJob = async (id: number, payload: Parameters<typeof jobsAPI.update>[1]) => {
    const updated = await jobsAPI.update(id, payload)
    setJobs(prev => prev.map(j => j.id === id ? updated : j))
    return updated
  }

  const deleteJob = async (id: number) => {
    await jobsAPI.delete(id)
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  const getAISuggestion = async (id: number): Promise<AISuggestion> => {
    return jobsAPI.aiSuggest(id)
  }

  return { jobs, stats, loading, error, createJob, updateJob, deleteJob, getAISuggestion, refetch: fetchJobs }
}
