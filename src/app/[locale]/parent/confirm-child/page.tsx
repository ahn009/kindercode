'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
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

function ConfirmChildContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const childName = searchParams.get('childName') || 'Daniel Johnson'
  const grade = searchParams.get('grade') || 'Grade 5 – Coding Basics'
  const teacher = searchParams.get('teacher') || 'Ms. Sarah'
  const school = searchParams.get('school') || 'Green Valley School'

  function handleConfirm() {
    const params = new URLSearchParams({ childName, grade, teacher, school })
    router.push(`/parent/signup?${params.toString()}` as Parameters<typeof router.push>[0])
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
            🎉 Child Found!
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base font-medium">
            You are connecting to:
          </p>
        </div>

        {/* Child Details Card */}
        <div
          className="rounded-2xl p-5 mb-6 space-y-3"
          style={{
            background: 'rgba(255,255,255,0.75)',
            border: '1.5px solid rgba(200,200,230,0.5)',
            boxShadow: '0 2px 12px rgba(100,100,200,0.08)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧒</span>
            <span className="text-lg font-bold text-indigo-900">{childName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <span className="text-gray-700 font-medium">{grade}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">👩‍🏫</span>
            <span className="text-gray-700 font-medium">{teacher}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <span className="text-gray-700 font-medium">{school}</span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl text-white text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 mb-4"
          style={{
            background: 'linear-gradient(135deg, #5b8dee 0%, #4a7de0 50%, #3a6dd0 100%)',
            boxShadow: '0 6px 24px rgba(74,125,224,0.45)',
          }}
        >
          Confirm &amp; Create Account &nbsp;›
        </button>

        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="w-full text-center text-sm text-indigo-500 hover:text-indigo-700 transition font-medium"
        >
          ← Go Back
        </button>
      </div>
    </div>
  )
}

export default function ConfirmChildPage() {
  return (
    <Suspense>
      <ConfirmChildContent />
    </Suspense>
  )
}
