'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/context/AuthContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'

function getFirebaseError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.'
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a few minutes and try again.'
      default:
        return `Something went wrong (${code}). Please try again.`
    }
  }
  return 'Something went wrong. Please try again.'
}

const COUNTRIES = [
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'gb', label: '🇬🇧 United Kingdom' },
  { value: 'ca', label: '🇨🇦 Canada' },
  { value: 'au', label: '🇦🇺 Australia' },
  { value: 'de', label: '🇩🇪 Germany' },
  { value: 'fr', label: '🇫🇷 France' },
  { value: 'es', label: '🇪🇸 Spain' },
  { value: 'it', label: '🇮🇹 Italy' },
  { value: 'pt', label: '🇵🇹 Portugal' },
  { value: 'nl', label: '🇳🇱 Netherlands' },
  { value: 'se', label: '🇸🇪 Sweden' },
  { value: 'no', label: '🇳🇴 Norway' },
  { value: 'dk', label: '🇩🇰 Denmark' },
  { value: 'fi', label: '🇫🇮 Finland' },
  { value: 'pl', label: '🇵🇱 Poland' },
  { value: 'ru', label: '🇷🇺 Russia' },
  { value: 'cn', label: '🇨🇳 China' },
  { value: 'jp', label: '🇯🇵 Japan' },
  { value: 'kr', label: '🇰🇷 South Korea' },
  { value: 'in', label: '🇮🇳 India' },
  { value: 'pk', label: '🇵🇰 Pakistan' },
  { value: 'bd', label: '🇧🇩 Bangladesh' },
  { value: 'ng', label: '🇳🇬 Nigeria' },
  { value: 'za', label: '🇿🇦 South Africa' },
  { value: 'eg', label: '🇪🇬 Egypt' },
  { value: 'br', label: '🇧🇷 Brazil' },
  { value: 'mx', label: '🇲🇽 Mexico' },
  { value: 'ar', label: '🇦🇷 Argentina' },
  { value: 'cl', label: '🇨🇱 Chile' },
  { value: 'co', label: '🇨🇴 Colombia' },
  { value: 'other', label: '🌍 Other' },
]

// Sparkle SVG icon
function Sparkle({ size = 16, color = '#ffd93d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z"
        fill={color}
      />
    </svg>
  )
}

