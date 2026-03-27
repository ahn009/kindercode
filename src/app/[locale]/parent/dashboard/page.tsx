'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import { db } from '@/lib/firebase'
import { doc, onSnapshot, collection, query, where, setDoc, serverTimestamp } from 'firebase/firestore'

// ─── Types ─────────────────────────────────────────────────────
interface WeekDay {
  day: string
  pct: number
  minutes: number
}

interface ChildProgress {
  id: string
  name: string
  grade: string
  subject: string
  teacher: string
  school: string
  avatar: string
  completionPct: number
  streak: number
  weeklyMinutes: number
  schoolProgress: number
  lessonsCompleted: number
  assignmentsSubmitted: number
  competitionRank: string
  averageScore: string
  engagementRate: number
  activeDaysThisWeek: number
  weekActivity: WeekDay[]
  strengths: string[]
  improvements: string[]
  teacherNote: string
  nextAssignment: string
  lastUpdated: Date | null
  totalPoints: number
  level: number
  badges: string[]
}

// ─── Demo seed data (used as fallback / Firestore initial write) ─
const DEMO_CHILDREN: ChildProgress[] = [
  {
    id: 'child_daniel',
    name: 'Daniel Johnson',
    grade: 'Grade 5',
    subject: 'Coding Basics',
    teacher: 'Ms. Sarah',
    school: 'Green Valley School',
    avatar: '🧒',
    completionPct: 72,
    streak: 14,
    weeklyMinutes: 205,
    schoolProgress: 83,
    lessonsCompleted: 18,
    assignmentsSubmitted: 7,
    competitionRank: '#3',
    averageScore: '88%',
    engagementRate: 78,
    activeDaysThisWeek: 5,
    weekActivity: [
      { day: 'Mon', pct: 80, minutes: 45 },
      { day: 'Tue', pct: 60, minutes: 32 },
      { day: 'Wed', pct: 90, minutes: 55 },
      { day: 'Thu', pct: 45, minutes: 20 },
      { day: 'Fri', pct: 75, minutes: 40 },
      { day: 'Sat', pct: 30, minutes: 13 },
      { day: 'Sun', pct: 20, minutes: 0 },
    ],
    strengths: ['Logic', 'Problem Solving', 'Sequences'],
    improvements: ['Loops', 'Debugging'],
    teacherNote:
      'Daniel is showing great progress with logic concepts. His problem-solving skills are excellent. He should practice loops more — next assignment focuses on this.',
    nextAssignment: 'Fri, Apr 26',
    lastUpdated: null,
    totalPoints: 1340,
    level: 5,
    badges: ['🏅', '⭐', '🔥'],
  },
  {
    id: 'child_emma',
    name: 'Emma Johnson',
    grade: 'Grade 3',
    subject: 'Scratch Basics',
    teacher: 'Mr. Adams',
    school: 'Green Valley School',
    avatar: '👧',
    completionPct: 55,
    streak: 7,
    weeklyMinutes: 130,
    schoolProgress: 67,
    lessonsCompleted: 10,
    assignmentsSubmitted: 4,
    competitionRank: '#7',
    averageScore: '79%',
    engagementRate: 62,
    activeDaysThisWeek: 3,
    weekActivity: [
      { day: 'Mon', pct: 50, minutes: 25 },
      { day: 'Tue', pct: 70, minutes: 35 },
      { day: 'Wed', pct: 40, minutes: 20 },
      { day: 'Thu', pct: 80, minutes: 40 },
      { day: 'Fri', pct: 30, minutes: 10 },
      { day: 'Sat', pct: 0, minutes: 0 },
      { day: 'Sun', pct: 60, minutes: 0 },
    ],
    strengths: ['Creativity', 'Animation'],
    improvements: ['Conditionals', 'Variables', 'Events'],
    teacherNote:
      'Emma shows excellent creativity in her Scratch projects. She needs to work on understanding variables and conditional logic for the upcoming unit.',
    nextAssignment: 'Wed, Apr 24',
    lastUpdated: null,
    totalPoints: 820,
    level: 3,
    badges: ['⭐', '🎨'],
  },
]

