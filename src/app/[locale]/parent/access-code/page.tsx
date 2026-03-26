'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'

// Mock validation — replace with real API call
function validateParentCode(code: string, childName: string): { valid: boolean; child?: { name: string; grade: string; teacher: string; school: string } } {
  const mockCodes: Record<string, { name: string; grade: string; teacher: string; school: string }> = {
    'KC-PARENT-8472': { name: 'Daniel Johnson', grade: 'Grade 5 – Coding Basics', teacher: 'Ms. Sarah', school: 'Green Valley School' },
    'KC-PARENT-1234': { name: 'Emma Wilson', grade: 'Grade 3 – Scratch Basics', teacher: 'Mr. Adams', school: 'Bright Minds Academy' },
  }
  const child = mockCodes[code.toUpperCase()]
  if (!child) return { valid: false }
  const nameMatch = childName.trim().toLowerCase() === child.name.toLowerCase()
  return nameMatch ? { valid: true, child } : { valid: false }
}

function KinderCodeLogo() {
  return (
    <div className="inline-flex items-center gap-0.5 text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
      {['K','i','n','d','e','r','C','o','d','e'].map((ch, i) => (
        <span key={i} style={{ color: ['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa','#e53935','#fb8c00','#1e88e5','#43a047'][i] }}>{ch}</span>
      ))}
    </div>
  )
}

export default function ParentAccessCodePage() {
  const router = useRouter()
  const [childName, setChildName] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    if (!childName.trim() || !accessCode.trim()) {
      setError(true)
      return
    }
    setLoading(true)
    setError(false)

    // Simulate async validation
    await new Promise(r => setTimeout(r, 600))
    const result = validateParentCode(accessCode, childName)
    setLoading(false)

    if (!result.valid || !result.child) {
      setError(true)
      return
    }

    const params = new URLSearchParams({
      childName: result.child.name,
      grade: result.child.grade,
      teacher: result.child.teacher,
      school: result.child.school,
    })
    router.push(`/parent/confirm-child?${params.toString()}` as Parameters<typeof router.push>[0])
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-6 pb-10 px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #c9d8f5 0%, #dce8ff 35%, #e8d5f5 65%, #d0c8e8 100%)',
      }}
    >
      {/* Cloud decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full" style={{ width: 280, height: 85, top: '5%', left: '-5%', background: 'rgba(255,255,255,0.65)', filter: 'blur(10px)' }} />
        <div className="absolute rounded-full" style={{ width: 220, height: 65, top: '4%', left: '2%', background: 'rgba(255,255,255,0.75)', filter: 'blur(5px)' }} />
        <div className="absolute rounded-full" style={{ width: 320, height: 95, top: '10%', right: '-6%', background: 'rgba(255,255,255,0.65)', filter: 'blur(10px)' }} />
        <div className="absolute rounded-full" style={{ width: 260, height: 75, top: '9%', right: '-2%', background: 'rgba(255,255,255,0.75)', filter: 'blur(5px)' }} />
        <div className="absolute rounded-full" style={{ width: 520, height: 130, bottom: '5%', left: '-12%', background: 'rgba(255,255,255,0.55)', filter: 'blur(22px)' }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 90, bottom: '10%', right: '-8%', background: 'rgba(255,255,255,0.55)', filter: 'blur(18px)' }} />
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-6 mt-2">
        <KinderCodeLogo />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-lg rounded-3xl p-8 sm:p-10"
        style={{
          background: 'rgba(255,255,255,0.52)',
          backdropFilter: 'blur(18px)',
          border: '1.5px solid rgba(255,255,255,0.75)',
          boxShadow: '0 8px 40px rgba(120,100,200,0.16)',
        }}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            👨‍👩‍👧 Connect to Your Child
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Enter the Parent Access Code provided by your child.
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-5">
          {/* Child Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Child&apos;s Full Name
            </label>
            <input
              type="text"
              value={childName}
              onChange={e => { setChildName(e.target.value); setError(false) }}
              placeholder="Child's Full Name"
              className="w-full px-4 py-3 rounded-xl border bg-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              style={{ border: '1.5px solid rgba(200,200,230,0.6)' }}
            />
          </div>

          {/* Access Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Parent Access Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={accessCode}
                onChange={e => { setAccessCode(e.target.value); setError(false) }}
                placeholder="KC-PARENT-8472"
                className="w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition pr-12"
                style={{
                  background: 'rgba(255, 248, 210, 0.85)',
                  border: '2px solid rgba(255, 200, 50, 0.7)',
                }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl select-none">🔑</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(255,220,220,0.75)', color: '#c0392b' }}
            >
              <span className="text-base">🚫</span>
              Invalid or Expired Code
            </div>
          )}

          {/* Continue */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #5b8dee 0%, #4a7de0 50%, #3a6dd0 100%)',
              boxShadow: '0 6px 24px rgba(74,125,224,0.45)',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Validating…
              </>
            ) : (
              <>Continue &nbsp;›</>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(180,190,230,0.5)' }} />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(180,190,230,0.5)' }} />
        </div>

        {/* No registered child CTA */}
        <button
          onClick={() => router.push('/parent/signup' as Parameters<typeof router.push>[0])}
          className="mt-4 w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,237,213,0.9) 0%, rgba(254,215,170,0.85) 100%)',
            border: '1.5px solid rgba(251,146,60,0.4)',
            boxShadow: '0 3px 14px rgba(251,146,60,0.18)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">👶</span>
            <div className="text-left">
              <p className="text-sm font-bold text-orange-700 leading-tight">Don&apos;t have a registered child?</p>
              <p className="text-xs text-orange-500 font-medium mt-0.5">Register your child &amp; create account</p>
            </div>
          </div>
          <span className="text-orange-400 group-hover:translate-x-1 transition-transform duration-150 text-lg">→</span>
        </button>
      </div>
    </div>
  )
}