// Teacher illustration SVG
function TeacherIllustration() {
  return (
    <svg viewBox="0 0 220 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Chalkboard */}
      <rect x="30" y="10" width="160" height="90" rx="8" fill="#2d6a4f" />
      <rect x="34" y="14" width="152" height="82" rx="5" fill="#40916c" />
      {/* Chalkboard frame bottom rail */}
      <rect x="30" y="98" width="160" height="7" rx="3" fill="#a0522d" />
      {/* Chalk lines on board */}
      <line x1="44" y1="35" x2="110" y2="35" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="44" y1="48" x2="90" y2="48" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <text x="120" y="62" fontSize="18" fill="#ffd93d" opacity="0.9">✦</text>
      <text x="50" y="70" fontSize="10" fill="white" opacity="0.4">{ '{ }' }</text>
      <text x="72" y="70" fontSize="10" fill="white" opacity="0.3">{'<>'}</text>
      {/* Plant on shelf */}
      <rect x="170" y="96" width="16" height="10" rx="2" fill="#74b0d4" />
      <ellipse cx="178" cy="90" rx="9" ry="8" fill="#52b788" />
      <ellipse cx="174" cy="88" rx="5" ry="6" fill="#6bcb77" />
      <ellipse cx="182" cy="87" rx="5" ry="7" fill="#52b788" />
      {/* Books stack on left */}
      <rect x="30" y="100" width="22" height="10" rx="1" fill="#ff6b6b" />
      <rect x="30" y="93" width="22" height="8" rx="1" fill="#4a90d9" />
      <rect x="30" y="87" width="22" height="7" rx="1" fill="#6bcb77" />
      {/* Teacher body */}
      <rect x="88" y="70" width="34" height="40" rx="6" fill="#ffd93d" />
      {/* Teacher shirt collar */}
      <rect x="94" y="70" width="22" height="12" rx="3" fill="white" />
      {/* Teacher head */}
      <circle cx="105" cy="55" r="18" fill="#ffd5a0" />
      {/* Hair bun */}
      <path d="M88 50 Q88 34 105 34 Q122 34 122 50 Q122 40 105 37 Q90 37 88 50Z" fill="#6b3a0f" />
      <circle cx="105" cy="33" r="7" fill="#6b3a0f" />
      {/* Hair bun highlight */}
      <circle cx="107" cy="31" r="3" fill="#8b4513" opacity="0.5" />
      {/* Eyes */}
      <circle cx="100" cy="55" r="2" fill="#333" />
      <circle cx="110" cy="55" r="2" fill="#333" />
      {/* Eye shine */}
      <circle cx="101" cy="54" r="0.7" fill="white" />
      <circle cx="111" cy="54" r="0.7" fill="white" />
      {/* Smile */}
      <path d="M100 62 Q105 66 110 62" stroke="#c47a3a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="97" cy="60" r="3" fill="#ff9999" opacity="0.4" />
      <circle cx="113" cy="60" r="3" fill="#ff9999" opacity="0.4" />
      {/* Pointing arm */}
      <path d="M122 78 Q138 65 148 48" stroke="#ffd5a0" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="148" cy="47" r="6" fill="#ffd5a0" />
      {/* Left arm holding tablet */}
      <path d="M88 78 Q76 82 68 80" stroke="#ffd5a0" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Tablet */}
      <rect x="52" y="72" width="20" height="26" rx="3" fill="#4a90d9" />
      <rect x="54" y="74" width="16" height="20" rx="2" fill="#7ec8f7" />
      <line x1="56" y1="79" x2="68" y2="79" stroke="white" strokeWidth="1.2" opacity="0.7" />
      <line x1="56" y1="84" x2="64" y2="84" stroke="white" strokeWidth="1.2" opacity="0.5" />
      {/* Sparkles around teacher */}
      <text x="130" y="30" fontSize="12" fill="#ffd93d">✦</text>
      <text x="36" y="30" fontSize="10" fill="#ff6b6b">✦</text>
    </svg>
  )
}

// Robot mascot
function RobotMascot() {
  return (
    <svg viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Light bulb above head */}
      <ellipse cx="45" cy="14" rx="12" ry="14" fill="#ffd93d" opacity="0.9" />
      <ellipse cx="45" cy="14" rx="8" ry="9" fill="#ffe566" />
      <rect x="41" y="26" width="8" height="5" rx="1" fill="#aaa" />
      <path d="M40 30 Q45 32 50 30" stroke="#888" strokeWidth="1.5" fill="none" />
      {/* Body */}
      <rect x="18" y="42" width="54" height="44" rx="12" fill="#e8f0fe" />
      <rect x="22" y="46" width="46" height="36" rx="8" fill="white" />
      {/* Chest display */}
      <rect x="28" y="50" width="34" height="22" rx="5" fill="#4a90d9" />
      <circle cx="37" cy="58" r="5" fill="#7ec8f7" />
      <circle cx="37" cy="58" r="3" fill="white" opacity="0.8" />
      <circle cx="53" cy="58" r="5" fill="#7ec8f7" />
      <circle cx="53" cy="58" r="3" fill="white" opacity="0.8" />
      {/* Smile */}
      <path d="M34 66 Q45 72 56 66" stroke="#4a90d9" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Head */}
      <rect x="22" y="20" width="46" height="24" rx="10" fill="#c8d8f0" />
      <rect x="26" y="23" width="38" height="18" rx="7" fill="#dce8ff" />
      {/* Eyes on head */}
      <circle cx="37" cy="32" r="5" fill="#4a90d9" />
      <circle cx="37" cy="32" r="3" fill="#1a6abf" />
      <circle cx="38.5" cy="30.5" r="1" fill="white" />
      <circle cx="53" cy="32" r="5" fill="#4a90d9" />
      <circle cx="53" cy="32" r="3" fill="#1a6abf" />
      <circle cx="54.5" cy="30.5" r="1" fill="white" />
      {/* Antenna */}
      <line x1="45" y1="20" x2="45" y2="14" stroke="#aab8cc" strokeWidth="2.5" />
      <circle cx="45" cy="14" r="3" fill="#ff6b6b" />
      {/* Arms */}
      <rect x="4" y="50" width="16" height="10" rx="5" fill="#c8d8f0" />
      <rect x="70" y="50" width="16" height="10" rx="5" fill="#c8d8f0" />
      {/* Hands wave */}
      <circle cx="6" cy="55" r="5" fill="#dce8ff" />
      <circle cx="84" cy="55" r="5" fill="#dce8ff" />
      {/* Legs */}
      <rect x="28" y="84" width="14" height="20" rx="5" fill="#c8d8f0" />
      <rect x="48" y="84" width="14" height="20" rx="5" fill="#c8d8f0" />
      {/* Feet */}
      <rect x="24" y="100" width="20" height="8" rx="4" fill="#aab8cc" />
      <rect x="46" y="100" width="20" height="8" rx="4" fill="#aab8cc" />
      {/* Confetti/sparkles */}
      <circle cx="12" cy="40" r="3" fill="#ff6b6b" opacity="0.7" />
      <circle cx="78" cy="38" r="2.5" fill="#ffd93d" opacity="0.7" />
      <circle cx="14" cy="70" r="2" fill="#6bcb77" opacity="0.6" />
    </svg>
  )
}

