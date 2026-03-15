'use client'

import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/context/AuthContext'

/**
 * Wrap any page that requires authentication.
 * Redirects unauthenticated users to /login.
 * Shows a spinner while auth state is loading.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2d3748]">
        <div className="w-12 h-12 border-4 border-[#FFD93D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
