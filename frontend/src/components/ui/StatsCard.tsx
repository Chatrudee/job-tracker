// src/components/ui/StatsCard.tsx
import { cn } from '../../lib/utils'

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon?: string
  color?: 'blue' | 'yellow' | 'green' | 'red' | 'gray' | 'purple'
  className?: string
}

const colorMap = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  red:    { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
  gray:   { bg: 'bg-gray-50',   text: 'text-gray-700',   border: 'border-gray-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
}

export function StatsCard({
  title, value, subtitle, icon, color = 'blue', className
}: StatsCardProps) {
  const colors = colorMap[color]

  return (
    <div className={cn(
      'rounded-lg border p-5',
      colors.bg, colors.border, className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={cn('mt-1 text-3xl font-bold', colors.text)}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <span className="text-2xl">{icon}</span>
        )}
      </div>
    </div>
  )
}
