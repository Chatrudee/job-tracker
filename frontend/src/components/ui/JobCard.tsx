// src/components/ui/JobCard.tsx
import { cn } from '../../lib/utils'
import { StatusBadge } from './StatusBadge'
import { Button } from './Button'
import type { JobApplication } from '../../types'

interface JobCardProps {
  job: JobApplication
  onEdit?: (job: JobApplication) => void
  onDelete?: (id: number) => void
  onAISuggest?: (id: number) => void
  className?: string
}

export function JobCard({ job, onEdit, onDelete, onAISuggest, className }: JobCardProps) {
  return (
    <div className={cn(
      'rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-gray-900">
            {job.position}
          </h3>
          <p className="mt-0.5 truncate text-sm text-gray-600">
            🏢 {job.company}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Meta info */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
        <span>📅 Applied: {new Date(job.applied_date).toLocaleDateString('th-TH')}</span>
        <span>⏱️ {job.days_since_applied} days ago</span>
        {job.salary_range && <span>💰 {job.salary_range}</span>}
      </div>

      {/* Notes */}
      {job.notes && (
        <p className="mt-3 line-clamp-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
          {job.notes}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit?.(job)}
        >
          ✏️ Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-purple-600 hover:bg-purple-50"
          onClick={() => onAISuggest?.(job.id)}
        >
          🤖 AI Suggest
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto text-red-500 hover:bg-red-50"
          onClick={() => onDelete?.(job.id)}
        >
          🗑️
        </Button>
      </div>
    </div>
  )
}