// ─── SVG Girl Avatar ────────────────────────────────────────────
function GirlAvatar({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: '50%' }}
    >
      {/* Background */}
      <circle cx="50" cy="50" r="50" fill="#e0e7ff" />
      {/* Body / dress */}
      <ellipse cx="50" cy="88" rx="26" ry="20" fill="#6366f1" />
      <ellipse cx="50" cy="82" rx="22" ry="15" fill="#818cf8" />
      {/* Collar */}
      <ellipse cx="50" cy="68" rx="10" ry="5" fill="#a5b4fc" />
      {/* Neck */}
      <rect x="45" y="60" width="10" height="10" rx="4" fill="#fcd9a0" />
      {/* Head */}
      <circle cx="50" cy="46" r="22" fill="#fcd9a0" />
      {/* Hair back */}
      <ellipse cx="50" cy="30" rx="23" ry="10" fill="#3b1f0a" />
      {/* Hair sides */}
      <ellipse cx="30" cy="44" rx="7" ry="14" fill="#3b1f0a" />
      <ellipse cx="70" cy="44" rx="7" ry="14" fill="#3b1f0a" />
      {/* Hair top detail */}
      <ellipse cx="50" cy="26" rx="18" ry="8" fill="#4a2910" />
      {/* Hair bow */}
      <ellipse cx="65" cy="28" rx="7" ry="4" fill="#f43f5e" transform="rotate(-20 65 28)" />
      <ellipse cx="75" cy="24" rx="7" ry="4" fill="#f43f5e" transform="rotate(20 75 24)" />
      <circle cx="70" cy="26" r="3" fill="#fb7185" />
      {/* Eyes white */}
      <ellipse cx="43" cy="46" rx="4.5" ry="5" fill="white" />
      <ellipse cx="57" cy="46" rx="4.5" ry="5" fill="white" />
      {/* Pupils */}
      <circle cx="43" cy="47" r="3" fill="#1e1b4b" />
      <circle cx="57" cy="47" r="3" fill="#1e1b4b" />
      {/* Eye shine */}
      <circle cx="44" cy="45.5" r="1.2" fill="white" />
      <circle cx="58" cy="45.5" r="1.2" fill="white" />
      {/* Eyebrows */}
      <path d="M39 41 Q43 39 47 41" stroke="#3b1f0a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M53 41 Q57 39 61 41" stroke="#3b1f0a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <ellipse cx="36" cy="52" rx="5" ry="3" fill="#fca5a5" opacity="0.5" />
      <ellipse cx="64" cy="52" rx="5" ry="3" fill="#fca5a5" opacity="0.5" />
      {/* Smile */}
      <path d="M43 54 Q50 60 57 54" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ─── Circular Progress ─────────────────────────────────────────
function CircularProgress({
  pct,
  size = 100,
  stroke = 9,
  color = '#6366f1',
  animate = false,
}: {
  pct: number
  size?: number
  stroke?: number
  color?: string
  animate?: boolean
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={animate ? { transition: 'stroke-dasharray 1s ease-in-out' } : undefined}
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size / 4.5}
        fontWeight="bold"
        fill="#1e293b"
      >
        {pct}%
      </text>
    </svg>
  )
}

