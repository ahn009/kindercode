'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

function Sparkle({ size = 16, color = '#ffd93d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill={color} />
    </svg>
  )
}

// Animated hourglass SVG
function HourglassIllustration() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="240" height="160" rx="12" fill="#eef4ff" />
      {/* Clouds */}
      <ellipse cx="48" cy="28" rx="28" ry="12" fill="white" opacity="0.9" />
      <ellipse cx="66" cy="24" rx="22" ry="12" fill="white" opacity="0.9" />
      <ellipse cx="192" cy="24" rx="24" ry="10" fill="white" opacity="0.85" />
      <ellipse cx="210" cy="21" rx="18" ry="10" fill="white" opacity="0.85" />
      {/* Hourglass body */}
      <rect x="90" y="30" width="60" height="8" rx="3" fill="#a78bfa" />
      <rect x="90" y="122" width="60" height="8" rx="3" fill="#a78bfa" />
      {/* Top glass */}
      <path d="M94 38 L120 80 L146 38 Z" fill="#ddd6fe" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Top sand */}
      <path d="M100 38 L120 72 L140 38 Z" fill="#fbbf24" opacity="0.5" />
      {/* Sand drip */}
      <ellipse cx="120" cy="80" rx="3" ry="6" fill="#fbbf24" opacity="0.9" />
      {/* Bottom glass */}
      <path d="M94 122 L120 80 L146 122 Z" fill="#ddd6fe" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Bottom sand pile */}
      <ellipse cx="120" cy="118" rx="20" ry="6" fill="#fbbf24" opacity="0.7" />
      {/* Stars */}
      <text x="18" y="16" fontSize="11" fill="#ffd93d">✦</text>
      <text x="212" y="38" fontSize="9" fill="#ff9ebc">✦</text>
      <text x="30" y="100" fontSize="8" fill="#a78bfa">✦</text>
      <text x="200" y="90" fontSize="10" fill="#6bcb77">✦</text>
      {/* Ground */}
      <rect x="0" y="135" width="240" height="25" fill="#a8d5a2" />
      <rect x="0" y="143" width="240" height="17" fill="#7ec87e" />
    </svg>
  )
}

function RejectedIllustration() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="240" height="160" rx="12" fill="#fff5f5" />
      <ellipse cx="48" cy="28" rx="28" ry="12" fill="white" opacity="0.9" />
      <ellipse cx="66" cy="24" rx="22" ry="12" fill="white" opacity="0.9" />
      {/* Alert circle */}
      <circle cx="120" cy="72" r="38" fill="#fee2e2" />
      <circle cx="120" cy="72" r="30" fill="#fca5a5" opacity="0.5" />
      <path d="M120 54 L120 76" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
      <circle cx="120" cy="86" r="4" fill="#ef4444" />
      <text x="18" y="16" fontSize="11" fill="#ffd93d">✦</text>
      <text x="212" y="38" fontSize="9" fill="#ff9ebc">✦</text>
      <rect x="0" y="135" width="240" height="25" fill="#a8d5a2" />
      <rect x="0" y="143" width="240" height="17" fill="#7ec87e" />
    </svg>
  )
}

