'use client'

interface ClassCardProps {
  name: string
  grade: string
  section: string
  studentCount: number
  activeStudents: number
  averageProgress: number
  onViewClass: () => void
}

export default function ClassCard({
  grade,
  section,
  studentCount,
  activeStudents,
  averageProgress,
  onViewClass,
}: ClassCardProps) {
  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-2xl min-w-[200px] flex-1 transition-all"
      style={{
        background: 'rgba(255,255,255,0.82)',
        border: '1.5px solid rgba(200,210,240,0.6)',
        boxShadow: '0 2px 10px rgba(100,80,180,0.07)',
      }}
    >
      <div>
        <h3 className="font-bold text-gray-800 text-base">
          {grade} – Section {section}
        </h3>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <span className="text-2xl font-extrabold text-gray-800">{studentCount}</span>
          <span className="text-xs text-gray-500 ml-1.5">Students</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M5 15l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-bold text-gray-700">{averageProgress}%</span>
        </div>
      </div>

      <p className="text-xs text-gray-400">{activeStudents} Active this week</p>

      <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid rgba(200,210,240,0.4)' }}>
        <span className="text-xs text-gray-400">Average Progress</span>
        <button
          onClick={onViewClass}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(200,210,240,0.6)',
            color: '#374151',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'linear-gradient(135deg, #4a90e2, #1e88e5)'
            el.style.color = 'white'
            el.style.borderColor = 'transparent'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'rgba(255,255,255,0.9)'
            el.style.color = '#374151'
            el.style.borderColor = 'rgba(200,210,240,0.6)'
          }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
          </svg>
          View Class
        </button>
      </div>
    </div>
  )
}

export function ClassCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-2xl min-w-[200px] flex-1 animate-pulse"
      style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(200,210,240,0.5)' }}
    >
      <div className="h-4 w-3/4 rounded-full" style={{ background: 'rgba(200,210,240,0.7)' }} />
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 rounded-lg" style={{ background: 'rgba(200,210,240,0.6)' }} />
        <div className="h-7 w-14 rounded-lg ml-auto" style={{ background: 'rgba(200,210,240,0.6)' }} />
      </div>
      <div className="h-3 w-1/2 rounded-full" style={{ background: 'rgba(200,210,240,0.5)' }} />
      <div className="h-8 w-full rounded-xl" style={{ background: 'rgba(200,210,240,0.4)' }} />
    </div>
  )
}
