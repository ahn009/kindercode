'use client'

interface CompetitionCardProps {
  title: string
  participants: number
  startDate: string
  status: 'upcoming' | 'active' | 'completed'
  onView: () => void
  onLeaderboard: () => void
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: 'rgba(67,160,71,0.12)', color: '#2e7d32', label: 'Active' },
  upcoming: { bg: 'rgba(251,191,36,0.14)', color: '#d97706', label: 'Upcoming' },
  completed: { bg: 'rgba(156,163,175,0.2)', color: '#6b7280', label: 'Completed' },
}

export default function CompetitionCard({
  title,
  participants,
  startDate,
  status,
  onView,
  onLeaderboard,
}: CompetitionCardProps) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.upcoming

  return (
    <div className="flex flex-col gap-3">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-800 text-sm leading-tight">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{participants} participants</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-xs text-gray-400">{startDate}</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: style.bg, color: style.color }}
          >
            {style.label}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #4a90e2, #1e88e5)',
            boxShadow: '0 3px 8px rgba(30,136,229,0.3)',
          }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" />
          </svg>
          {participants} Participants
        </button>

        <button
          onClick={onLeaderboard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1.5px solid rgba(200,210,240,0.6)',
            color: '#374151',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(240,245,255,0.95)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.85)' }}
        >
          Go to Leaderboard
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
