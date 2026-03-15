'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { Star, Trophy, Users, Code } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const t = useTranslations('auth')
  const { login, googleLogin } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password, rememberMe)
      router.push('/home')
    } catch (err: unknown) {
      setError(getFirebaseError(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    setLoading(true)
    try {
      await googleLogin()
      router.push('/home')
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
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
          {/* Info Side */}
          <div className="flex-1 text-white text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Welcome Back!
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Login to continue your coding journey and access your personalized
              learning dashboard.
            </p>
            <ul className="space-y-4">
              {[
                { Icon: Star, text: 'Track your progress' },
                { Icon: Trophy, text: 'View your achievements' },
                { Icon: Users, text: 'Connect with friends' },
                { Icon: Code, text: 'Continue learning' },
              ].map(({ Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-4 justify-center lg:justify-start text-lg"
                >
                  <Icon className="w-6 h-6 text-amber-400" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[30px] p-8 shadow-2xl border border-white/30 animate-slide-up-3d">
            <div className="text-center mb-8">
              <h1
                className="text-3xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('login')}
              </h1>
              <p className="text-gray-500">{t('loginTagline')}</p>
            </div>

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
                  {t('email')}
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

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {t('password')}
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordPlaceholder')}
                  required
                  className="w-full px-5 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all hover:-translate-y-0.5"
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-sm">{t('rememberMe')}</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm"
                >
                  {t('forgotPassword')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                style={{ boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
              >
                {loading ? t('loggingIn') : t('loginBtn')}
              </button>
            </form>

            <div className="flex items-center my-6 text-gray-400">
              <div className="flex-1 h-px bg-indigo-100" />
              <span className="px-4 font-semibold text-sm">
                {t('orContinueWith')}
              </span>
              <div className="flex-1 h-px bg-indigo-100" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 border-2 border-indigo-100 rounded-2xl bg-white flex items-center justify-center gap-3 font-semibold text-gray-700 hover:bg-indigo-50 hover:border-indigo-500 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#db4437"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#4285f4"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#34a853"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('signInWithGoogle')}
            </button>

            <p className="text-center mt-6 text-gray-500">
              {t('noAccount')}{' '}
              <Link
                href="/signup"
                className="text-indigo-600 font-bold hover:underline"
              >
                {t('signUpLink')}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

function getFirebaseError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.'
      case 'auth/too-many-requests':
        return 'Account temporarily locked. Reset your password or wait a few minutes.'
      case 'auth/user-disabled':
        return 'This account has been disabled.'
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.'
      case 'auth/popup-blocked':
        return 'Popup blocked by browser. Please allow popups and try again.'
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.'
      default:
        return `Something went wrong (${code}). Please try again.`
    }
  }
  return 'Something went wrong. Please try again.'
}
