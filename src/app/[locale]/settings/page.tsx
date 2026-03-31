'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { Bell, Shield, Globe, Moon, Trash2, ChevronRight, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { deleteUser } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'

interface NotificationSettings {
  weeklyReport: boolean
  dailyActivity: boolean
  teacherNotes: boolean
  achievements: boolean
}

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  weeklyReport: true,
  dailyActivity: true,
  teacherNotes: true,
  achievements: false,
}

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS)
  const [notifSaving, setNotifSaving] = useState(false)
  const [notifSaved, setNotifSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Load notification preferences from Firestore
  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data()
        if (data.notificationSettings) {
          setNotifications({ ...DEFAULT_NOTIFICATIONS, ...data.notificationSettings })
        }
      }
    }).catch(() => {})
  }, [user])

  async function saveNotifications(updated: NotificationSettings) {
    if (!user) return
    setNotifSaving(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        notificationSettings: updated,
        updatedAt: serverTimestamp(),
      })
      setNotifSaved(true)
      setTimeout(() => setNotifSaved(false), 2500)
    } catch {
      // silently fail
    } finally {
      setNotifSaving(false)
    }
  }

  function toggleNotification(key: keyof NotificationSettings) {
    const updated = { ...notifications, [key]: !notifications[key] }
    setNotifications(updated)
    saveNotifications(updated)
  }

  async function handleDeleteAccount() {
    if (!user || !auth.currentUser) return
    setDeleting(true)
    setDeleteError('')
    try {
      // Delete Firestore user doc first (best-effort, non-blocking)
      try {
        const { deleteDoc } = await import('firebase/firestore')
        await deleteDoc(doc(db, 'users', user.uid))
      } catch { /* non-blocking */ }
      // Delete Firebase Auth account
      await deleteUser(auth.currentUser)
      router.push('/' as Parameters<typeof router.push>[0])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete account.'
      if (msg.includes('requires-recent-login')) {
        setDeleteError('Please log out and log back in before deleting your account.')
      } else {
        setDeleteError(msg)
      }
    } finally {
      setDeleting(false)
    }
  }

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
      id: 'notifications',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Password, two-factor authentication, and account security',
      color: '#6BCB77',
      id: 'security',
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Change your display language and regional settings',
      color: '#4A90E2',
      id: 'language',
    },
    {
      icon: Moon,
      title: 'Appearance',
      description: 'Dark mode, font size, and display preferences',
      color: '#9B59B6',
      id: 'appearance',
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
              <div key={section.title}>
                <div
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className="flex items-center gap-5 px-6 py-5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-150 group"
                  style={{ background: expandedSection === section.id ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)' }}
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
                  <ChevronRight
                    className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-all duration-150"
                    style={{ transform: expandedSection === section.id ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  />
                </div>

                {/* Notifications panel */}
                {expandedSection === 'notifications' && section.id === 'notifications' && (
                  <div className="mt-1 px-6 py-4 rounded-2xl border border-white/10 space-y-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    {(Object.entries(notifications) as [keyof NotificationSettings, boolean][]).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-white/80 text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <button
                          onClick={() => toggleNotification(key)}
                          disabled={notifSaving}
                          className="relative w-11 h-6 rounded-full transition-colors disabled:opacity-60"
                          style={{ background: val ? '#FFD93D' : 'rgba(255,255,255,0.2)' }}
                        >
                          <div
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                            style={{ transform: val ? 'translateX(20px)' : 'translateX(2px)' }}
                          />
                        </button>
                      </div>
                    ))}
                    {notifSaved && (
                      <p className="text-xs text-green-400 font-semibold">✓ Preferences saved</p>
                    )}
                  </div>
                )}

                {/* Security panel */}
                {expandedSection === 'security' && section.id === 'security' && (
                  <div className="mt-1 px-6 py-4 rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <Link
                      href="/profile"
                      className="flex items-center justify-between py-2 text-white/80 text-sm font-medium hover:text-white transition-colors"
                    >
                      <span>Change Password</span>
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    </Link>
                  </div>
                )}

                {/* Language panel */}
                {expandedSection === 'language' && section.id === 'language' && (
                  <div className="mt-1 px-6 py-4 rounded-2xl border border-white/10 space-y-2" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <p className="text-white/50 text-xs mb-2">Switch language via the locale selector in the top navigation.</p>
                    <Link
                      href="/profile"
                      className="flex items-center justify-between py-2 text-white/80 text-sm font-medium hover:text-white transition-colors"
                    >
                      <span>Go to Profile</span>
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {/* Danger zone */}
            <div className="mt-8 px-6 py-5 rounded-2xl border border-red-500/20" style={{ background: 'rgba(239,68,68,0.05)' }}>
              <p className="text-red-400 font-bold text-sm mb-1">Danger Zone</p>
              <p className="text-white/40 text-xs mb-4">These actions are irreversible</p>

              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-300 text-sm font-semibold">Are you sure? This cannot be undone.</p>
                  {deleteError && (
                    <p className="text-red-400 text-xs">{deleteError}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
                      style={{ background: '#dc2626' }}
                    >
                      {deleting ? 'Deleting…' : 'Yes, Delete'}
                    </button>
                    <button
                      onClick={() => { setDeleteConfirm(false); setDeleteError('') }}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
