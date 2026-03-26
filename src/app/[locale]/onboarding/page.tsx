'use client'

import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'

export default function OnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    const role = sessionStorage.getItem('selectedRole')

    if (role === 'teacher') {
      router.replace('/onboarding/teacher/school-connection')
    } else if (role === 'school-admin') {
      router.replace('/school-admin-signup')
    } else {
      // 'student' or no role (direct navigation to /onboarding)
      router.replace('/home')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
    </div>
  )
}