// ─── Weekly Bar ────────────────────────────────────────────────
function WeeklyBar({ data }: { data: WeekDay[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const max = Math.max(...data.map((d) => d.pct), 1)
  return (
    <div className="flex items-end gap-1.5 h-24 w-full relative">
      {data.map((d) => (
        <div
          key={d.day}
          className="flex flex-col items-center flex-1 gap-1 relative"
          onMouseEnter={() => setHovered(d.day)}
          onMouseLeave={() => setHovered(null)}
        >
          {hovered === d.day && d.minutes > 0 && (
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-white rounded-lg px-2 py-1 whitespace-nowrap z-10"
              style={{ background: 'rgba(99,102,241,0.95)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}
            >
              {d.minutes}m
            </div>
          )}
          <div
            className="w-full rounded-t-lg transition-all duration-500 cursor-pointer"
            style={{
              height: `${(d.pct / max) * 72}px`,
              background:
                d.pct === max
                  ? 'linear-gradient(180deg, #6366f1, #8b5cf6)'
                  : hovered === d.day
                  ? 'linear-gradient(180deg, #818cf8, #a78bfa)'
                  : 'linear-gradient(180deg, #a5b4fc, #c4b5fd)',
              transform: hovered === d.day ? 'scaleY(1.05)' : 'scaleY(1)',
              transformOrigin: 'bottom',
            }}
          />
          <span className="text-xs text-gray-500 font-medium">{d.day}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Stat Card ─────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
  subtext,
}: {
  icon: string
  label: string
  value: string | number
  color: string
  subtext?: string
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-1 transition-all hover:scale-105 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.9)',
        border: '1.5px solid rgba(200,210,240,0.4)',
        boxShadow: '0 2px 12px rgba(100,120,200,0.07)',
      }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-2xl font-extrabold" style={{ color }}>
        {value}
      </span>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      {subtext && <span className="text-xs font-semibold" style={{ color }}>{subtext}</span>}
    </div>
  )
}

// ─── Profile Dropdown ───────────────────────────────────────────
function ProfileDropdown({
  parentName,
  onLogout,
}: {
  parentName: string
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuItems = [
    { icon: '👤', label: 'My Profile', action: () => {} },
    { icon: '⚙️', label: 'Account Settings', action: () => {} },
    { icon: '🔔', label: 'Notifications', action: () => {} },
    { icon: '❓', label: 'Help & Support', action: () => {} },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-2xl transition-all hover:bg-indigo-50 focus:outline-none"
        style={{ border: '1.5px solid rgba(200,210,240,0.5)' }}
      >
        <GirlAvatar size={36} />
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-indigo-900 leading-tight">{parentName}</p>
          <p className="text-xs text-indigo-400 leading-tight">Parent</p>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden z-50"
          style={{
            background: 'rgba(255,255,255,0.97)',
            boxShadow: '0 8px 32px rgba(100,120,200,0.18)',
            border: '1.5px solid rgba(200,210,240,0.5)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ borderBottom: '1.5px solid rgba(200,210,240,0.35)', background: 'rgba(238,242,255,0.6)' }}
          >
            <GirlAvatar size={40} />
            <div>
              <p className="text-sm font-bold text-indigo-900">{parentName}</p>
              <p className="text-xs text-indigo-400">Parent Account</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { item.action(); setOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div style={{ borderTop: '1.5px solid rgba(200,210,240,0.35)' }} className="py-2">
            <button
              onClick={() => { onLogout(); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Notifications Panel ────────────────────────────────────────
function NotificationsPanel({ child }: { child: ChildProgress }) {
  const notifications = [
    {
      id: 1,
      icon: '📖',
      text: `${child.name} completed a new lesson today`,
      time: '2h ago',
      color: '#6366f1',
    },
    {
      id: 2,
      icon: '🏆',
      text: `${child.name} moved to ${child.competitionRank} in competitions`,
      time: '5h ago',
      color: '#f59e0b',
    },
    {
      id: 3,
      icon: '📝',
      text: `New assignment due: ${child.nextAssignment}`,
      time: '1d ago',
      color: '#22c55e',
    },
    {
      id: 4,
      icon: '🔥',
      text: `${child.streak}-day learning streak maintained!`,
      time: '2d ago',
      color: '#f97316',
    },
  ]
  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="flex items-start gap-3 p-3 rounded-xl"
          style={{ background: 'rgba(238,242,255,0.6)', border: '1.5px solid rgba(200,210,240,0.3)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
            style={{ background: `${n.color}18` }}
          >
            {n.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">{n.text}</p>
            <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Live Badge ─────────────────────────────────────────────────
function LiveBadge({ lastUpdated }: { lastUpdated: Date | null }) {
  const [timeAgo, setTimeAgo] = useState('just now')

  useEffect(() => {
    function update() {
      if (!lastUpdated) { setTimeAgo('just now'); return }
      const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
      if (diff < 10) setTimeAgo('just now')
      else if (diff < 60) setTimeAgo(`${diff}s ago`)
      else if (diff < 3600) setTimeAgo(`${Math.floor(diff / 60)}m ago`)
      else setTimeAgo(`${Math.floor(diff / 3600)}h ago`)
    }
    update()
    const id = setInterval(update, 5000)
    return () => clearInterval(id)
  }, [lastUpdated])

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700"
      style={{ background: 'rgba(209,250,229,0.8)', border: '1.5px solid rgba(167,243,208,0.6)' }}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      Live · {timeAgo}
    </div>
  )
}

// ─── Sidebar ───────────────────────────────────────────────────
function Sidebar({
  child,
  parentName,
  onLogout,
  activeSection,
  setActiveSection,
}: {
  child: ChildProgress
  parentName: string
  onLogout: () => void
  activeSection: string
  setActiveSection: (s: string) => void
}) {
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'My Dashboard' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'progress', icon: '📈', label: "Child's Progress" },
    { id: 'reports', icon: '📥', label: 'Reports' },
    { id: 'settings', icon: '⚙️', label: 'Account Settings' },
  ]

  return (
    <aside
      className="hidden lg:flex flex-col w-64 min-h-screen shrink-0"
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px)',
        borderRight: '1.5px solid rgba(200,210,240,0.5)',
        boxShadow: '2px 0 24px rgba(100,120,200,0.09)',
      }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-indigo-100">
        <div
          className="inline-flex items-center gap-0.5 text-xl font-extrabold"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          {['K', 'i', 'n', 'd', 'e', 'r', 'C', 'o', 'd', 'e'].map((ch, i) => (
            <span
              key={i}
              style={{
                color: [
                  '#e53935', '#fb8c00', '#fdd835', '#43a047',
                  '#1e88e5', '#8e24aa', '#e53935', '#fb8c00', '#1e88e5', '#43a047',
                ][i],
              }}
            >
              {ch}
            </span>
          ))}
        </div>
        <p className="text-xs text-indigo-400 font-medium mt-0.5">Parent Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              background:
                activeSection === item.id
                  ? 'linear-gradient(135deg, #eef2ff, #e0e8ff)'
                  : 'transparent',
              color: activeSection === item.id ? '#4f46e5' : '#64748b',
              borderLeft:
                activeSection === item.id
                  ? '3px solid #6366f1'
                  : '3px solid transparent',
            }}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Child info card */}
      <div
        className="mx-3 mb-3 p-3 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #eef2ff, #e0e8ff)',
          border: '1.5px solid rgba(180,190,240,0.5)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{child.avatar}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-indigo-900 truncate">{child.name}</p>
            <p className="text-xs text-indigo-500">{child.grade}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-indigo-700">Lv.{child.level}</p>
            <p className="text-xs text-indigo-400">{child.totalPoints} pts</p>
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-indigo-100 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${child.completionPct}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            }}
          />
        </div>
        <p className="text-xs text-indigo-400 mt-1 text-right">{child.completionPct}% complete</p>
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

// ─── Progress Section ─────────────────────────────────────────
function ProgressSection({ child }: { child: ChildProgress }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Completion + streak + time */}
        <div
          className="sm:col-span-2 lg:col-span-1 rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(200,210,240,0.4)',
            boxShadow: '0 2px 16px rgba(100,120,200,0.08)',
          }}
        >
          <div className="flex items-center gap-4">
            <CircularProgress pct={child.completionPct} size={90} stroke={9} color="#6366f1" animate />
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-orange-400 text-lg">🔥</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Learning Streak</p>
                  <p className="font-bold text-gray-800 text-sm">{child.streak} Days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-lg">⏱️</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Time This Week</p>
                  <p className="font-bold text-gray-800 text-sm">
                    {Math.floor(child.weeklyMinutes / 60)}h {child.weeklyMinutes % 60}m
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400 text-lg">🏅</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Badges Earned</p>
                  <p className="font-bold text-gray-800 text-sm">{child.badges.join(' ')}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-medium text-center">Overall Completion</p>
        </div>

        {/* Weekly bar chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(200,210,240,0.4)',
            boxShadow: '0 2px 16px rgba(100,120,200,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-700">Weekly Activity</p>
              <p className="text-xs text-gray-400">{child.activeDaysThisWeek} days active this week · hover for minutes</p>
            </div>
            <span className="text-lg font-extrabold text-indigo-600">{child.schoolProgress}%</span>
          </div>
          <WeeklyBar data={child.weekActivity} />
        </div>
      </div>

      {/* Academic Status */}
      <section>
        <h3 className="text-base font-extrabold text-gray-800 mb-3">🎓 Academic Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon="📖" label="Lessons Completed" value={child.lessonsCompleted} color="#6366f1" />
          <StatCard icon="📝" label="Assignments Submitted" value={child.assignmentsSubmitted} color="#22c55e" />
          <StatCard icon="🏆" label="Competition Rank" value={child.competitionRank} color="#f59e0b" />
          <StatCard icon="⭐" label="Average Score" value={child.averageScore} color="#3b82f6" />
        </div>

        {/* Engagement */}
        <div
          className="mt-3 rounded-2xl p-4 flex items-center gap-4"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(200,210,240,0.4)',
            boxShadow: '0 2px 12px rgba(100,120,200,0.07)',
          }}
        >
          <div>
            <p className="text-sm font-bold text-gray-700">Engagement Rate</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {child.activeDaysThisWeek} active days this week
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-28 h-2.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${child.engagementRate}%`,
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  transition: 'width 1s ease-in-out',
                }}
              />
            </div>
            <span className="text-sm font-extrabold text-indigo-600">{child.engagementRate}%</span>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section>
        <h3 className="text-base font-extrabold text-gray-800 mb-3">💡 Skills Development</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(240,255,244,0.9)',
              border: '1.5px solid rgba(134,239,172,0.5)',
              boxShadow: '0 2px 12px rgba(34,197,94,0.08)',
            }}
          >
            <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
              <span>💪</span> Strengths
            </h4>
            <div className="space-y-2">
              {child.strengths.map((skill) => (
                <div key={skill} className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm font-semibold text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(255,251,235,0.9)',
              border: '1.5px solid rgba(251,191,36,0.5)',
              boxShadow: '0 2px 12px rgba(245,158,11,0.08)',
            }}
          >
            <h4 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
              <span>📈</span> Needs Improvement
            </h4>
            <div className="space-y-2">
              {child.improvements.map((skill) => (
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
        <h3 className="text-base font-extrabold text-gray-800 mb-3">👩‍🏫 Teacher Notes</h3>
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(200,210,240,0.4)',
            boxShadow: '0 2px 16px rgba(100,120,200,0.08)',
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg shrink-0">
              👩‍🏫
            </div>
            <div className="flex-1">
              <p className="font-bold text-indigo-900">{child.teacher}</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{child.teacherNote}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <span>📅</span>
                  <span>Next Assignment: {child.nextAssignment}</span>
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
    </div>
  )
}

// ─── Reports Section ────────────────────────────────────────────
function ReportsSection({ child }: { child: ChildProgress }) {
  function generateReport() {
    const content = `
KinderCode Parent Report
========================
Child: ${child.name}
Grade: ${child.grade}
School: ${child.school}
Teacher: ${child.teacher}
Generated: ${new Date().toLocaleDateString()}

PROGRESS OVERVIEW
-----------------
Overall Completion: ${child.completionPct}%
Learning Streak: ${child.streak} days
Weekly Time: ${Math.floor(child.weeklyMinutes / 60)}h ${child.weeklyMinutes % 60}m
School Progress: ${child.schoolProgress}%

ACADEMIC STATUS
---------------
Lessons Completed: ${child.lessonsCompleted}
Assignments Submitted: ${child.assignmentsSubmitted}
Competition Rank: ${child.competitionRank}
Average Score: ${child.averageScore}
Engagement Rate: ${child.engagementRate}%

SKILLS
------
Strengths: ${child.strengths.join(', ')}
Needs Improvement: ${child.improvements.join(', ')}

TEACHER NOTES
-------------
${child.teacherNote}
Next Assignment Due: ${child.nextAssignment}

Total Points: ${child.totalPoints}
Level: ${child.level}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${child.name.replace(' ', '_')}_KinderCode_Report.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: 'rgba(255,255,255,0.9)',
          border: '1.5px solid rgba(200,210,240,0.4)',
          boxShadow: '0 2px 16px rgba(100,120,200,0.08)',
        }}
      >
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Progress Report</h3>
          <p className="text-xs text-gray-500">Full breakdown of {child.name}&apos;s learning progress</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            ['Completion', `${child.completionPct}%`],
            ['Streak', `${child.streak} days`],
            ['Avg Score', child.averageScore],
            ['Rank', child.competitionRank],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center py-2 px-3 rounded-xl"
              style={{ background: 'rgba(238,242,255,0.6)' }}>
              <span className="text-gray-500 font-medium">{label}</span>
              <span className="font-bold text-indigo-700">{val}</span>
            </div>
          ))}
        </div>
        <button
          onClick={generateReport}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 4px 18px rgba(99,102,241,0.35)',
          }}
        >
          <span>📊</span> Download Progress Report
        </button>
        <button
          onClick={generateReport}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            boxShadow: '0 4px 18px rgba(34,197,94,0.35)',
          }}
        >
          <span>📄</span> Download Full Report (TXT)
        </button>
        <p className="text-xs text-center text-gray-400 font-medium flex items-center justify-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Your data is secure and private
        </p>
      </div>
    </div>
  )
}

