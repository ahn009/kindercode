'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

function Sparkle({ size = 16, color = '#ffd93d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill={color} />
    </svg>
  )
}

interface QuickActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}

function QuickActionCard({ icon, title, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl text-left w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: 'rgba(255,255,255,0.75)',
        border: '1.5px solid rgba(200,210,240,0.6)',
        boxShadow: '0 2px 10px rgba(100,80,180,0.08)',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(100,80,180,0.16)'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.9)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(100,80,180,0.08)'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.75)'
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
        style={{ background: 'linear-gradient(135deg, #e8f0fe, #dce4f8)' }}
      >
        {icon}
      </div>
      <div>
        <p className="font-bold text-gray-800 text-sm">{title}</p>
        <p className="text-gray-500 text-xs mt-0.5">{description}</p>
      </div>
    </button>
  )
}

const BG =
  'linear-gradient(180deg, #b8c8e8 0%, #c8d8f5 20%, #dce4f5 40%, #e8d8f0 65%, #d8c8e8 85%, #c8b8d8 100%)'

export default function TeacherWelcomePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [teacherName, setTeacherName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch teacher + school data
  useEffect(() => {
    if (!user) return

    async function fetchData() {
      try {
        const userSnap = await getDoc(doc(db, 'users', user!.uid))
        if (!userSnap.exists()) {
          setError('Teacher profile not found.')
          setDataLoading(false)
          return
        }
        const data = userSnap.data()

        // Auth checks
        if (data.role !== 'teacher') {
          router.replace('/select-role')
          return
        }
        setTeacherName(data.name ?? user!.displayName ?? 'Teacher')
        setSchoolName(data.schoolName ?? '')
        setSchoolLogo(data.schoolLogo ?? null)
        setDataLoading(false)
      } catch {
        setError('Failed to load your profile. Please try again.')
        setDataLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: BG }}>
        <div
          className="w-full max-w-sm rounded-3xl p-8 text-center"
          style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.85)',
            boxShadow: '0 8px 40px rgba(100,80,180,0.18)',
          }}
        >
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: BG }}>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full" style={{ width: 380, height: 100, top: '2%', left: '-5%', background: 'rgba(255,255,255,0.78)', filter: 'blur(12px)' }} />
        <div className="absolute rounded-full" style={{ width: 280, height: 80, top: '1%', left: '5%', background: 'rgba(255,255,255,0.88)', filter: 'blur(6px)' }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 85, top: '6%', right: '-3%', background: 'rgba(255,255,255,0.78)', filter: 'blur(12px)' }} />
        <div className="absolute rounded-full" style={{ width: 650, height: 150, bottom: '4%', left: '-8%', background: 'rgba(255,255,255,0.5)', filter: 'blur(22px)' }} />
        {[
          { top: '3%', left: '8%', size: 18, color: '#ffd93d' },
          { top: '6%', left: '28%', size: 14, color: '#ffd93d' },
          { top: '4%', left: '52%', size: 16, color: '#ffd93d' },
          { top: '8%', right: '22%', size: 12, color: '#ffd93d' },
          { top: '5%', right: '8%', size: 16, color: '#ffd93d' },
        ].map((s, i) => (
          <span key={i} className="absolute" style={{ top: s.top, left: (s as { left?: string }).left, right: (s as { right?: string }).right }}>
            <Sparkle size={s.size} color={s.color} />
          </span>
        ))}
      </div>

      {/* Top bar with name */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(255,255,255,0.3)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        {/* KinderCode Logo */}
        <div className="inline-flex items-center gap-0.5 text-xl font-extrabold tracking-tight font-fredoka">
          {['K', 'i', 'n', 'd', 'e', 'r', 'C', 'o', 'd', 'e'].map((ch, i) => (
            <span key={i} style={{ color: ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#e53935', '#fb8c00', '#1e88e5', '#43a047'][i] }}>{ch}</span>
          ))}
          <span className="ml-1"><Sparkle size={10} color="#ffd93d" /></span>
        </div>

        {/* Teacher name + avatar */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.75)',
              border: '1.5px solid rgba(200,210,240,0.6)',
              boxShadow: '0 2px 8px rgba(100,80,180,0.1)',
            }}
          >
            <span className="text-gray-700 font-semibold text-sm">{teacherName || 'Teacher'}</span>
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4a90e2, #7c3aed)' }}
          >
            {teacherName ? teacherName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'T'}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-10 px-4 relative z-10">

        {/* Welcome heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
            Welcome, {teacherName}!
          </h1>
          <p className="text-gray-600 text-base">
            You are now connected to <strong className="text-gray-800">{schoolName}</strong>.
          </p>
          <p className="text-gray-600 text-base">Let&apos;s start teaching kids to code!</p>
        </div>

        {/* Main card */}
        <div
          className="w-full max-w-4xl rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.62)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.85)',
            boxShadow: '0 8px 40px rgba(100,80,180,0.18)',
          }}
        >
          {/* School header inside card */}
          <div
            className="flex flex-col items-center py-6 px-6"
            style={{
              background: 'linear-gradient(135deg, rgba(200,215,245,0.5), rgba(220,228,245,0.5))',
              borderBottom: '1px solid rgba(200,210,240,0.4)',
            }}
          >
            {/* School icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, #52b788, #2d6a4f)', boxShadow: '0 4px 14px rgba(45,106,79,0.35)' }}
            >
              {schoolLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={schoolLogo} alt={schoolName} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21V9l9-6 9 6v12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="9" y="14" width="6" height="7" rx="1" stroke="white" strokeWidth="2" />
                </svg>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{schoolName}</h2>
          </div>

          {/* Quick action cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <QuickActionCard
                icon="+"
                title="Create Class"
                description="Set up a new classroom."
                onClick={() => router.push('/teacher/dashboard')}
              />
              <QuickActionCard
                icon="🎓"
                title="View Students"
                description="See all your students."
                onClick={() => router.push('/teacher/dashboard')}
              />
              <QuickActionCard
                icon="💡"
                title="Start Teaching"
                description="Begin a coding lesson."
                onClick={() => router.push('/teacher/dashboard')}
              />
            </div>

            {/* Preview area: Store + coding interface mockup */}
            <div
              className="rounded-2xl overflow-hidden mb-6 relative"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1.5px solid rgba(200,210,240,0.5)',
                minHeight: 160,
              }}
            >
              <div className="flex h-40">
                {/* Store sidebar */}
                <div
                  className="w-36 flex-shrink-0 p-3"
                  style={{
                    background: 'rgba(240,245,255,0.8)',
                    borderRight: '1px solid rgba(200,210,240,0.5)',
                  }}
                >
                  <div className="flex items-center gap-1 mb-3">
                    <div className="w-3 h-3 rounded-sm" style={{ background: '#4a90e2' }} />
                    <span className="text-xs font-bold text-gray-700">Store</span>
                    <svg className="w-3 h-3 text-gray-400 ml-auto" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  {['Chalice', 'Recoils', 'Wrench Up', 'Lecots', 'Schancee 40°'].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 py-1">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: i === 0 ? '#4a90e2' : 'rgba(200,210,240,0.6)' }} />
                      <span className="text-xs text-gray-600 truncate">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Coding blocks area */}
                <div className="flex-1 p-3 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-600">Leous</span>
                    <div className="w-4 h-4 rounded-full" style={{ background: '#43a047', opacity: 0.7 }} />
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { color: '#43a047', label: 'Green flag sting', indent: 0 },
                      { color: '#4a90e2', label: 'Tage Setting', indent: 1 },
                      { color: '#fb8c00', label: 'moon_slug  thetew', indent: 1 },
                      { color: '#7c3aed', label: '10  thetew', indent: 1 },
                  ].map((block, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 rounded-md px-2 py-0.5"
                        style={{
                          background: block.color,
                          marginLeft: block.indent * 12,
                          width: 'fit-content',
                          maxWidth: '80%',
                        }}
                      >
                        {block.indent > 0 && (
                          <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 8 8" fill="none">
                            <path d="M2 1l4 3-4 3" fill="white" opacity="0.8" />
                          </svg>
                        )}
                        <span className="text-white text-xs font-medium whitespace-nowrap">{block.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Laptop illustration on the right */}
                <div className="hidden sm:flex items-center justify-center w-40 flex-shrink-0 pr-4">
                  <svg viewBox="0 0 120 90" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Laptop screen */}
                    <rect x="15" y="8" width="90" height="58" rx="4" fill="#c8d8f0" stroke="#8090b8" strokeWidth="1.5" />
                    <rect x="19" y="12" width="82" height="50" rx="2" fill="#e8f0ff" />
                    {/* Screen content */}
                    <rect x="24" y="18" width="30" height="4" rx="2" fill="#4a90e2" opacity="0.7" />
                    <rect x="24" y="26" width="20" height="3" rx="1.5" fill="#fb8c00" opacity="0.7" />
                    <rect x="24" y="33" width="25" height="3" rx="1.5" fill="#43a047" opacity="0.7" />
                    {/* Character */}
                    <ellipse cx="80" cy="42" rx="10" ry="10" fill="#ffd93d" opacity="0.9" />
                    <circle cx="77" cy="40" r="2" fill="#555" />
                    <circle cx="83" cy="40" r="2" fill="#555" />
                    <path d="M76 46 Q80 49 84 46" stroke="#555" strokeWidth="1" fill="none" strokeLinecap="round" />
                    {/* Laptop base */}
                    <rect x="10" y="66" width="100" height="6" rx="2" fill="#b0c0d8" />
                    <rect x="40" y="72" width="40" height="3" rx="1.5" fill="#9aafcc" />
                    {/* Items on desk */}
                    <ellipse cx="20" cy="66" rx="8" ry="6" fill="#52b788" />
                    <rect x="108" y="56" width="5" height="10" rx="2" fill="#8B4513" />
                    <ellipse cx="110.5" cy="56" rx="5" ry="4" fill="#52b788" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Go to Dashboard CTA */}
            <button
              onClick={() => router.push('/teacher/dashboard')}
              className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg, #4a90e2, #1e88e5)',
                boxShadow: '0 6px 20px rgba(30,136,229,0.4)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 26px rgba(30,136,229,0.55)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(30,136,229,0.4)'
              }}
            >
              Go to Dashboard
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Confirmation note */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: '#43a047' }}
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">You are now connected to <strong className="text-gray-700">{schoolName}</strong>.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
