'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from '@/i18n/navigation'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import { Bell, Lock, Globe, Trash2, ChevronRight } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'

export default function SettingsPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [newPassword, setNewPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [savingPassword, setSavingPassword] = useState(false)

  const [preferredLanguage, setPreferredLanguage] = useState('en')
  const [savingLang, setSavingLang] = useState(false)
  const [langMsg, setLangMsg] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !auth.currentUser) return
    setSavingPassword(true)
    setPasswordMsg(null)
    try {
      // Re-authenticate first (required by Firebase for sensitive operations)
      const credential = EmailAuthProvider.credential(user.email!, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, newPassword)
      setPasswordMsg({ type: 'success', text: 'Password updated successfully.' })
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'auth/wrong-password') {
        setPasswordMsg({ type: 'error', text: 'Current password is incorrect.' })
      } else if (code === 'auth/weak-password') {
        setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' })
      } else {
        setPasswordMsg({ type: 'error', text: 'Failed to update password. Please try again.' })
      }
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleSaveLanguage() {
    if (!user) return
    setSavingLang(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        preferredLanguage,
        updatedAt: serverTimestamp(),
      })
      setLangMsg('Language preference saved.')
      setTimeout(() => setLangMsg(''), 3000)
    } finally {
      setSavingLang(false)
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    await logout()
    router.push('/')
    // TODO: Call Firebase deleteUser + Firestore cleanup in a Cloud Function
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2d3748]">
        <div className="w-12 h-12 rounded-full border-4 border-[#FFD93D] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="py-10 px-6" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-fredoka text-3xl font-bold text-white">⚙️ Settings</h1>
          <p className="text-white/60 text-sm mt-1">Manage your account preferences</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Language Preference */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[#4A90E2]/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#4A90E2]" />
            </div>
            <h2 className="font-fredoka text-lg font-bold text-slate-800">Language Preference</h2>
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Preferred Language</label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#4A90E2] transition-all bg-white"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSaveLanguage}
              disabled={savingLang}
              className="px-5 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #667eea 100%)' }}
            >
              {savingLang ? 'Saving…' : 'Save'}
            </button>
          </div>
          {langMsg && <p className="mt-2 text-sm font-semibold text-green-600">{langMsg}</p>}
        </section>

        {/* Change Password */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#FF6B6B]" />
            </div>
            <h2 className="font-fredoka text-lg font-bold text-slate-800">Change Password</h2>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#667eea] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#667eea] transition-all"
              />
            </div>
            {passwordMsg && (
              <p className={`text-sm font-semibold ${passwordMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {passwordMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              {savingPassword ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Notifications (placeholder) */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FFD93D]/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <h2 className="font-fredoka text-lg font-bold text-slate-800">Notifications</h2>
          </div>
          {[
            { label: 'Daily challenge reminders', defaultChecked: true },
            { label: 'New badge earned', defaultChecked: true },
            { label: 'Weekly progress report', defaultChecked: false },
          ].map((item) => (
            <label key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 cursor-pointer">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <input type="checkbox" defaultChecked={item.defaultChecked} className="w-4 h-4 accent-[#667eea]" />
            </label>
          ))}
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-3xl shadow-sm border border-red-100 p-6">
          <h2 className="font-fredoka text-lg font-bold text-red-600 mb-4">⚠️ Danger Zone</h2>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-all text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete my account
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
          <p className="text-xs text-slate-400 mt-2">This action is permanent and cannot be undone.</p>
        </section>
      </div>
    </main>
  )
}
