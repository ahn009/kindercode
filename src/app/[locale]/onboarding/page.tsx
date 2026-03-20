'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'

function OnboardingRouter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get('role') ?? 'student'

  useEffect(() => {
    if (role === 'teacher') {
      router.replace('/teacher-signup')
    } else if (role === 'school-admin') {
      router.replace('/school-admin-signup')
    } else {
      router.replace('/signup')
    }
  }, [role, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
        </div>
      }
    >
      <OnboardingRouter />
    </Suspense>
  )
}
