'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'

// ─── Mock Data ─────────────────────────────────────────────────
const MOCK_CHILDREN = [
  {
    id: '1',
    name: 'Daniel Johnson',
    grade: 'Grade 5',
    subject: 'Coding Basics',
    teacher: 'Ms. Sarah',
    school: 'Green Valley School',
    avatar: '🧒',
  },
  {
    id: '2',
    name: 'Emma Johnson',
    grade: 'Grade 3',
    subject: 'Scratch Basics',
    teacher: 'Mr. Adams',
    school: 'Green Valley School',
    avatar: '👧',
  },
]

const WEEK_ACTIVITY = [
  { day: 'Mon', pct: 80 },
  { day: 'Tue', pct: 60 },
  { day: 'Wed', pct: 90 },
  { day: 'Thu', pct: 45 },
  { day: 'Fri', pct: 75 },
  { day: 'Sat', pct: 30 },
  { day: 'Sun', pct: 20 },
]

// ─── Sidebar ───────────────────────────────────────────────────
function Sidebar({ child, parentName, onLogout }: { child: typeof MOCK_CHILDREN[0]; parentName: string; onLogout: () => void }) {
  const [active, setActive] = useState('dashboard')
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'My Dashboard' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'progress', icon: '📈', label: "Child's Progress" },
    { id: 'settings', icon: '⚙️', label: 'Account Settings' },
  ]
  return (
    <aside
      className="hidden lg:flex flex-col w-64 min-h-screen shrink-0"
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(16px)',
        borderRight: '1.5px solid rgba(200,210,240,0.5)',
        boxShadow: '2px 0 20px rgba(100,120,200,0.08)',
      }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-indigo-100">
        <div className="inline-flex items-center gap-0.5 text-xl font-extrabold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {['K','i','n','d','e','r','C','o','d','e'].map((ch, i) => (
            <span key={i} style={{ color: ['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa','#e53935','#fb8c00','#1e88e5','#43a047'][i] }}>{ch}</span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              background: active === item.id ? 'linear-gradient(135deg, #eef2ff, #e0e8ff)' : 'transparent',
              color: active === item.id ? '#4f46e5' : '#64748b',
              borderLeft: active === item.id ? '3px solid #6366f1' : '3px solid transparent',
            }}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Child info card */}
      <div className="mx-3 mb-3 p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, #eef2ff, #e0e8ff)', border: '1.5px solid rgba(180,190,240,0.5)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{child.avatar}</span>
          <div>
            <p className="text-xs font-bold text-indigo-900">{child.name}</p>
            <p className="text-xs text-indigo-500">Linked to {child.grade}</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}

// ─── Circular Progress ─────────────────────────────────────────
function CircularProgress({ pct, size = 100, stroke = 8, color = '#6366f1' }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize={size / 4.5} fontWeight="bold" fill="#1e293b">
        {pct}%
      </text>
    </svg>
  )
}

