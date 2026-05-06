// src/pages/JobListPage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { JobCard } from '../components/ui/JobCard'
import { Button } from '../components/ui/Button'
import { AIModal } from '../components/ui/AIModal'
import { useJobs } from '../hooks/useJobs'
import { useAuth } from '../hooks/useAuth'
import type { AISuggestion, JobStatus } from '../types'

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: '📤 Applied', value: 'applied' },
  { label: '🎯 Interviewing', value: 'interviewing' },
  { label: '🎉 Offered', value: 'offered' },
  { label: '❌ Rejected', value: 'rejected' },
  { label: '↩️ Withdrawn', value: 'withdrawn' },
]

export default function JobListPage() {
  const { logout } = useAuth()
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch]             = useState('')
  const [searchInput, setSearchInput]   = useState('')

  const { jobs, loading, error, deleteJob, getAISuggestion } = useJobs({
    status: statusFilter || undefined,
    search: search || undefined,
  })

  const [aiModal, setAiModal]           = useState(false)
  const [aiLoading, setAiLoading]       = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null)
  const [aiError, setAiError]           = useState<string | null>(null)
  const [aiJobTitle, setAiJobTitle]     = useState('')

  const handleAISuggest = async (id: number) => {
    const job = jobs.find(j => j.id === id)
    setAiJobTitle(job ? `${job.position} @ ${job.company}` : '')
    setAiModal(true)
    setAiLoading(true)
    setAiSuggestion(null)
    setAiError(null)
    try {
      const suggestion = await getAISuggestion(id)
      setAiSuggestion(suggestion)
    } catch {
      setAiError('Failed to get AI suggestion.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-bold text-gray-900">
            🎯 Job Tracker
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/jobs/new">
              <Button size="sm">+ Add Job</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            All Applications
            <span className="ml-2 text-base font-normal text-gray-400">
              ({jobs.length})
            </span>
          </h1>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 sm:ml-auto">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search company or position..."
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
            />
            <Button type="submit" variant="outline" size="sm">Search</Button>
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(''); setSearchInput('') }}
              >
                Clear
              </Button>
            )}
          </form>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-600 font-medium">No applications found</p>
            <p className="text-gray-400 text-sm mt-1">Try changing your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={deleteJob}
                onAISuggest={handleAISuggest}
              />
            ))}
          </div>
        )}
      </main>

      <AIModal
        isOpen={aiModal}
        onClose={() => setAiModal(false)}
        loading={aiLoading}
        suggestion={aiSuggestion}
        error={aiError}
        jobTitle={aiJobTitle}
      />
    </div>
  )
}
