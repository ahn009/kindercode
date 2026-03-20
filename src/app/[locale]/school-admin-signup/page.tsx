'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/context/AuthContext'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { sendEmailVerification } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'

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

function generateSchoolId(): string {
  const num = Math.floor(10000 + Math.random() * 90000)
  return `SCL-${num}`
}

const COUNTRIES = [
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'gb', label: '🇬🇧 United Kingdom' },
  { value: 'ca', label: '🇨🇦 Canada' },
  { value: 'au', label: '🇦🇺 Australia' },
  { value: 'de', label: '🇩🇪 Germany' },
  { value: 'fr', label: '🇫🇷 France' },
  { value: 'in', label: '🇮🇳 India' },
  { value: 'pk', label: '🇵🇰 Pakistan' },
  { value: 'bd', label: '🇧🇩 Bangladesh' },
  { value: 'ng', label: '🇳🇬 Nigeria' },
  { value: 'za', label: '🇿🇦 South Africa' },
  { value: 'br', label: '🇧🇷 Brazil' },
  { value: 'mx', label: '🇲🇽 Mexico' },
  { value: 'other', label: '🌍 Other' },
]

const SCHOOL_TYPES = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' },
  { value: 'coaching-center', label: 'Coaching Center' },
  { value: 'online-academy', label: 'Online Academy' },
]

const ADMIN_ROLES = [
  { value: 'principal', label: 'Principal' },
  { value: 'director', label: 'Director' },
  { value: 'admin', label: 'Admin' },
]

function Sparkle({ size = 16, color = '#ffd93d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill={color} />
    </svg>
  )
}

function SchoolIllustration() {
  return (
    <svg viewBox="0 0 220 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Sky background */}
      <rect width="220" height="130" rx="8" fill="#e8f4ff" />
      {/* Clouds */}
      <ellipse cx="40" cy="25" rx="22" ry="10" fill="white" opacity="0.9" />
      <ellipse cx="55" cy="22" rx="18" ry="10" fill="white" opacity="0.9" />
      <ellipse cx="170" cy="20" rx="20" ry="9" fill="white" opacity="0.85" />
      <ellipse cx="185" cy="18" rx="16" ry="9" fill="white" opacity="0.85" />
      {/* Ground */}
      <rect x="0" y="105" width="220" height="25" rx="0" fill="#a8d5a2" />
      <rect x="0" y="112" width="220" height="18" rx="0" fill="#7ec87e" />
      {/* School building main */}
      <rect x="55" y="55" width="110" height="55" rx="4" fill="#c8d8f0" />
      {/* Roof */}
      <polygon points="50,60 110,25 170,60" fill="#8090b8" />
      {/* Roof top */}
      <polygon points="50,57 110,22 170,57" fill="#9aa8cc" />
      {/* Flagpole */}
      <line x1="110" y1="5" x2="110" y2="26" stroke="#666" strokeWidth="2" />
      <rect x="110" y="5" width="16" height="10" rx="1" fill="#ff6b6b" />
      {/* Entrance door */}
      <rect x="96" y="80" width="28" height="30" rx="3" fill="#7a9dbf" />
      <rect x="98" y="82" width="11" height="26" rx="2" fill="#5a7d9f" />
      <rect x="111" y="82" width="11" height="26" rx="2" fill="#5a7d9f" />
      <circle cx="109" cy="96" r="2" fill="#ffd93d" />
      <circle cx="112" cy="96" r="2" fill="#ffd93d" />
      {/* Windows */}
      <rect x="63" y="65" width="18" height="16" rx="2" fill="#7ec8f7" />
      <line x1="72" y1="65" x2="72" y2="81" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="63" y1="73" x2="81" y2="73" stroke="white" strokeWidth="1" opacity="0.7" />
      <rect x="139" y="65" width="18" height="16" rx="2" fill="#7ec8f7" />
      <line x1="148" y1="65" x2="148" y2="81" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="139" y1="73" x2="157" y2="73" stroke="white" strokeWidth="1" opacity="0.7" />
      {/* School sign */}
      <rect x="75" y="46" width="70" height="14" rx="3" fill="#ffd93d" opacity="0.9" />
      <text x="110" y="57" textAnchor="middle" fontSize="7" fill="#5a4a00" fontWeight="bold">SCHOOL</text>
      {/* Path to entrance */}
      <rect x="100" y="108" width="20" height="10" rx="1" fill="#d4c5a0" opacity="0.8" />
      {/* Trees */}
      <circle cx="30" cy="98" rx="14" ry="14" fill="#52b788" />
      <rect x="26" y="98" width="8" height="12" rx="2" fill="#6b4226" />
      <circle cx="190" cy="96" rx="12" ry="12" fill="#6bcb77" />
      <rect x="186" y="96" width="8" height="12" rx="2" fill="#6b4226" />
      {/* Stars */}
      <text x="20" y="15" fontSize="10" fill="#ffd93d">✦</text>
      <text x="195" y="35" fontSize="8" fill="#ff9ebc">✦</text>
    </svg>
  )
}

