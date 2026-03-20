'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from '@/i18n/navigation'
import { useEffect } from 'react'
import { Bell, Shield, Globe, Moon, Trash2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export default function SettingsPage() {
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

  const sections = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage email and push notification preferences',
      color: '#FFD93D',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Password, two-factor authentication, and account security',
      color: '#6BCB77',
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Change your display language and regional settings',
      color: '#4A90E2',
    },
    {
      icon: Moon,
      title: 'Appearance',
      description: 'Dark mode, font size, and display preferences',
      color: '#9B59B6',
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
      <div className="container-kinder py-12">
        {/* Back link */}
        <Link href="/home" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold mb-8 transition-colors">
          ← Back to Dashboard
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/50 text-sm mb-8">Manage your account preferences</p>

          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.title}
                className="flex items-center gap-5 px-6 py-5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-150 group"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${section.color}20` }}
                >
                  <section.icon className="w-5 h-5" style={{ color: section.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{section.title}</p>
                  <p className="text-white/50 text-xs mt-0.5">{section.description}</p>
                </div>
                <span className="text-white/30 group-hover:text-white/60 transition-colors text-lg">›</span>
              </div>
            ))}

            {/* Danger zone */}
            <div className="mt-8 px-6 py-5 rounded-2xl border border-red-500/20" style={{ background: 'rgba(239,68,68,0.05)' }}>
              <p className="text-red-400 font-bold text-sm mb-1">Danger Zone</p>
              <p className="text-white/40 text-xs mb-4">These actions are irreversible</p>
              <button className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
