'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  collection,
  query,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  where,
  limit,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface School {
  id: string
  name: string
  city: string
  type: string
  teachersCount: number
}

function Sparkle({ size = 16, color = '#ffd93d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill={color} />
    </svg>
  )
}

function TeacherIllustrationJoin() {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="200" height="120" rx="8" fill="#e8f4ff" />
      <rect x="25" y="8" width="130" height="78" rx="6" fill="#2d6a4f" />
      <rect x="29" y="12" width="122" height="70" rx="4" fill="#40916c" />
      <rect x="25" y="84" width="130" height="6" rx="3" fill="#a0522d" />
      <line x1="38" y1="28" x2="90" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="38" y1="40" x2="75" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <text x="100" y="55" fontSize="16" fill="#ffd93d" opacity="0.9">✦</text>
      <text x="40" y="60" fontSize="8" fill="white" opacity="0.4">{'{ }'}</text>
      <ellipse cx="162" cy="78" rx="12" ry="10" fill="#d4a373" />
      <ellipse cx="162" cy="68" rx="9" ry="9" fill="#e9c46a" />
      <ellipse cx="162" cy="65" rx="7" ry="5" fill="#c8956c" />
      <rect x="154" y="78" width="16" height="22" rx="3" fill="#4a90e2" />
      <rect x="152" y="82" width="7" height="14" rx="2" fill="#ffd93d" />
      <rect x="154" y="84" width="20" height="2" rx="1" fill="#3a7bc8" />
      <ellipse cx="142" cy="93" rx="10" ry="7" fill="#52b788" />
      <rect x="139" y="93" width="6" height="10" rx="2" fill="#6b4226" />
      <rect x="0" y="100" width="200" height="20" rx="0" fill="#a8d5a2" />
      <text x="8" y="12" fontSize="10" fill="#ffd93d">✦</text>
      <text x="178" y="30" fontSize="8" fill="#ff9ebc">✦</text>
    </svg>
  )
}

function TeacherIllustrationRegister() {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="200" height="120" rx="8" fill="#f0faf0" />
      <ellipse cx="100" cy="40" rx="22" ry="28" fill="#ffd93d" opacity="0.25" />
      <circle cx="100" cy="28" r="14" fill="#ffd93d" opacity="0.9" />
      <line x1="100" y1="14" x2="100" y2="8" stroke="#ffd93d" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="88" y1="20" x2="84" y2="16" stroke="#ffd93d" strokeWidth="2" strokeLinecap="round" />
      <line x1="112" y1="20" x2="116" y2="16" stroke="#ffd93d" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="60" cy="88" rx="18" ry="22" fill="#d4a373" opacity="0.8" />
      <ellipse cx="60" cy="75" rx="12" ry="12" fill="#e9c46a" />
      <ellipse cx="60" cy="72" rx="9" ry="6" fill="#c8956c" />
      <rect x="51" y="88" width="18" height="26" rx="3" fill="#1e88e5" />
      <rect x="42" y="88" width="9" height="6" rx="2" fill="#ffd93d" />
      <rect x="67" y="88" width="9" height="6" rx="2" fill="#ffd93d" />
      <rect x="115" y="55" width="55" height="45" rx="3" fill="#c8d8f0" />
      <polygon points="110,58 143,35 175,58" fill="#8090b8" />
      <rect x="124" y="70" width="12" height="14" rx="2" fill="#7a9dbf" />
      <rect x="140" y="62" width="10" height="10" rx="1" fill="#7ec8f7" />
      <rect x="155" y="62" width="10" height="10" rx="1" fill="#7ec8f7" />
      <rect x="0" y="100" width="200" height="20" rx="0" fill="#a8d5a2" />
      <ellipse cx="35" cy="100" rx="12" ry="12" fill="#52b788" />
      <ellipse cx="185" cy="98" rx="10" ry="10" fill="#6bcb77" />
      <text x="10" y="14" fontSize="10" fill="#ffd93d">✦</text>
      <text x="180" y="22" fontSize="8" fill="#ff9ebc">✦</text>
    </svg>
  )
}

function SchoolSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.5)' }}>
      <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: 'rgba(200,210,240,0.6)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded-full w-3/4" style={{ background: 'rgba(200,210,240,0.6)' }} />
        <div className="h-2.5 rounded-full w-1/2" style={{ background: 'rgba(200,210,240,0.4)' }} />
      </div>
    </div>
  )
}

function SchoolCard({
  school,
  sentRequests,
  onRequest,
  requesting,
}: {
  school: School
  sentRequests: Set<string>
  onRequest: (school: School) => void
  requesting: string | null
}) {
  const sent = sentRequests.has(school.id)
  const isRequesting = requesting === school.id

  return (
    <div
      className="flex flex-col gap-2 p-3 rounded-xl transition-all"
      style={{
        background: 'rgba(255,255,255,0.65)',
        border: '1.5px solid rgba(200,210,240,0.6)',
        boxShadow: '0 2px 8px rgba(100,80,180,0.08)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #e8f4ff, #c8d8f5)' }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M3 21V9l9-6 9 6v12" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="9" y="14" width="6" height="7" rx="1" stroke="#4a90e2" strokeWidth="2" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm truncate">{school.name}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#9ca3af" />
            </svg>
            <span className="truncate">{school.city}</span>
          </div>
          <p className="text-xs text-indigo-500 font-medium">{school.teachersCount} Teachers Registered</p>
        </div>
      </div>

      <button
        onClick={() => !sent && onRequest(school)}
        disabled={sent || isRequesting}
        className="w-full py-2 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
        style={{
          background: sent
            ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
            : 'linear-gradient(135deg, #4a90e2, #1e88e5)',
          boxShadow: sent ? 'none' : '0 4px 12px rgba(30,136,229,0.35)',
          cursor: sent ? 'not-allowed' : 'pointer',
        }}
      >
        {isRequesting ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Sending…
          </>
        ) : sent ? (
          <>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Request Sent
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Request to Join
          </>
        )}
      </button>
    </div>
  )
}