function FlowStep({ number, text, done }: { number: number; text: string; done?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
        style={{
          background: done ? 'linear-gradient(135deg, #43a047, #27ae60)' : 'linear-gradient(135deg, #4a90e2, #1e88e5)',
          color: 'white',
          boxShadow: done ? '0 2px 8px rgba(67,160,71,0.4)' : '0 2px 8px rgba(30,136,229,0.4)',
        }}
      >
        {done ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : number}
      </div>
      <p className="text-sm text-gray-700 font-medium leading-snug pt-1">{text}</p>
    </div>
  )
}

const inputStyle = {
  background: 'rgba(255,255,255,0.85)',
  border: '1.5px solid rgba(180,180,220,0.5)',
  boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
}

function useInputFocus() {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = '#a78bfa'
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.2)'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = 'rgba(180,180,220,0.5)'
      e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.05)'
    },
  }
}

export default function SchoolAdminSignupPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const focusHandlers = useInputFocus()

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [schoolId, setSchoolId] = useState('')

  const [form, setForm] = useState({
    // School info
    schoolName: '',
    schoolType: 'private',
    country: 'us',
    stateCity: '',
    schoolAddress: '',
    officialEmail: '',
    contactNumber: '',
    // Admin info
    adminName: '',
    adminRole: 'principal',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    if (!form.terms) {
      setError('Please accept the Terms of Service and Privacy Policy.')
      return
    }
    setPasswordError('')
    setError('')
    setLoading(true)

    try {
      const generatedSchoolId = generateSchoolId()
      setSchoolId(generatedSchoolId)

      // Create Firebase auth account for admin
      await signup(form.adminEmail, form.password, {
        name: form.adminName,
        gradeLevel: '',
        country: form.country,
        language: 'en',
      })

      if (auth.currentUser) {
        const uid = auth.currentUser.uid

        // Update user doc with school-admin role
        await setDoc(
          doc(db, 'users', uid),
          {
            role: 'school-admin',
            adminRole: form.adminRole,
            schoolId: generatedSchoolId,
          },
          { merge: true }
        )

        // Create school document
        await setDoc(doc(db, 'schools', generatedSchoolId), {
          schoolId: generatedSchoolId,
          schoolName: form.schoolName,
          schoolType: form.schoolType,
          country: form.country,
          stateCity: form.stateCity,
          schoolAddress: form.schoolAddress,
          officialEmail: form.officialEmail,
          contactNumber: form.contactNumber,
          adminUid: uid,
          adminName: form.adminName,
          adminEmail: form.adminEmail,
          status: 'pending-verification',
          createdAt: serverTimestamp(),
        })

        // Send email verification
        await sendEmailVerification(auth.currentUser)
      }

      // Show processing info briefly, then success screen
      setStep('processing')
      setTimeout(() => setStep('success'), 1500)
    } catch (err: unknown) {
      setError(getFirebaseError(err))
    } finally {
      setLoading(false)
    }
  }

  // ─── Background decorations ─────────────────────────────────────────────
  const bgDecorations = (
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
  )

  const cardStyle = {
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(18px)',
    border: '1.5px solid rgba(255,255,255,0.75)',
    boxShadow: '0 8px 40px rgba(100,80,180,0.18)',
  }

  const logoEl = (
    <div className="text-center mb-4">
      <div className="inline-flex items-center gap-0.5 text-3xl font-extrabold tracking-tight font-fredoka">
        {['K', 'i', 'n', 'd', 'e', 'r', 'C', 'o', 'd', 'e'].map((ch, i) => (
          <span key={i} style={{ color: ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#e53935', '#fb8c00', '#1e88e5', '#43a047'][i] }}>{ch}</span>
        ))}
        <span className="ml-1"><Sparkle size={14} color="#ffd93d" /></span>
      </div>
    </div>
  )

  // ─── Processing / Info Screen ────────────────────────────────────────────
  if (step === 'processing') {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #b8c8e8 0%, #c8d8f5 20%, #dce4f5 40%, #e8d8f0 65%, #d8c8e8 85%, #c8b8d8 100%)' }}>
        {bgDecorations}
        <main className="flex-1 flex items-center justify-center py-8 px-4 relative z-10">
          <div className="w-full max-w-md rounded-3xl overflow-hidden" style={cardStyle}>
            <div className="px-8 pt-7 pb-8">
              {logoEl}
              <h1 className="text-center text-xl font-bold text-gray-800 mb-2">What Happens After Submission?</h1>
              <p className="text-center text-sm text-gray-500 mb-6">System Actions (Backend Flow)</p>

              <div className="space-y-4 mb-6">
                <FlowStep number={1} text={`Unique School ID is generated: #${schoolId}`} done />
                <FlowStep number={2} text="School Database is created" done />
                <FlowStep number={3} text="Admin account is linked to that School ID" done />
                <FlowStep number={4} text="Verification email sent — School status: Pending Verification" done />
              </div>

              {/* School ID badge */}
              <div className="flex items-center justify-center mb-6">
                <div className="px-5 py-2.5 rounded-2xl font-bold text-lg" style={{ background: 'linear-gradient(135deg, #e8f4ff, #d0e8ff)', border: '2px solid #4a90e2', color: '#1a5fa8', letterSpacing: '0.05em' }}>
                  #{schoolId}
                </div>
              </div>

              <button
                onClick={() => setStep('success')}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all"
                style={{ background: 'linear-gradient(135deg, #4a90e2 0%, #1e88e5 50%, #1565c0 100%)', boxShadow: '0 6px 20px rgba(30,136,229,0.4)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,136,229,0.5)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,136,229,0.4)' }}
              >
                Continue →
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ─── Success Screen ──────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #b8c8e8 0%, #c8d8f5 20%, #dce4f5 40%, #e8d8f0 65%, #d8c8e8 85%, #c8b8d8 100%)' }}>
        {bgDecorations}
        <main className="flex-1 flex items-center justify-center py-8 px-4 relative z-10">
          <div className="w-full max-w-md rounded-3xl overflow-hidden" style={cardStyle}>
            <div className="px-8 pt-7 pb-8 text-center">
              {logoEl}

              {/* Success checkmark */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #43a047, #27ae60)', boxShadow: '0 6px 24px rgba(67,160,71,0.45)' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <h1 className="text-xl font-bold text-gray-800 mb-1">School Account Created Successfully!</h1>
              <p className="text-sm text-gray-500 mb-5">But before activation…</p>

              {/* Verification notice */}
              <div className="rounded-2xl p-4 mb-5 text-left" style={{ background: 'rgba(255,248,220,0.8)', border: '1.5px solid #f39c12' }}>
                <p className="text-sm text-gray-700 font-semibold mb-1">📧 Verify your email address</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We&apos;ve sent a verification link to <span className="font-semibold text-gray-700">{form.adminEmail}</span>.
                  Please check your inbox and click the link to verify your email address and activate your school account.
                </p>
              </div>

              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(243,156,18,0.15)', border: '1.5px solid #f39c12' }}>
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-sm font-semibold text-yellow-700">School status: Pending Verification</span>
              </div>

              <button
                onClick={() => router.push('/school-admin-dashboard')}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all mb-3"
                style={{ background: 'linear-gradient(135deg, #4a90e2 0%, #1e88e5 50%, #1565c0 100%)', boxShadow: '0 6px 20px rgba(30,136,229,0.4)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,136,229,0.5)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,136,229,0.4)' }}
              >
                Go to Dashboard →
              </button>

              <p className="text-xs text-gray-400">Your school ID: <span className="font-bold text-gray-600">#{schoolId}</span></p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ─── Registration Form ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #b8c8e8 0%, #c8d8f5 20%, #dce4f5 40%, #e8d8f0 65%, #d8c8e8 85%, #c8b8d8 100%)' }}>
      {bgDecorations}

      <main className="flex-1 flex items-center justify-center py-8 px-4 relative z-10">
        <div className="w-full max-w-lg rounded-3xl overflow-hidden" style={cardStyle}>
          <div className="px-8 pt-7 pb-8">
            {logoEl}

            <h1 className="text-center text-2xl font-bold text-gray-800 mb-1">Register Your School</h1>
            <p className="text-center text-sm text-gray-500 mb-4">Get Started with KinderCode for your institution</p>

            {/* School illustration */}
            <div className="mx-auto mb-5 rounded-2xl overflow-hidden" style={{ width: 220, height: 130, background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(200,200,230,0.5)', boxShadow: '0 3px 14px rgba(100,80,180,0.12)' }}>
              <SchoolIllustration />
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ── Section: Basic School Information ── */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.5)', border: '1.5px solid rgba(200,210,240,0.6)' }}>
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21V9l9-6 9 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="9" y="14" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Basic School Information
                </h2>
                <div className="space-y-3">
                  {/* School Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">School Name</label>
                    <input
                      type="text"
                      name="schoolName"
                      value={form.schoolName}
                      onChange={handleChange}
                      placeholder="e.g. Greenwood Elementary"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                      style={inputStyle}
                      {...focusHandlers}
                    />
                  </div>

                  {/* School Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">School Type</label>
                    <select
                      name="schoolType"
                      value={form.schoolType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                      style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '2.5rem' }}
                      {...focusHandlers}
                    >
                      {SCHOOL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  {/* Country + State/City */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Country</label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                        style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '2rem' }}
                        {...focusHandlers}
                      >
                        {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">State / City</label>
                      <input
                        type="text"
                        name="stateCity"
                        value={form.stateCity}
                        onChange={handleChange}
                        placeholder="e.g. New York"
                        required
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                        style={inputStyle}
                        {...focusHandlers}
                      />
                    </div>
                  </div>

                  {/* School Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">School Address</label>
                    <input
                      type="text"
                      name="schoolAddress"
                      value={form.schoolAddress}
                      onChange={handleChange}
                      placeholder="Street address"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                      style={inputStyle}
                      {...focusHandlers}
                    />
                  </div>

                  {/* Official Email + Contact */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Official Email</label>
                      <input
                        type="email"
                        name="officialEmail"
                        value={form.officialEmail}
                        onChange={handleChange}
                        placeholder="school@edu.com"
                        required
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                        style={inputStyle}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Number</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={form.contactNumber}
                        onChange={handleChange}
                        placeholder="+1 555-0000"
                        required
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                        style={inputStyle}
                        {...focusHandlers}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section: Admin Details ── */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.5)', border: '1.5px solid rgba(200,210,240,0.6)' }}>
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Admin (School Owner) Details
                </h2>
                <div className="space-y-3">
                  {/* Full Name + Role */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="adminName"
                        value={form.adminName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                        style={inputStyle}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Role</label>
                      <select
                        name="adminRole"
                        value={form.adminRole}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                        style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '2rem' }}
                        {...focusHandlers}
                      >
                        {ADMIN_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Admin Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Email</label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={form.adminEmail}
                      onChange={handleChange}
                      placeholder="admin@example.com"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                      style={inputStyle}
                      {...focusHandlers}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="··········"
                        required
                        className="w-full px-4 py-2.5 pr-11 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                        style={inputStyle}
                        {...focusHandlers}
                      />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                        {showPassword
                          ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                          : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /></svg>
                        }
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="··········"
                        required
                        className="w-full px-4 py-2.5 pr-11 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                        style={{ ...inputStyle, border: passwordError ? '1.5px solid #ef4444' : '1.5px solid rgba(180,180,220,0.5)', boxShadow: passwordError ? '0 0 0 3px rgba(239,68,68,0.15)' : 'inset 0 1px 4px rgba(0,0,0,0.05)' }}
                        onFocus={(e) => { if (!passwordError) { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.2)' } }}
                        onBlur={(e) => { if (!passwordError) { e.currentTarget.style.borderColor = 'rgba(180,180,220,0.5)'; e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.05)' } }}
                      />
                      <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                        {showConfirm
                          ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                          : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /></svg>
                        }
                      </button>
                    </div>
                    {passwordError && <p className="mt-1 text-xs text-red-500 font-semibold">{passwordError}</p>}
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5 pt-1">
                <div className="relative flex-shrink-0 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, terms: !prev.terms }))}
                    className="w-5 h-5 rounded flex items-center justify-center transition-all"
                    style={{ background: form.terms ? '#43a047' : 'rgba(255,255,255,0.8)', border: form.terms ? '2px solid #43a047' : '2px solid rgba(150,150,200,0.6)', boxShadow: form.terms ? '0 2px 8px rgba(67,160,71,0.35)' : 'none' }}
                  >
                    {form.terms && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
                <label className="text-sm text-gray-600 leading-snug cursor-pointer" onClick={() => setForm((prev) => ({ ...prev, terms: !prev.terms }))}>
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="font-semibold hover:underline" style={{ color: '#1e88e5' }} onClick={(e) => e.stopPropagation()}>Terms of Service</Link>
                  {' '}&{' '}
                  <Link href="/privacy-policy" target="_blank" className="font-semibold hover:underline" style={{ color: '#1e88e5' }} onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all mt-1"
                style={{ background: loading ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 'linear-gradient(135deg, #4a90e2 0%, #1e88e5 50%, #1565c0 100%)', boxShadow: loading ? 'none' : '0 6px 20px rgba(30,136,229,0.4)', cursor: loading ? 'not-allowed' : 'pointer' }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,136,229,0.5)' } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = loading ? 'none' : '0 6px 20px rgba(30,136,229,0.4)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Creating Account…
                  </span>
                ) : 'Create School Account'}
              </button>
            </form>

            {/* Firebase badge */}
            <div className="flex items-center justify-center mt-4 gap-1.5">
              <svg className="w-3.5 h-3.5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.89 15.67L6.6 3.5l5.78 5.78-2.87 4.42L3.89 15.67zm16.22 0L17.4 3.5l-5.78 5.78 2.87 4.42 5.62 1.97zM12 21.5l-4.89-2.83 1.89-3.67H15l1.89 3.67L12 21.5z" />
              </svg>
              <span className="text-xs text-gray-500 font-medium">Secured by Firebase</span>
            </div>

            <p className="text-center mt-3 text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 font-bold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
