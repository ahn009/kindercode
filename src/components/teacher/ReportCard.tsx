'use client'

interface ReportItem {
  className: string
  percentage: number
  studentCount: number
}

interface ReportCardProps {
  reports: ReportItem[]
  onView: () => void
}

export default function ReportCard({ reports, onView }: ReportCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {reports.map((r, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{r.className}</p>
            <p className="text-xs text-gray-400 mt-0.5">{r.studentCount} Students</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-bold text-gray-700">{r.percentage}%</span>
            <div
              className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)' }}
            >
              {r.percentage}
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      ))}

      <div
        className="flex items-center justify-between pt-3 mt-1"
        style={{ borderTop: '1px solid rgba(200,210,240,0.4)' }}
      >
        <span className="text-sm font-bold text-gray-700">Total</span>
        <button
          onClick={onView}
          className="px-4 py-1.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1.5px solid rgba(200,210,240,0.6)',
            color: '#374151',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(240,245,255,0.95)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.85)' }}
        >
          View Reports
        </button>
      </div>
    </div>
  )
}
