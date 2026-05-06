// src/pages/DashboardPage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { StatsCard } from '../components/ui/StatsCard'
import { JobCard } from '../components/ui/JobCard'
import { AIModal } from '../components/ui/AIModal'
import { Button } from '../components/ui/Button'
import { useJobs } from '../hooks/useJobs'
import { useAuth } from '../hooks/useAuth'
import type { AISuggestion } from '../types'

const STATUS_COLORS = {
  applied:      '#3b82f6',
  interviewing: '#f59e0b',
  offered:      '#10b981',
  rejected:     '#ef4444',
  withdrawn:    '#6b7280',
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { jobs, stats, loading, deleteJob, getAISuggestion } = useJobs()

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
      setAiError('Failed to get AI suggestion. Please check your API key.')
    } finally {
      setAiLoading(false)
    }
  }

  // chart data
  const chartData = stats ? [
    { name: 'Applied',      value: stats.applied,      color: STATUS_COLORS.applied },
    { name: 'Interviewing', value: stats.interviewing,  color: STATUS_COLORS.interviewing },
    { name: 'Offered',      value: stats.offered,       color: STATUS_COLORS.offered },
    { name: 'Rejected',     value: stats.rejected,      color: STATUS_COLORS.rejected },
  ] : []

  // แสดงแค่ 5 job ล่าสุดใน dashboard
  const recentJobs = jobs.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">🎯 Job Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hi, {user?.first_name || user?.username} 👋
            </span>
            <Link to="/jobs">
              <Button variant="outline" size="sm">All Jobs</Button>
            </Link>
            <Link to="/jobs/new">
              <Button size="sm">+ Add Job</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Total"        value={stats?.total ?? 0}        icon="📋" color="purple" />
              <StatsCard title="Applied"      value={stats?.applied ?? 0}      icon="📤" color="blue" />
              <StatsCard title="Interviewing" value={stats?.interviewing ?? 0} icon="🎯" color="yellow" />
              <StatsCard
                title="Offered"
                value={stats?.offered ?? 0}
                icon="🎉"
                color="green"
                subtitle={`${stats?.success_rate ?? 0}% success rate`}
              />
            </div>

            {/* Chart */}
            {stats && stats.total > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  Applications by Status
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Jobs */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <Link to="/jobs" className="text-sm text-blue-600 hover:underline">
                View all →
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-gray-600 font-medium">No applications yet</p>
                <p className="text-gray-400 text-sm mt-1 mb-4">Start tracking your job search!</p>
                <Link to="/jobs/new">
                  <Button>+ Add Your First Job</Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {recentJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onDelete={deleteJob}
                    onAISuggest={handleAISuggest}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* AI Modal */}
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