export default function SchoolConnectionPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')
  const [schools, setSchools] = useState<School[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())
  const [requesting, setRequesting] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Auth guard — use a small delay so React has time to commit the
  // auth state update that fires from onAuthStateChanged during signup.
  useEffect(() => {
    if (authLoading || user) return
    const timer = setTimeout(() => {
      router.replace('/teacher-signup')
    }, 300)
    return () => clearTimeout(timer)
  }, [user, authLoading, router])

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const searchSchools = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSchools([])
      setSearched(false)
      return
    }
    setSearching(true)
    try {
      // Firestore doesn't support full-text search natively.
      // We use a prefix range query on the school name.
      const qLower = q.toLowerCase()
      const schoolsRef = collection(db, 'schools')
      const snap = await getDocs(
        query(schoolsRef, where('status', '!=', 'deleted'), limit(100))
      )

      const results: School[] = snap.docs
        .map((docSnap) => {
          const data = docSnap.data()
          return {
            id: docSnap.id,
            name: data.name as string,
            city: (data.city as string) ?? '',
            type: (data.type as string) ?? '',
            teachersCount: (data.teachersCount as number) ?? 0,
          }
        })
        .filter(
          (s) =>
            s.name?.toLowerCase().includes(qLower) ||
            s.city?.toLowerCase().includes(qLower)
        )
        .slice(0, 10)

      setSchools(results)
      setSearched(true)
    } catch (err) {
      console.error(err)
      showToast('Failed to search schools. Please try again.', 'error')
    } finally {
      setSearching(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchSchools(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, searchSchools])

  async function handleJoinRequest(school: School) {
    if (!user) return
    setRequesting(school.id)
    try {
      // Check for existing pending request
      const existingSnap = await getDocs(
        query(
          collection(db, 'teacherJoinRequests'),
          where('teacherUid', '==', user.uid),
          where('schoolId', '==', school.id),
          where('status', '==', 'PENDING'),
          limit(1)
        )
      )

      if (existingSnap.empty) {
        // Create join request
        await addDoc(collection(db, 'teacherJoinRequests'), {
          teacherUid: user.uid,
          schoolId: school.id,
          schoolName: school.name,
          status: 'PENDING',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }

      // Update teacher profile
      await updateDoc(doc(db, 'users', user.uid), {
        teacherStatus: 'PENDING_APPROVAL',
        schoolId: school.id,
        schoolName: school.name,
        updatedAt: serverTimestamp(),
      })

      setSentRequests((prev) => new Set(prev).add(school.id))
      showToast('Request sent to school admin!', 'success')
      setTimeout(() => {
        router.push('/onboarding/teacher/pending-approval')
      }, 2000)
    } catch (err) {
      console.error(err)
      showToast('Failed to send request. Please try again.', 'error')
    } finally {
      setRequesting(null)
    }
  }

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #b8c8e8 0%, #c8d8f5 20%, #dce4f5 40%, #e8d8f0 65%, #d8c8e8 85%, #c8b8d8 100%)' }}
      >
        <div className="w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #b8c8e8 0%, #c8d8f5 20%, #dce4f5 40%, #e8d8f0 65%, #d8c8e8 85%, #c8b8d8 100%)' }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full" style={{ width: 320, height: 90, top: '4%', left: '-6%', background: 'rgba(255,255,255,0.75)', filter: 'blur(10px)' }} />
        <div className="absolute rounded-full" style={{ width: 250, height: 70, top: '2%', left: '2%', background: 'rgba(255,255,255,0.85)', filter: 'blur(5px)' }} />
        <div className="absolute rounded-full" style={{ width: 280, height: 80, top: '7%', right: '-4%', background: 'rgba(255,255,255,0.75)', filter: 'blur(10px)' }} />
        <div className="absolute rounded-full" style={{ width: 600, height: 140, bottom: '5%', left: '-8%', background: 'rgba(255,255,255,0.55)', filter: 'blur(20px)' }} />
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
        {[
          { top: '25%', left: '1%', color: '#ff9ebc', size: 8 },
          { top: '35%', left: '3%', color: '#a8d8ea', size: 6 },
          { top: '45%', left: '1.5%', color: '#ffd93d', size: 7 },
          { top: '25%', right: '1%', color: '#6bcb77', size: 8 },
          { top: '40%', right: '2%', color: '#ff6b6b', size: 6 },
        ].map((d, i) => (
          <span key={`dot-${i}`} className="absolute rounded-full" style={{ top: d.top, left: (d as { left?: string }).left, right: (d as { right?: string }).right, width: d.size, height: d.size, background: d.color, opacity: 0.6 }} />
        ))}
      </div>

      {/* Robot mascot */}
      <div className="absolute bottom-8 right-4 w-20 h-24 pointer-events-none z-10" aria-hidden="true">
        <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="20" y="28" width="40" height="36" rx="10" fill="#e8f0fe" stroke="#4a90e2" strokeWidth="2" />
          <circle cx="33" cy="44" r="6" fill="#4a90e2" opacity="0.9" />
          <circle cx="47" cy="44" r="6" fill="#4a90e2" opacity="0.9" />
          <circle cx="33" cy="44" r="3" fill="white" />
          <circle cx="47" cy="44" r="3" fill="white" />
          <rect x="34" y="56" width="12" height="3" rx="1.5" fill="#4a90e2" opacity="0.6" />
          <rect x="36" y="20" width="8" height="10" rx="3" fill="#e8f0fe" stroke="#4a90e2" strokeWidth="2" />
          <circle cx="40" cy="17" r="4" fill="#ffd93d" />
          <rect x="12" y="34" width="8" height="16" rx="4" fill="#e8f0fe" stroke="#4a90e2" strokeWidth="2" />
          <rect x="60" y="34" width="8" height="16" rx="4" fill="#e8f0fe" stroke="#4a90e2" strokeWidth="2" />
          <rect x="26" y="64" width="12" height="20" rx="6" fill="#e8f0fe" stroke="#4a90e2" strokeWidth="2" />
          <rect x="42" y="64" width="12" height="20" rx="6" fill="#e8f0fe" stroke="#4a90e2" strokeWidth="2" />
        </svg>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-0.5 text-3xl font-extrabold tracking-tight font-fredoka">
            {['K', 'i', 'n', 'd', 'e', 'r', 'C', 'o', 'd', 'e'].map((ch, i) => (
              <span key={i} style={{ color: ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#e53935', '#fb8c00', '#1e88e5', '#43a047'][i] }}>{ch}</span>
            ))}
            <span className="ml-1"><Sparkle size={14} color="#ffd93d" /></span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Connect to Your School</h1>
        <p className="text-gray-500 text-sm text-center mb-4 max-w-xs">
          You need to be linked with a school account to continue as a teacher.
        </p>

        {/* "or" divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => <span key={i} className="w-1 h-1 rounded-full bg-gray-400 opacity-50" />)}
          </div>
          <span className="text-gray-500 text-sm font-medium italic">or</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => <span key={i} className="w-1 h-1 rounded-full bg-gray-400 opacity-50" />)}
          </div>
        </div>

        {/* Two cards layout */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ─── Join Existing School Card ─── */}
          <div
            className="rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(18px)',
              border: '1.5px solid rgba(255,255,255,0.8)',
              boxShadow: '0 8px 32px rgba(100,80,180,0.18)',
            }}
          >
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-blue-600">Join Existing School</h2>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #43a047, #2e7d32)' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Illustration */}
              <div
                className="w-full rounded-2xl overflow-hidden mb-3"
                style={{ height: 110, background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(200,210,240,0.4)' }}
              >
                <TeacherIllustrationJoin />
              </div>

              {/* Search input */}
              <div className="relative mb-3">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your school..."
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    border: '1.5px solid rgba(180,180,220,0.5)',
                    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.2)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(180,180,220,0.5)'; e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.05)' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSchools([]); setSearched(false) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Results area */}
            <div className="px-5 pb-5 flex-1 space-y-2 min-h-[80px] max-h-64 overflow-y-auto">
              {searching ? (
                <>
                  <SchoolSkeleton />
                  <SchoolSkeleton />
                </>
              ) : schools.length > 0 ? (
                schools.map((school) => (
                  <SchoolCard
                    key={school.id}
                    school={school}
                    sentRequests={sentRequests}
                    onRequest={handleJoinRequest}
                    requesting={requesting}
                  />
                ))
              ) : searched ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <svg className="w-10 h-10 text-gray-300 mb-2" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p className="text-gray-400 text-sm">No schools found.</p>
                  <p className="text-gray-400 text-xs mt-1">Try a different name or register your school.</p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-6">
                  <p className="text-gray-400 text-sm">Type to search for your school</p>
                </div>
              )}
            </div>
          </div>

          {/* ─── Register New School Card ─── */}
          <div
            className="rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: 'rgba(240,250,240,0.7)',
              backdropFilter: 'blur(18px)',
              border: '1.5px solid rgba(200,240,200,0.8)',
              boxShadow: '0 8px 32px rgba(80,160,100,0.15)',
            }}
          >
            <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
              <h2 className="text-base font-bold text-green-700 mb-3 text-center">Register New School</h2>

              {/* Illustration */}
              <div
                className="w-full rounded-2xl overflow-hidden mb-4"
                style={{ height: 110, background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(180,230,180,0.4)' }}
              >
                <TeacherIllustrationRegister />
              </div>

              <div className="text-center mb-5 flex-1">
                <p className="text-gray-700 font-semibold text-sm mb-1">Can&apos;t find your school?</p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Register a new school to continue and become the school admin.
                </p>
              </div>

              <Link
                href="/onboarding/teacher/register-school"
                className="w-full py-3 rounded-2xl text-white font-bold text-sm text-center flex items-center justify-center gap-2 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #52b788, #43a047)',
                  boxShadow: '0 6px 18px rgba(67,160,71,0.35)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 22px rgba(67,160,71,0.45)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(67,160,71,0.35)' }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Register New School
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg z-50"
          style={{
            background: toast.type === 'success'
              ? 'linear-gradient(135deg, #52b788, #43a047)'
              : 'linear-gradient(135deg, #ef5350, #e53935)',
          }}
        >
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  )
}