export default function TeacherSignupPage() {
  const { signup } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const navigated = useRef(false)

  useEffect(() => {
    if (!success) return
    if (navigated.current) return
    navigated.current = true

    const locale = window.location.pathname.split('/')[1] || 'en'
    const target = `/${locale}/onboarding/teacher/school-connection`

    console.log('🚀 TRIGGERING NAVIGATION')
    console.log('📍 Navigating to:', target)

    sessionStorage.setItem('fromTeacherSignup', 'true')
    window.location.replace(target)
  }, [success])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'us',
    terms: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    if (!formData.terms) {
      setError('Please accept the Terms of Service and Privacy Policy.')
      return
    }
    setPasswordError('')
    setError('')
    setLoading(true)
    
    try {
      // Create the user account
      await signup(formData.email, formData.password, {
        name: formData.name,
        gradeLevel: '',
        country: formData.country,
        language: 'en',
      })

      // auth.currentUser is always set synchronously after signup resolves
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('User not found after signup')
      }

      // Non-blocking Firestore write — a missing/misconfigured DB must not
      // prevent the teacher from reaching onboarding.
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          role: 'teacher',
          teacherStatus: 'PENDING_SCHOOL',
        })
      } catch (firestoreErr) {
        console.warn('⚠️ Firestore updateDoc failed (non-blocking):', firestoreErr)
        // Firestore can be retried on the onboarding page; auth succeeded so continue.
      }

      console.log('✅ Account created - triggering navigation')
      setSuccess(true)
      // Navigation is handled by the useEffect above — do not call router.push here.

    } catch (err: unknown) {
      console.error('Signup error:', err)
      setError(getFirebaseError(err))
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #b8c8e8 0%, #c8d8f5 20%, #dce4f5 40%, #e8d8f0 65%, #d8c8e8 85%, #c8b8d8 100%)',
      }}
    >
      {/* Decorative clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{ width: 320, height: 90, top: '4%', left: '-6%', background: 'rgba(255,255,255,0.75)', filter: 'blur(10px)' }}
        />
        <div
          className="absolute rounded-full"
          style={{ width: 250, height: 70, top: '2%', left: '2%', background: 'rgba(255,255,255,0.85)', filter: 'blur(5px)' }}
        />
        <div
          className="absolute rounded-full"
          style={{ width: 280, height: 80, top: '7%', right: '-4%', background: 'rgba(255,255,255,0.75)', filter: 'blur(10px)' }}
        />
        <div
          className="absolute rounded-full"
          style={{ width: 200, height: 60, top: '5%', right: '5%', background: 'rgba(255,255,255,0.8)', filter: 'blur(5px)' }}
        />
        <div
          className="absolute rounded-full"
          style={{ width: 600, height: 140, bottom: '5%', left: '-8%', background: 'rgba(255,255,255,0.55)', filter: 'blur(20px)' }}
        />
        <div
          className="absolute rounded-full"
          style={{ width: 400, height: 100, bottom: '10%', right: '-5%', background: 'rgba(255,255,255,0.5)', filter: 'blur(15px)' }}
        />

        {/* Sparkle stars */}
        {[
          { top: '3%', left: '8%', size: 18, color: '#ffd93d' },
          { top: '6%', left: '28%', size: 14, color: '#ffd93d' },
          { top: '4%', left: '52%', size: 16, color: '#ffd93d' },
          { top: '8%', right: '22%', size: 12, color: '#ffd93d' },
          { top: '5%', right: '8%', size: 16, color: '#ffd93d' },
          { top: '15%', left: '2%', size: 10, color: '#ff9ebc' },
          { top: '18%', right: '3%', size: 10, color: '#a8d8ea' },
        ].map((s, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              top: s.top,
              left: (s as { left?: string }).left,
              right: (s as { right?: string }).right,
            }}
          >
            <Sparkle size={s.size} color={s.color} />
          </span>
        ))}

        {/* Confetti dots */}
        {[
          { top: '25%', left: '1%', color: '#ff9ebc', size: 8 },
          { top: '35%', left: '3%', color: '#a8d8ea', size: 6 },
          { top: '45%', left: '1.5%', color: '#ffd93d', size: 7 },
          { top: '25%', right: '1%', color: '#6bcb77', size: 8 },
          { top: '40%', right: '2%', color: '#ff6b6b', size: 6 },
        ].map((d, i) => (
          <span
            key={`dot-${i}`}
            className="absolute rounded-full"
            style={{
              top: d.top,
              left: (d as { left?: string }).left,
              right: (d as { right?: string }).right,
              width: d.size,
              height: d.size,
              background: d.color,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Ground plants decoration */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        {/* Left plants/books */}
        <div className="absolute bottom-0 left-4 flex items-end gap-1">
          <div className="w-8 h-8 rounded-full" style={{ background: '#52b788', marginBottom: 8 }} />
          <div className="w-6 h-10 rounded-full" style={{ background: '#6bcb77', marginBottom: 12 }} />
          <div className="w-10 h-6 rounded-full" style={{ background: '#40916c', marginBottom: 6 }} />
          <div className="flex flex-col gap-0.5 mb-2 ml-1">
            <div className="w-10 h-3 rounded-sm" style={{ background: '#4a90d9' }} />
            <div className="w-10 h-3 rounded-sm" style={{ background: '#ff6b6b' }} />
            <div className="w-10 h-3 rounded-sm" style={{ background: '#ffd93d' }} />
          </div>
          <div className="w-4 h-14 rounded-full mb-1" style={{ background: '#52b788' }} />
        </div>
        {/* Stone path effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(180,160,130,0.3) 60%, rgba(160,140,110,0.5) 100%)',
          }}
        />
        {/* Flowers */}
        {[15, 28, 42, 58, 72, 85].map((pct, i) => (
          <div
            key={i}
            className="absolute"
            style={{ bottom: 8, left: `${pct}%` }}
          >
            <div className="w-2 h-6 rounded-full mx-auto" style={{ background: '#52b788' }} />
            <div
              className="w-4 h-4 rounded-full -mt-2"
              style={{ background: ['#ff9ebc', '#ffd93d', '#ff6b6b', '#a8d8ea', '#6bcb77', '#ff9ebc'][i] }}
            />
          </div>
        ))}
      </div>

      {/* Robot mascot bottom right */}
      <div className="absolute bottom-12 right-4 w-20 h-24 pointer-events-none z-10" aria-hidden="true">
        <RobotMascot />
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center py-8 px-4 relative z-10">
        <div
          className="w-full max-w-md rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(255,255,255,0.75)',
            boxShadow: '0 8px 40px rgba(100,80,180,0.18)',
          }}
        >
          {/* Card inner padding */}
          <div className="px-8 pt-7 pb-8">
            {/* Logo */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-0.5 text-3xl font-extrabold tracking-tight font-fredoka">
                {['K', 'i', 'n', 'd', 'e', 'r', 'C', 'o', 'd', 'e'].map((ch, i) => (
                  <span
                    key={i}
                    style={{
                      color: [
                        '#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5',
                        '#8e24aa', '#e53935', '#fb8c00', '#1e88e5', '#43a047',
                      ][i],
                    }}
                  >
                    {ch}
                  </span>
                ))}
                <span className="ml-1">
                  <Sparkle size={14} color="#ffd93d" />
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">
              Create Teacher Account
            </h1>

            {/* Teacher illustration */}
            <div
              className="mx-auto mb-5 rounded-2xl overflow-hidden"
              style={{
                width: 220,
                height: 130,
                background: 'rgba(255,255,255,0.7)',
                border: '1.5px solid rgba(200,200,230,0.5)',
                boxShadow: '0 3px 14px rgba(100,80,180,0.12)',
              }}
            >
              <TeacherIllustration />
            </div>

            {/* Success state */}
            {success && (
              <div
                className="mb-4 px-4 py-3 rounded-2xl text-center font-bold text-lg"
                style={{ background: 'rgba(107,203,119,0.2)', border: '1.5px solid #6bcb77', color: '#276221' }}
              >
                ✅ Account Created! Redirecting to school selection...
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1">
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-3 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    border: '1.5px solid rgba(180,180,220,0.5)',
                    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.2)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(180,180,220,0.5)'; e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.05)' }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1">
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    border: '1.5px solid rgba(180,180,220,0.5)',
                    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.2)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(180,180,220,0.5)'; e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.05)' }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1">
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                  </svg>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="··········"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      border: '1.5px solid rgba(180,180,220,0.5)',
                      boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.2)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(180,180,220,0.5)'; e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.05)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1">
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                  </svg>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="··········"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      border: passwordError ? '1.5px solid #ef4444' : '1.5px solid rgba(180,180,220,0.5)',
                      boxShadow: passwordError ? '0 0 0 3px rgba(239,68,68,0.15)' : 'inset 0 1px 4px rgba(0,0,0,0.05)',
                    }}
                    onFocus={(e) => {
                      if (!passwordError) {
                        e.currentTarget.style.borderColor = '#a78bfa'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.2)'
                      }
                    }}
                    onBlur={(e) => {
                      if (!passwordError) {
                        e.currentTarget.style.borderColor = 'rgba(180,180,220,0.5)'
                        e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.05)'
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{passwordError}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1">
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    border: '1.5px solid rgba(180,180,220,0.5)',
                    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: '2.5rem',
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5 pt-1">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, terms: !prev.terms }))}
                    className="w-5 h-5 rounded flex items-center justify-center transition-all"
                    style={{
                      background: formData.terms ? '#43a047' : 'rgba(255,255,255,0.8)',
                      border: formData.terms ? '2px solid #43a047' : '2px solid rgba(150,150,200,0.6)',
                      boxShadow: formData.terms ? '0 2px 8px rgba(67,160,71,0.35)' : 'none',
                    }}
                  >
                    {formData.terms && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
                <label
                  className="text-sm text-gray-600 leading-snug cursor-pointer"
                  onClick={() => setFormData((prev) => ({ ...prev, terms: !prev.terms }))}
                >
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-semibold hover:underline"
                    style={{ color: '#1e88e5' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </Link>{' '}
                  &{' '}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="font-semibold hover:underline"
                    style={{ color: '#1e88e5' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all mt-2"
                style={{
                  background: loading || success
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                    : 'linear-gradient(135deg, #5db85f 0%, #43a047 50%, #388e3c 100%)',
                  boxShadow: loading || success ? 'none' : '0 6px 20px rgba(67,160,71,0.4)',
                  transform: loading || success ? 'none' : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!loading && !success) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(67,160,71,0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = loading || success ? 'none' : '0 6px 20px rgba(67,160,71,0.4)'
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Creating Account…
                  </span>
                ) : success ? (
                  '✅ Account Created!'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Firebase badge */}
            <div className="flex items-center justify-center mt-4 gap-1.5">
              <svg className="w-3.5 h-3.5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.89 15.67L6.6 3.5l5.78 5.78-2.87 4.42L3.89 15.67zm16.22 0L17.4 3.5l-5.78 5.78 2.87 4.42 5.62 1.97zM12 21.5l-4.89-2.83 1.89-3.67H15l1.89 3.67L12 21.5z" />
              </svg>
              <span className="text-xs text-gray-500 font-medium">Secured by Firebase</span>
            </div>

            {/* Login link */}
            <p className="text-center mt-3 text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}