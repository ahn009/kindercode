'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Mail, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

function getFirebaseError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/invalid-email':
        return 'No account found with that email address.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.'
      default:
        return 'Something went wrong. Please try again.'
    }
  }
  return 'Something went wrong. Please try again.'
}

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: unknown) {
      setError(getFirebaseError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
        }}
      />

      <main className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[30px] p-8 shadow-2xl border border-white/30 animate-slide-up-3d">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-indigo-600" />
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('resetPassword')}
            </h1>
            <p className="text-gray-500">
              {sent ? t('resetSentMsg') : t('resetEnterEmail')}
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="px-4 py-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-semibold text-center">
                Password reset email sent to <span className="font-bold">{email}</span>.
                Please check your inbox (and spam folder).
              </div>
              <button
                onClick={() => {
                  setSent(false)
                  setEmail('')
                }}
                className="w-full py-3 border-2 border-indigo-100 rounded-2xl text-indigo-600 font-semibold hover:bg-indigo-50 transition-all"
              >
                {t('sendAgain')}
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold text-center">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t('emailAddress')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    required
                    className="w-full px-5 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all hover:-translate-y-0.5"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
                >
                  {loading ? t('sending') : t('sendResetLink')}
                </button>
              </form>
            </>
          )}

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToLogin')}
          </Link>
        </div>
      </main>
    </div>
  )
}