// ─── Settings Section ───────────────────────────────────────────
function SettingsSection({ parentName }: { parentName: string }) {
  const [name, setName] = useState(parentName)
  const [email, setEmail] = useState('parent@example.com')
  const [notifications, setNotifications] = useState({
    weeklyReport: true,
    dailyActivity: true,
    teacherNotes: true,
    achievements: false,
  })
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-lg">
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: 'rgba(255,255,255,0.9)',
          border: '1.5px solid rgba(200,210,240,0.4)',
          boxShadow: '0 2px 16px rgba(100,120,200,0.08)',
        }}
      >
        <h3 className="font-bold text-gray-800">Profile Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              style={{ border: '1.5px solid rgba(200,210,240,0.6)', background: 'rgba(238,242,255,0.4)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              style={{ border: '1.5px solid rgba(200,210,240,0.6)', background: 'rgba(238,242,255,0.4)' }}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-5 space-y-3"
        style={{
          background: 'rgba(255,255,255,0.9)',
          border: '1.5px solid rgba(200,210,240,0.4)',
          boxShadow: '0 2px 16px rgba(100,120,200,0.08)',
        }}
      >
        <h3 className="font-bold text-gray-800">Notification Preferences</h3>
        {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-semibold text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </span>
            <div
              className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
              style={{ background: val ? '#6366f1' : '#d1d5db' }}
              onClick={() => setNotifications((n) => ({ ...n, [key]: !val }))}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                style={{ transform: val ? 'translateX(20px)' : 'translateX(2px)' }}
              />
            </div>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 active:scale-95"
        style={{
          background: saved
            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: saved ? '0 4px 18px rgba(34,197,94,0.3)' : '0 4px 18px rgba(99,102,241,0.3)',
        }}
      >
        {saved ? '✅ Saved!' : 'Save Changes'}
      </button>
    </form>
  )
}

// ─── Dashboard Page ─────────────────────────────────────────────
export default function ParentDashboardPage() {
  const router = useRouter()
  const [selectedChildId, setSelectedChildId] = useState(DEMO_CHILDREN[0].id)
  const [childrenData, setChildrenData] = useState<ChildProgress[]>(DEMO_CHILDREN)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const unsubscribesRef = useRef<(() => void)[]>([])

  const parentName =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('parentName') || 'Mrs. Johnson'
      : 'Mrs. Johnson'

  const child = childrenData.find((c) => c.id === selectedChildId) ?? childrenData[0]

  // ── Real-time Firestore listeners ────────────────────────────
  const setupListeners = useCallback(() => {
    // Clean up previous listeners
    unsubscribesRef.current.forEach((unsub) => unsub())
    unsubscribesRef.current = []

    DEMO_CHILDREN.forEach((demoChild) => {
      try {
        const docRef = doc(db, 'childProgress', demoChild.id)

        // Seed initial data if needed
        setDoc(
          docRef,
          {
            ...demoChild,
            lastUpdated: serverTimestamp(),
          },
          { merge: true }
        ).catch(() => {}) // silent — may fail without auth

        const unsub = onSnapshot(
          docRef,
          (snap) => {
            if (snap.exists()) {
              const data = snap.data()
              setChildrenData((prev) =>
                prev.map((c) =>
                  c.id === demoChild.id
                    ? {
                        ...c,
                        completionPct: data.completionPct ?? c.completionPct,
                        streak: data.streak ?? c.streak,
                        weeklyMinutes: data.weeklyMinutes ?? c.weeklyMinutes,
                        schoolProgress: data.schoolProgress ?? c.schoolProgress,
                        lessonsCompleted: data.lessonsCompleted ?? c.lessonsCompleted,
                        assignmentsSubmitted: data.assignmentsSubmitted ?? c.assignmentsSubmitted,
                        competitionRank: data.competitionRank ?? c.competitionRank,
                        averageScore: data.averageScore ?? c.averageScore,
                        engagementRate: data.engagementRate ?? c.engagementRate,
                        activeDaysThisWeek: data.activeDaysThisWeek ?? c.activeDaysThisWeek,
                        weekActivity: data.weekActivity ?? c.weekActivity,
                        strengths: data.strengths ?? c.strengths,
                        improvements: data.improvements ?? c.improvements,
                        teacherNote: data.teacherNote ?? c.teacherNote,
                        nextAssignment: data.nextAssignment ?? c.nextAssignment,
                        totalPoints: data.totalPoints ?? c.totalPoints,
                        level: data.level ?? c.level,
                        badges: data.badges ?? c.badges,
                        lastUpdated: data.lastUpdated?.toDate() ?? new Date(),
                      }
                    : c
                )
              )
              setLastUpdated(new Date())
            }
          },
          () => {
            // Firestore unavailable — fall back to demo data silently
            setLastUpdated(new Date())
          }
        )

        unsubscribesRef.current.push(unsub)
      } catch {
        // Firebase not configured — demo data remains
        setLastUpdated(new Date())
      }
    })
  }, [])

  useEffect(() => {
    setupListeners()
    return () => {
      unsubscribesRef.current.forEach((unsub) => unsub())
    }
  }, [setupListeners])

  function handleLogout() {
    sessionStorage.clear()
    router.push('/select-role' as Parameters<typeof router.push>[0])
  }

  const sectionTitle: Record<string, string> = {
    dashboard: `Welcome back, ${parentName}!`,
    notifications: 'Notifications',
    progress: `${child.name}'s Progress`,
    reports: 'Download Reports',
    settings: 'Account Settings',
  }

  const mobileSections = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'notifications', icon: '🔔', label: 'Alerts' },
    { id: 'progress', icon: '📈', label: 'Progress' },
    { id: 'reports', icon: '📥', label: 'Reports' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ]

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(160deg, #eef2ff 0%, #f0f4ff 40%, #f5f0ff 100%)' }}
    >
      <Sidebar
        child={child}
        parentName={parentName}
        onLogout={handleLogout}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main content */}
      <main className="flex-1 overflow-auto flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(14px)',
            borderBottom: '1.5px solid rgba(200,210,240,0.4)',
            boxShadow: '0 2px 12px rgba(100,120,200,0.06)',
          }}
        >
          {/* Left: mobile menu + title */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-50"
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <h1
                className="text-base sm:text-lg font-extrabold text-indigo-900 leading-tight"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                {sectionTitle[activeSection]}
              </h1>
              <div className="hidden sm:block">
                <LiveBadge lastUpdated={lastUpdated} />
              </div>
            </div>
          </div>

          {/* Right: child selector + profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {childrenData.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ProfileDropdown parentName={parentName} onLogout={handleLogout} />
          </div>
        </header>

        {/* Mobile nav overlay */}
        {mobileNavOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 flex"
            onClick={() => setMobileNavOpen(false)}
          >
            <div className="absolute inset-0 bg-black/30" />
            <aside
              className="relative flex flex-col w-64 h-full z-40"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(255,255,255,0.97)',
                boxShadow: '4px 0 24px rgba(100,120,200,0.15)',
              }}
            >
              <div className="px-6 py-5 border-b border-indigo-100 flex items-center justify-between">
                <div className="inline-flex items-center gap-0.5 text-xl font-extrabold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {['K','i','n','d','e','r','C','o','d','e'].map((ch, i) => (
                    <span key={i} style={{ color: ['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa','#e53935','#fb8c00','#1e88e5','#43a047'][i] }}>{ch}</span>
                  ))}
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1">
                {mobileSections.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setMobileNavOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: activeSection === item.id ? 'linear-gradient(135deg, #eef2ff, #e0e8ff)' : 'transparent',
                      color: activeSection === item.id ? '#4f46e5' : '#64748b',
                    }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="px-3 pb-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Page content */}
        <div className="px-4 sm:px-6 py-5 flex-1 max-w-5xl mx-auto w-full">

          {/* Viewing badge — always shown */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-700 mb-5"
            style={{ background: 'rgba(238,242,255,0.9)', border: '1.5px solid rgba(180,190,240,0.5)' }}
          >
            <span>{child.avatar}</span>
            <span>Viewing: <strong>{child.name}</strong></span>
            <span className="text-gray-400">|</span>
            <span>{child.grade} – {child.subject}</span>
          </div>

          {/* Sections */}
          {(activeSection === 'dashboard' || activeSection === 'progress') && (
            <div className="space-y-5">
              <h2 className="text-lg font-extrabold text-gray-800">📊 Progress Overview</h2>
              <ProgressSection child={child} />
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-lg font-extrabold text-gray-800 mb-1">🔔 Recent Activity</h2>
              <p className="text-sm text-gray-500 mb-4">Updates about {child.name}&apos;s learning journey</p>
              <NotificationsPanel child={child} />
            </div>
          )}

          {activeSection === 'reports' && (
            <div className="space-y-5">
              <h2 className="text-lg font-extrabold text-gray-800 mb-1">📥 Download Reports</h2>
              <p className="text-sm text-gray-500 mb-4">Export {child.name}&apos;s progress reports</p>
              <ReportsSection child={child} />
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-5">
              <h2 className="text-lg font-extrabold text-gray-800 mb-1">⚙️ Account Settings</h2>
              <p className="text-sm text-gray-500 mb-4">Manage your parent account preferences</p>
              <SettingsSection parentName={parentName} />
            </div>
          )}

        </div>

        {/* Mobile bottom nav */}
        <nav
          className="lg:hidden sticky bottom-0 z-20 flex items-center justify-around px-2 py-2"
          style={{
            background: 'rgba(255,255,255,0.95)',
            borderTop: '1.5px solid rgba(200,210,240,0.5)',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 -2px 12px rgba(100,120,200,0.08)',
          }}
        >
          {mobileSections.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
              style={{ color: activeSection === item.id ? '#6366f1' : '#94a3b8' }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  )
}