// ─── Bar Chart ─────────────────────────────────────────────────
function WeeklyBar({ data }: { data: typeof WEEK_ACTIVITY }) {
  const max = Math.max(...data.map(d => d.pct))
  return (
    <div className="flex items-end gap-1.5 h-20 w-full">
      {data.map(d => (
        <div key={d.day} className="flex flex-col items-center flex-1 gap-1">
          <div
            className="w-full rounded-t-lg transition-all"
            style={{
              height: `${(d.pct / max) * 64}px`,
              background: d.pct === max
                ? 'linear-gradient(180deg, #6366f1, #8b5cf6)'
                : 'linear-gradient(180deg, #a5b4fc, #c4b5fd)',
            }}
          />
          <span className="text-xs text-gray-500 font-medium">{d.day}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1" style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(200,210,240,0.4)', boxShadow: '0 2px 12px rgba(100,120,200,0.07)' }}>
      <span className="text-2xl">{icon}</span>
      <span className="text-2xl font-extrabold" style={{ color }}>{value}</span>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  )
}

// ─── Dashboard Page ────────────────────────────────────────────
export default function ParentDashboardPage() {
  const router = useRouter()
  const [selectedChildId, setSelectedChildId] = useState(MOCK_CHILDREN[0].id)
  const child = MOCK_CHILDREN.find(c => c.id === selectedChildId) ?? MOCK_CHILDREN[0]
  const parentName = typeof window !== 'undefined' ? sessionStorage.getItem('parentName') || 'Mrs. Johnson' : 'Mrs. Johnson'

  function handleLogout() {
    sessionStorage.clear()
    router.push('/select-role' as Parameters<typeof router.push>[0])
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(160deg, #eef2ff 0%, #f0f4ff 40%, #f5f0ff 100%)' }}
    >
      <Sidebar child={child} parentName={parentName} onLogout={handleLogout} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid rgba(200,210,240,0.4)', boxShadow: '0 2px 12px rgba(100,120,200,0.06)' }}
        >
          <h1 className="text-xl font-extrabold text-indigo-900" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Welcome, {parentName}!
          </h1>
          <div className="flex items-center gap-3">
            <select
              value={selectedChildId}
              onChange={e => setSelectedChildId(e.target.value)}
              className="text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {MOCK_CHILDREN.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-lg cursor-pointer">👩</div>
          </div>
        </header>

        <div className="px-4 sm:px-6 py-5 space-y-6 max-w-5xl mx-auto">

          {/* Viewing badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-700"
            style={{ background: 'rgba(238,242,255,0.9)', border: '1.5px solid rgba(180,190,240,0.5)' }}
          >
            <span>Viewing: <strong>{child.name}</strong></span>
            <span className="text-gray-400">|</span>
            <span>{child.grade} – {child.subject}</span>
          </div>

          {/* Progress Overview */}
          <section>
            <h2 className="text-lg font-extrabold text-gray-800 mb-3">📊 Progress Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Completion + streak + time */}
              <div className="sm:col-span-2 lg:col-span-1 rounded-2xl p-5 flex flex-col gap-4"
                style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(200,210,240,0.4)', boxShadow: '0 2px 16px rgba(100,120,200,0.08)' }}>
                <div className="flex items-center gap-4">
                  <CircularProgress pct={65} size={90} stroke={8} color="#6366f1" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 text-lg">🔥</span>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Learning Streak</p>
                        <p className="font-bold text-gray-800 text-sm">10 Days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 text-lg">⏱️</span>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Time This Week</p>
                        <p className="font-bold text-gray-800 text-sm">3h 25m</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium text-center">Overall Completion</p>
              </div>

              {/* Weekly bar chart */}
              <div className="lg:col-span-2 rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(200,210,240,0.4)', boxShadow: '0 2px 16px rgba(100,120,200,0.08)' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-700">School Progress</p>
                  <span className="text-lg font-extrabold text-indigo-600">83%</span>
                </div>
                <WeeklyBar data={WEEK_ACTIVITY} />
              </div>
            </div>
          </section>

          {/* Academic Status */}
          <section>
            <h2 className="text-lg font-extrabold text-gray-800 mb-3">🎓 Academic Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon="📖" label="Lessons Completed" value={12} color="#6366f1" />
              <StatCard icon="📝" label="Assignments Submitted" value={5} color="#22c55e" />
              <StatCard icon="🏆" label="Competition Rank" value="#3" color="#f59e0b" />
              <StatCard icon="⭐" label="Average Score" value="88%" color="#3b82f6" />
            </div>

            {/* Engagement rate */}
            <div className="mt-3 rounded-2xl p-4 flex items-center gap-4"
              style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(200,210,240,0.4)', boxShadow: '0 2px 12px rgba(100,120,200,0.07)' }}>
              <div>
                <p className="text-sm font-bold text-gray-700 mb-1">Weekly Activity</p>
                <p className="text-xs text-gray-500">4 days active this week</p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div>
                  <p className="text-xs text-gray-500 text-right">Engagement Rate</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500" style={{ width: '78%' }} />
                    </div>
                    <span className="text-sm font-bold text-indigo-600">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Development */}
          <section>
            <h2 className="text-lg font-extrabold text-gray-800 mb-3">💡 Skills Development</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(240,255,244,0.9)', border: '1.5px solid rgba(134,239,172,0.5)', boxShadow: '0 2px 12px rgba(34,197,94,0.08)' }}>
                <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                  <span>💪</span> Strengths
                </h3>
                <div className="space-y-2">
                  {['Logic', 'Problem Solving'].map(skill => (
                    <div key={skill} className="flex items-center gap-2">
                      <span className="text-green-500">✅</span>
                      <span className="text-sm font-semibold text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs Improvement */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,251,235,0.9)', border: '1.5px solid rgba(251,191,36,0.5)', boxShadow: '0 2px 12px rgba(245,158,11,0.08)' }}>
                <h3 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                  <span>📈</span> Needs Improvement
                </h3>
                <div className="space-y-2">
                  {['Loops', 'Debugging'].map(skill => (
                    <div key={skill} className="flex items-center gap-2">
                      <span className="text-amber-500">⚠️</span>
                      <span className="text-sm font-semibold text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Teacher Notes */}
          <section>
            <h2 className="text-lg font-extrabold text-gray-800 mb-3">👩‍🏫 Teacher Notes</h2>
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(200,210,240,0.4)', boxShadow: '0 2px 16px rgba(100,120,200,0.08)' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg shrink-0">👩‍🏫</div>
                <div className="flex-1">
                  <p className="font-bold text-indigo-900">{child.teacher}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {child.name} is doing great, but he could use some practice with loops.
                    His next assignment will be focused on this area.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <span>📅</span>
                      <span>Next Assignment: Fri, Apr 26</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <span>🏫</span>
                      <span>{child.school}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Download Reports */}
          <section>
            <h2 className="text-lg font-extrabold text-gray-800 mb-3">📥 Download Report</h2>
            <div className="rounded-2xl p-5 space-y-3"
              style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(200,210,240,0.4)', boxShadow: '0 2px 16px rgba(100,120,200,0.08)' }}>
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 18px rgba(99,102,241,0.35)' }}
              >
                <span>📊</span> Download Report
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 18px rgba(34,197,94,0.35)' }}
              >
                <span>📄</span> Download Progress Report (PDF)
              </button>
              <p className="text-xs text-center text-gray-400 font-medium flex items-center justify-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Your data is secure and private
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
