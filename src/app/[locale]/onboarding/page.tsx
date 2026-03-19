'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import StudentOnboarding from './StudentOnboarding'
import TeacherOnboarding from './TeacherOnboarding'
import SchoolAdminOnboarding from './SchoolAdminOnboarding'

/*
 * Flowchart routing:
 *   student      → StudentOnboarding  (optional school selection → request to admin)
 *   teacher      → TeacherOnboarding  (school or freelancer → request to admin → main subject)
 *   school-admin → SchoolAdminOnboarding (register school → docs → management)
 */
function OnboardingRouter() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'student'

  if (role === 'teacher') return <TeacherOnboarding />
  if (role === 'school-admin') return <SchoolAdminOnboarding />
  return <StudentOnboarding />
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
