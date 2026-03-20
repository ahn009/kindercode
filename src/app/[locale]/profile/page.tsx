'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from '@/i18n/navigation'
import { useEffect } from 'react'
import { User, Mail, Calendar, Rocket } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
        <div className="w-10 h-10 rounded-full border-4 border-[#FFD93D] border-t-transparent animate-spin" />
      </div>
    )
  }

  const userInitials = user.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email
    ? user.email[0].toUpperCase()
    : 'U'

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
      <div className="container-kinder py-12">
        {/* Back link */}
        <Link href="/home" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold mb-8 transition-colors">
          ← Back to Dashboard
        </Link>

        <div className="max-w-2xl mx-auto">
          {/* Profile card */}
          <div className="rounded-3xl p-8 border border-white/20" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-[#FFD93D]/50"
                style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FFD93D 100%)' }}
              >
                {userInitials}
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">
                  {user.displayName ?? user.email?.split('@')[0]}
                </h1>
                <p className="text-white/50 text-sm mt-1">KinderCode Member</p>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
                <User className="w-5 h-5 text-[#FFD93D] flex-shrink-0" />
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Display Name</p>
                  <p className="text-white font-semibold mt-0.5">{user.displayName ?? '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
                <Mail className="w-5 h-5 text-[#FFD93D] flex-shrink-0" />
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Email</p>
                  <p className="text-white font-semibold mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
                <Rocket className="w-5 h-5 text-[#FFD93D] flex-shrink-0" />
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Account Status</p>
                  <p className="text-[#6BCB77] font-semibold mt-0.5">Active</p>
                </div>
              </div>

              {user.metadata?.creationTime && (
                <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
                  <Calendar className="w-5 h-5 text-[#FFD93D] flex-shrink-0" />
                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Member Since</p>
                    <p className="text-white font-semibold mt-0.5">
                      {new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <Link
                href="/settings"
                className="flex-1 py-3 rounded-2xl text-center text-white font-bold text-sm transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FFD93D 100%)' }}
              >
                Edit Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