function formatDate(ts: Timestamp | null): string {
  if (!ts) return ''
  const d = ts.toDate()
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

const BG = 'linear-gradient(180deg, #b8c8e8 0%, #c8d8f5 20%, #dce4f5 40%, #e8d8f0 65%, #d8c8e8 85%, #c8b8d8 100%)'

export default function PendingApprovalPage() {
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()

  const [teacherStatus, setTeacherStatus] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState('')
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null)
  const [teacherName, setTeacherName] = useState('')
  const [requestedAt, setRequestedAt] = useState<Timestamp | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/teacher-signup')
    }
  }, [user, authLoading, router])

  // Real-time listener on teacher profile
  useEffect(() => {
    if (!user) return
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (!snap.exists()) return
      const data = snap.data()
      setTeacherStatus(data.teacherStatus ?? null)
      setSchoolName(data.schoolName ?? '')
      setSchoolLogo(data.schoolLogo ?? null)
      setTeacherName(data.name ?? user.displayName ?? 'Teacher')
      setRequestedAt(data.updatedAt ?? null)

      if (data.teacherStatus === 'ACTIVE') {
        showToast(`Welcome to ${data.schoolName ?? 'your school'}! Redirecting…`, 'success')
        setTimeout(() => router.push('/home'), 2000)
      }
    })
    return unsub
  }, [user, router])

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleCancelRequest() {
    if (!user) return
    setCancelling(true)
    try {
      // Delete pending join requests
      const reqSnap = await getDocs(
        query(
          collection(db, 'teacherJoinRequests'),
          where('teacherUid', '==', user.uid),
          where('status', '==', 'PENDING'),
          limit(10),
        )
      )
      await Promise.all(reqSnap.docs.map((d) => deleteDoc(d.ref)))

      // Reset teacher status
      await updateDoc(doc(db, 'users', user.uid), {
        teacherStatus: 'PENDING_SCHOOL',
        schoolId: null,
        schoolName: null,
        schoolLogo: null,
        updatedAt: serverTimestamp(),
      })

      router.push('/onboarding/teacher/school-connection')
    } catch {
      showToast('Failed to cancel request. Please try again.', 'error')
    } finally {
      setCancelling(false)
    }
  }

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      router.push('/login')
    } catch {
      showToast('Logout failed. Please try again.', 'error')
      setLoggingOut(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin" />
      </div>
    )
  }

  const isRejected = teacherStatus === 'REJECTED'

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: BG }}>

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

      <main className="flex-1 flex items-center justify-center py-10 px-4 relative z-10">
        <div
          className="w-full max-w-sm rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.62)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.85)',
            boxShadow: '0 8px 40px rgba(100,80,180,0.18)',
          }}
        >
          <div className="px-7 pt-7 pb-7 text-center">

            {/* KinderCode logo */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-0.5 text-2xl font-extrabold tracking-tight font-fredoka">
                {['K', 'i', 'n', 'd', 'e', 'r', 'C', 'o', 'd', 'e'].map((ch, i) => (
                  <span key={i} style={{ color: ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#e53935', '#fb8c00', '#1e88e5', '#43a047'][i] }}>{ch}</span>
                ))}
                <span className="ml-1"><Sparkle size={12} color="#ffd93d" /></span>
              </div>
            </div>

            {/* Illustration */}
            <div
              className="mx-auto mb-4 rounded-2xl overflow-hidden"
              style={{ width: 220, height: 148, background: 'rgba(255,255,255,0.5)', border: '1.5px solid rgba(200,200,230,0.5)', boxShadow: '0 3px 14px rgba(100,80,180,0.1)' }}
            >
              {isRejected ? <RejectedIllustration /> : <HourglassIllustration />}
            </div>

            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{
                background: isRejected ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.14)',
                border: `1.5px solid ${isRejected ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.4)'}`,
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${isRejected ? '' : 'animate-pulse'}`}
                style={{ background: isRejected ? '#ef4444' : '#f59e0b' }}
              />
              <span className="text-xs font-bold" style={{ color: isRejected ? '#dc2626' : '#d97706' }}>
                {isRejected ? 'Request Rejected' : 'Pending Admin Approval'}
              </span>
            </div>

            {isRejected ? (
              /* ─── REJECTED STATE ─── */
              <>
                <h1 className="text-xl font-bold text-gray-800 mb-2">Request Not Approved</h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {teacherName && <span>Hi <strong className="text-gray-700">{teacherName}</strong>, </span>}
                  the school admin at{' '}
                  {schoolName ? <strong className="text-gray-700">{schoolName}</strong> : 'the school'}{' '}
                  did not approve your request. You can try another school or register your own.
                </p>

                <Link
                  href="/onboarding/teacher/school-connection"
                  className="flex w-full items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm mb-2 transition-all"
                  style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)', boxShadow: '0 5px 16px rgba(30,136,229,0.4)' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Try Another School
                </Link>

                <Link
                  href="/onboarding/teacher/register-school"
                  className="flex w-full items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm mb-2 transition-all"
                  style={{ background: 'linear-gradient(135deg, #52b788, #43a047)', boxShadow: '0 5px 16px rgba(67,160,71,0.35)', color: 'white' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Register Your Own School
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(180,180,220,0.5)', color: '#6b7280' }}
                >
                  {loggingOut ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0110 10" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {loggingOut ? 'Logging out…' : 'Logout'}
                </button>
              </>
            ) : (
              /* ─── PENDING STATE ─── */
              <>
                <h1 className="text-xl font-bold text-gray-800 mb-1">Approval Pending</h1>
                <p className="text-gray-400 text-xs font-medium mb-4">from School Admin</p>

                {/* Teacher info */}
                {teacherName && (
                  <p className="text-gray-600 text-sm mb-3">
                    Hi <strong className="text-gray-800">{teacherName}</strong>, your request is under review.
                  </p>
                )}

                {/* School card */}
                {schoolName && (
                  <div
                    className="flex items-center gap-3 p-3 rounded-2xl mb-4 text-left"
                    style={{ background: 'rgba(255,255,255,0.6)', border: '1.5px solid rgba(200,210,240,0.5)' }}
                  >
                    {schoolLogo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={schoolLogo} alt={schoolName} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #e8f4ff, #c8d8f5)' }}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path d="M3 21V9l9-6 9 6v12" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <rect x="9" y="14" width="6" height="7" rx="1" stroke="#4a90e2" strokeWidth="2" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{schoolName}</p>
                      {requestedAt && (
                        <p className="text-xs text-gray-400">Requested on {formatDate(requestedAt)}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Pulsing waiting indicator */}
                <div
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl mb-4"
                  style={{ background: 'rgba(251,191,36,0.1)', border: '1px dashed rgba(251,191,36,0.5)' }}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          background: '#f59e0b',
                          animationDelay: `${i * 150}ms`,
                          animationDuration: '800ms',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-amber-600">Waiting for approval…</span>
                </div>

                {/* What happens next */}
                <div
                  className="rounded-2xl p-3.5 mb-4 text-left"
                  style={{ background: 'rgba(255,255,255,0.5)', border: '1.5px solid rgba(200,210,240,0.5)' }}
                >
                  <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5">What happens next?</h3>
                  {[
                    { icon: '📧', text: 'School admin reviews your request' },
                    { icon: '✅', text: 'Approval grants full teacher access' },
                    { icon: '🚀', text: 'Create courses & manage students' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2.5 mb-1.5 last:mb-0">
                      <span className="text-base leading-none">{step.icon}</span>
                      <span className="text-xs text-gray-600">{step.text}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCancelRequest}
                    disabled={cancelling}
                    className="flex w-full items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm transition-all"
                    style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(180,180,220,0.5)', color: '#6b7280' }}
                  >
                    {cancelling ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                          <path d="M12 2a10 10 0 0110 10" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Cancelling…
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Cancel Request & Try Another School
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm transition-all"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.2)', color: '#dc2626' }}
                  >
                    {loggingOut ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(220,38,38,0.2)" strokeWidth="3" />
                          <path d="M12 2a10 10 0 0110 10" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Logging out…
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Logout
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-3 text-xs text-gray-400 text-center">
                  This page updates automatically when the admin responds.
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg z-50"
          style={{
            background: toast.type === 'success'
              ? 'linear-gradient(135deg, #52b788, #43a047)'
              : 'linear-gradient(135deg, #ef5350, #e53935)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  )
}
