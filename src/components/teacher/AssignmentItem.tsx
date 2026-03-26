'use client'

interface AssignmentItemProps {
  title: string
  type: string
  submissions: number
  dueDate: string
  onView: () => void
}

export default function AssignmentItem({ title, type, submissions, dueDate, onView }: AssignmentItemProps) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: '1px solid rgba(200,210,240,0.4)' }}
    >
      {/* Left accent bar */}
      <div
        className="w-1 h-11 rounded-full flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, #4a90e2, #7c3aed)' }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-sm leading-tight">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: '#43a047' }}
          />
          <span className="text-xs font-semibold text-blue-500">{submissions} niles</span>
          <span className="text-xs text-gray-400">{type}</span>
        </div>
      </div>

      {/* Right: date + button */}
      <div className="flex-shrink-0 text-right">
        <p className="text-xs text-gray-400 mb-1.5">{dueDate}</p>
        <button
          onClick={onView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #4a90e2, #1e88e5)',
            boxShadow: '0 3px 8px rgba(30,136,229,0.3)',
          }}
        >
          View
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function AssignmentSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 animate-pulse" style={{ borderBottom: '1px solid rgba(200,210,240,0.4)' }}>
      <div className="w-1 h-11 rounded-full flex-shrink-0" style={{ background: 'rgba(200,210,240,0.6)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/4 rounded-full" style={{ background: 'rgba(200,210,240,0.7)' }} />
        <div className="h-2.5 w-1/2 rounded-full" style={{ background: 'rgba(200,210,240,0.5)' }} />
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="h-2.5 w-16 rounded-full" style={{ background: 'rgba(200,210,240,0.5)' }} />
        <div className="h-7 w-16 rounded-xl" style={{ background: 'rgba(200,210,240,0.6)' }} />
      </div>
    </div>
  )
}
