// src/pages/JobFormPage.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { jobsAPI } from '../api/jobs'
import type { JobStatus } from '../types'

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'applied',      label: '📤 Applied' },
  { value: 'interviewing', label: '🎯 Interviewing' },
  { value: 'offered',      label: '🎉 Offered' },
  { value: 'rejected',     label: '❌ Rejected' },
  { value: 'withdrawn',    label: '↩️ Withdrawn' },
]

export default function JobFormPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState({
    company:      '',
    position:     '',
    status:       'applied' as JobStatus,
    applied_date: new Date().toISOString().split('T')[0],
    salary_range: '',
    job_url:      '',
    notes:        '',
  })

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await jobsAPI.create(form)
      navigate('/jobs')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to="/dashboard" className="text-xl font-bold text-gray-900">🎯 Job Tracker</Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Link to="/jobs" className="text-sm text-blue-600 hover:underline">← Back to jobs</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Job Application</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company + Position */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input required value={form.company} onChange={set('company')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Google, Atlassian..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <input required value={form.position} onChange={set('position')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Frontend Developer..." />
              </div>
            </div>

            {/* Status + Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select value={form.status} onChange={set('status')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date *</label>
                <input type="date" required value={form.applied_date} onChange={set('applied_date')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Salary + URL */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <input value={form.salary_range} onChange={set('salary_range')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AUD $80k - $100k" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
                <input type="url" value={form.job_url} onChange={set('job_url')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..." />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={form.notes} onChange={set('notes')} rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Interview notes, contacts, requirements..." />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={loading} className="flex-1">
                Save Application
              </Button>
              <Link to="/jobs">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
