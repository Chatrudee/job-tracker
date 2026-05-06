// src/components/ui/StatusBadge.tsx
import { cn } from '../../lib/utils'
import type { JobStatus } from '../../types'

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  applied: {
    label: 'Applied',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  interviewing: {
    label: 'Interviewing',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  offered: {
    label: 'Offered 🎉',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  withdrawn: {
    label: 'Withdrawn',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
}

interface StatusBadgeProps {
  status: JobStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
