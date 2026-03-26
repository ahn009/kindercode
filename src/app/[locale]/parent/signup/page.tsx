'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'

function KinderCodeLogo() {
  return (
    <div className="inline-flex items-center gap-0.5 text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
      {['K','i','n','d','e','r','C','o','d','e'].map((ch, i) => (
        <span key={i} style={{ color: ['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa','#e53935','#fb8c00','#1e88e5','#43a047'][i] }}>{ch}</span>
      ))}
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

// Mock account creation
async function createParentAccount(data: { parentName: string; email: string; password: string; childName: string }) {
  await new Promise(r => setTimeout(r, 800))
  // In production, call your API/Firebase here
  return { success: true, parentId: `PAR-${Date.now()}` }
}

function ParentSignupContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const childName = searchParams.get('childName') || 'Daniel Johnson'
  const grade = searchParams.get('grade') || 'Grade 5 – Coding Basics'
  const teacher = searchParams.get('teacher') || 'Ms. Sarah'
  const school = searchParams.get('school') || 'Green Valley School'

  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const errs: Record<string, string> = {}
    if (!parentName.trim()) errs.parentName = 'Full name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    const result = await createParentAccount({ parentName, email, password, childName })
    setLoading(false)
    if (result.success) {
      sessionStorage.setItem('parentName', parentName)
      sessionStorage.setItem('childName', childName)
      router.push('/parent/dashboard' as Parameters<typeof router.push>[0])
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-6 pb-10 px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #d6e8ff 0%, #e8f0ff 30%, #f0e8ff 65%, #e0d8f8 100%)',
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full" style={{ width: 300, height: 90, top: '4%', left: '-6%', background: 'rgba(255,255,255,0.65)', filter: 'blur(12px)' }} />
        <div className="absolute rounded-full" style={{ width: 240, height: 70, top: '3%', left: '1%', background: 'rgba(255,255,255,0.78)', filter: 'blur(6px)' }} />
        <div className="absolute rounded-full" style={{ width: 340, height: 100, top: '9%', right: '-7%', background: 'rgba(255,255,255,0.65)', filter: 'blur(12px)' }} />
        <div className="absolute rounded-full" style={{ width: 280, height: 80, top: '8%', right: '-2%', background: 'rgba(255,255,255,0.78)', filter: 'blur(6px)' }} />
        {/* Decorative floating items */}
        <div className="absolute" style={{ top: '15%', right: '3%', fontSize: 40, opacity: 0.15 }}>📊</div>
        <div className="absolute" style={{ top: '40%', right: '1%', fontSize: 36, opacity: 0.12 }}>⭐</div>
        <div className="absolute" style={{ bottom: '20%', right: '2%', fontSize: 44, opacity: 0.15 }}>🏆</div>
        <div className="absolute" style={{ bottom: '10%', right: '4%', fontSize: 38, opacity: 0.12 }}>💡</div>
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-5 mt-2">
        <KinderCodeLogo />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-lg rounded-3xl p-7 sm:p-9"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255,255,255,0.8)',
          boxShadow: '0 10px 48px rgba(100,120,220,0.14)',
        }}
      >
        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            👨‍👩‍👧 Create Your <span className="text-blue-600">Parent Account</span>
          </h1>
        </div>

        {/* Child info banner */}
        <div
          className="rounded-2xl px-4 py-3 mb-6 text-center"
          style={{
            background: 'rgba(235,242,255,0.85)',
            border: '1.5px solid rgba(180,200,240,0.5)',
          }}
        >
          <p className="text-sm text-gray-500 font-medium mb-1">You are connecting to:</p>
          <p className="font-bold text-indigo-900 text-base">🧒 {childName}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1 text-xs text-gray-600 font-medium">
            <span>📚 {grade}</span>
            <span className="hidden sm:inline">|</span>
            <span>👩‍🏫 Teacher: {teacher}</span>
            <span className="hidden sm:inline">|</span>
            <span>🏫 {school}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Parent Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parent Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                value={parentName}
                onChange={e => { setParentName(e.target.value); setErrors(p => ({ ...p, parentName: '' })) }}
                placeholder="Enter Your Full Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                style={{ border: errors.parentName ? '1.5px solid #f87171' : '1.5px solid rgba(200,210,240,0.7)' }}
              />
            </div>
            {errors.parentName && <p className="text-xs text-red-500 mt-1">{errors.parentName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                placeholder="Enter Your Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                style={{ border: errors.email ? '1.5px solid #f87171' : '1.5px solid rgba(200,210,240,0.7)' }}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                placeholder="Create Password"
                className="w-full pl-10 pr-12 py-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
                style={{
                  background: 'rgba(255,250,220,0.7)',
                  border: errors.password ? '1.5px solid #f87171' : '2px solid rgba(255,200,50,0.6)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })) }}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                style={{ border: errors.confirmPassword ? '1.5px solid #f87171' : '1.5px solid rgba(200,210,240,0.7)' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            style={{
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              boxShadow: '0 6px 24px rgba(33,150,243,0.45)',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Creating Account…
              </>
            ) : (
              <>👉 Create Account</>
            )}
          </button>

          {/* Security note */}
          <div
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(220,255,220,0.7)', color: '#166534' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Your account will be securely linked to your child
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ParentSignupPage() {
  return (
    <Suspense>
      <ParentSignupContent />
    </Suspense>
  )
}
