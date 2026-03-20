'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'

function Sparkle({ size = 16, color = '#ffd93d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill={color} />
    </svg>
  )
}

function CheckBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function VerificationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const fullName  = searchParams.get('fullName')  ?? ''
  const email     = searchParams.get('email')     ?? ''
  const schoolId  = searchParams.get('schoolId')  ?? ''
  const role      = searchParams.get('role')      ?? 'Principal'
  const schoolName = searchParams.get('schoolName') ?? ''

  /* ── Shared styles ── */
  const cardStyle = {
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(18px)',
    border: '1.5px solid rgba(255,255,255,0.75)',
    boxShadow: '0 8px 40px rgba(100,80,180,0.18)',
  }

  const sectionStyle = {
    background: 'rgba(255,255,255,0.5)',
    border: '1.5px solid rgba(200,210,240,0.6)',
  }

  /* ── Steps data ── */
  const steps = [
    {
      icon: '🪪',
      title: 'Unique School ID generated',
      extra: schoolId ? (
        <div
          className="mt-1.5 px-4 py-1.5 rounded-xl inline-block font-bold text-sm"
          style={{ background: 'linear-gradient(135deg,#e8f4ff,#d0e8ff)', border: '1.5px solid #4a90e2', color: '#1a5fa8', letterSpacing: '0.04em' }}
        >
          #{schoolId}
        </div>
      ) : null,
      pending: false,
    },
    { icon: '🗄️', title: 'School Database created',                   pending: false },
    { icon: '🔗', title: 'Admin account linked to School ID',          pending: false },
    {
      icon: '⏳',
      title: 'School status set to:',
      badge: 'Pending Verification',
      pending: true,
    },
  ]

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#b8c8e8 0%,#c8d8f5 20%,#dce4f5 40%,#e8d8f0 65%,#d8c8e8 85%,#c8b8d8 100%)' }}
    >
      {/* ── Background decorations ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full" style={{ width:320, height:90,  top:'4%',    left:'-6%',  background:'rgba(255,255,255,0.75)', filter:'blur(10px)' }} />
        <div className="absolute rounded-full" style={{ width:250, height:70,  top:'2%',    left:'2%',   background:'rgba(255,255,255,0.85)', filter:'blur(5px)'  }} />
        <div className="absolute rounded-full" style={{ width:280, height:80,  top:'7%',    right:'-4%', background:'rgba(255,255,255,0.75)', filter:'blur(10px)' }} />
        <div className="absolute rounded-full" style={{ width:600, height:140, bottom:'5%', left:'-8%',  background:'rgba(255,255,255,0.55)', filter:'blur(20px)' }} />
        {[
          { top:'3%', left:'8%',   size:18, color:'#ffd93d' },
          { top:'6%', left:'28%',  size:14, color:'#ffd93d' },
          { top:'4%', left:'52%',  size:16, color:'#ffd93d' },
          { top:'8%', right:'22%', size:12, color:'#ffd93d' },
          { top:'5%', right:'8%',  size:16, color:'#ffd93d' },
        ].map((s, i) => (
          <span
            key={i}
            className="absolute"
            style={{ top: s.top, left: (s as { left?: string }).left, right: (s as { right?: string }).right }}
          >
            <Sparkle size={s.size} color={s.color} />
          </span>
        ))}
        {[
          { top:'25%', left:'1%',   color:'#ff9ebc', size:8 },
          { top:'35%', left:'3%',   color:'#a8d8ea', size:6 },
          { top:'45%', left:'1.5%', color:'#ffd93d', size:7 },
          { top:'25%', right:'1%',  color:'#6bcb77', size:8 },
          { top:'40%', right:'2%',  color:'#ff6b6b', size:6 },
        ].map((d, i) => (
          <span
            key={`dot-${i}`}
            className="absolute rounded-full"
            style={{
              top: d.top,
              left: (d as { left?: string }).left,
              right: (d as { right?: string }).right,
              width: d.size, height: d.size,
              background: d.color, opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* ── Card ── */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 relative z-10">
        <div className="w-full max-w-lg rounded-3xl overflow-hidden" style={cardStyle}>
          <div className="px-8 pt-7 pb-8">

            {/* Logo */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-0.5 text-3xl font-extrabold tracking-tight font-fredoka">
                {['K','i','n','d','e','r','C','o','d','e'].map((ch, i) => (
                  <span key={i} style={{ color: ['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa','#e53935','#fb8c00','#1e88e5','#43a047'][i] }}>{ch}</span>
                ))}
                <span className="ml-1"><Sparkle size={14} color="#ffd93d" /></span>
              </div>
            </div>

            {/* Success banner */}
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-6"
              style={{ background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', border: '1.5px solid #34d399' }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#43a047,#27ae60)', boxShadow: '0 3px 10px rgba(67,160,71,0.4)' }}
              >
                <CheckBadge />
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">School Admin Account Created Successfully</p>
                {schoolName && <p className="text-xs text-green-700 mt-0.5">{schoolName}</p>}
              </div>
            </div>

            {/* What Happens After Submission */}
            <div className="rounded-2xl p-4 mb-4" style={sectionStyle}>
              <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                What Happens After Submission?
              </h2>
              <p className="text-xs text-gray-500 mb-4">System Actions (Backend Flow)</p>

              <div className="space-y-3">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {/* Circle icon */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={
                        s.pending
                          ? { background: 'linear-gradient(135deg,#f39c12,#e67e22)', boxShadow: '0 2px 8px rgba(243,156,18,0.35)' }
                          : { background: 'linear-gradient(135deg,#43a047,#27ae60)', boxShadow: '0 2px 8px rgba(67,160,71,0.35)' }
                      }
                    >
                      {s.pending ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                          <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <CheckBadge />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700 flex flex-wrap items-center gap-1.5">
                        <span>{s.icon}</span>
                        {s.title}
                        {s.badge && (
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: 'rgba(243,156,18,0.15)', border: '1px solid #f39c12', color: '#92400e' }}
                          >
                            {s.badge}
                          </span>
                        )}
                      </p>
                      {s.extra}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Details */}
            <div className="rounded-2xl p-4 mb-5" style={sectionStyle}>
              <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Admin (School Owner) Details
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{fullName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Role</p>
                  <p className="text-sm font-semibold text-gray-800 capitalize">{role}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{email || '—'}</p>
                </div>
              </div>
            </div>

            {/* Email notice */}
            <div
              className="rounded-2xl p-3 mb-5 flex items-start gap-2.5"
              style={{ background: 'rgba(255,248,220,0.85)', border: '1.5px solid #f39c12' }}
            >
              <span className="text-base mt-0.5">📧</span>
              <p className="text-xs text-gray-700 leading-relaxed">
                A verification link has been sent to{' '}
                <span className="font-semibold">{email}</span>.
                Please check your inbox to activate your school account.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push(`/school-admin-dashboard?schoolId=${encodeURIComponent(schoolId)}`)}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all"
                style={{ background: 'linear-gradient(135deg,#4a90e2 0%,#1e88e5 50%,#1565c0 100%)', boxShadow: '0 6px 20px rgba(30,136,229,0.4)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,136,229,0.5)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,136,229,0.4)' }}
              >
                Continue to Dashboard →
              </button>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 rounded-2xl font-semibold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(180,180,220,0.6)', color: '#4b5563' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)' }}
              >
                Return to Login
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default function SchoolAdminVerificationPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg,#b8c8e8 0%,#c8d8f5 50%,#d8c8e8 100%)' }}
        >
          <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  )
}
