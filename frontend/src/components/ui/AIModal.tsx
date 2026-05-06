// src/components/ui/AIModal.tsx
import { cn } from '../../lib/utils'
import { Button } from './Button'
import type { AISuggestion } from '../../types'

interface AIModalProps {
  isOpen: boolean
  onClose: () => void
  suggestion?: AISuggestion | null
  loading?: boolean
  error?: string | null
  jobTitle?: string
}

export function AIModal({
  isOpen, onClose, suggestion, loading, error, jobTitle
}: AIModalProps) {
  if (!isOpen) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              🤖 AI Follow-up Suggestion
            </h2>
            {jobTitle && (
              <p className="text-sm text-gray-500 mt-0.5">{jobTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-sm text-gray-500">Claude กำลังสร้าง email...</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700">❌ {error}</p>
            </div>
          )}

          {suggestion && !loading && !error && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subject Line</label>
                  <button onClick={() => copyToClipboard(suggestion.subject)} className="text-xs text-blue-600 hover:underline">Copy</button>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                  <p className="text-sm font-medium text-gray-900">{suggestion.subject}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Body</label>
                  <button onClick={() => copyToClipboard(suggestion.body)} className="text-xs text-blue-600 hover:underline">Copy</button>
                </div>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 max-h-60 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{suggestion.body}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t p-4">
          {suggestion && (
            <Button variant="primary" size="sm" onClick={() => copyToClipboard(suggestion.full)}>
              📋 Copy All
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
