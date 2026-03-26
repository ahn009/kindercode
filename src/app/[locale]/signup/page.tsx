'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'

function getFirebaseError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.'
      case 'auth/popup-blocked':
        return 'Popup blocked by browser. Please allow popups and try again.'
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.'
      case 'auth/unauthorized-domain':
        return 'This domain is not authorised for sign-in. Please contact support.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a few minutes and try again.'
      default:
        return `Something went wrong (${code}). Please try again.`
    }
  }
  return 'Something went wrong. Please try again.'
}

function SignupContent() {
  const t = useTranslations('auth')
  const { signup, googleLogin } = useAuth()
  const router = useRouter()

  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gradeLevel: '',
    country: '',
    language: 'en',
    terms: false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    setPasswordError('')
    setError('')
    setLoading(true)
    try {
      await signup(formData.email, formData.password, {
        name: formData.name,
        gradeLevel: formData.gradeLevel,
        country: formData.country,
        language: formData.language,
      })
      const role = sessionStorage.getItem('selectedRole')
      router.push(role ? '/onboarding' : '/home')
    } catch (err: unknown) {
      setError(getFirebaseError(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignup() {
    setError('')
    setLoading(true)
    try {
      await googleLogin()
      const role = sessionStorage.getItem('selectedRole')
      router.push(role ? '/onboarding' : '/home')
    } catch (err: unknown) {
      setError(getFirebaseError(err))
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'Free access to beginner lessons',
    'Learn through games and stories',
    'Join coding competitions',
    'Connect with young coders worldwide',
    'Track progress with parent dashboard',
    'Earn badges and certificates',
  ]

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
        <div className="w-full max-w-6xl flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Signup Card */}
          <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-[30px] p-8 shadow-2xl border border-white/30 animate-slide-up-3d">
            <div className="text-center mb-6">
              <h1
                className="text-3xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('createAccount')}
              </h1>
              <p className="text-gray-500">{t('joinTagline')}</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  {t('name')} <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('namePlaceholder')}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  {t('email')} <span className="text-pink-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('emailPlaceholder')}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    {t('password')} <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('passwordPlaceholder')}
                    required
                    className="w-full px-4 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    {t('confirmPassword')}{' '}
                    <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('confirmPasswordPlaceholder')}
                    required
                    className={`w-full px-4 py-3 border-2 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 transition-all ${
                      passwordError
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : 'border-indigo-100 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  />
                  {passwordError && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              {/* Grade + Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="gradeLevel"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    {t('gradeLevel')} <span className="text-pink-500">*</span>
                  </label>
                  <select
                    id="gradeLevel"
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                  >
                    <option value="">{t('gradePlaceholder')}</option>
                    <option value="kindergarten">Kindergarten</option>
                    <option value="grade1">Grade 1</option>
                    <option value="grade2">Grade 2</option>
                    <option value="grade3">Grade 3</option>
                    <option value="grade4">Grade 4</option>
                    <option value="grade5">Grade 5</option>
                    <option value="grade6">Grade 6</option>
                    <option value="grade7">Grade 7</option>
                    <option value="grade8">Grade 8</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    {t('country')} <span className="text-pink-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                  >
                    <option value="">{t('countryPlaceholder')}</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Preferred Language */}
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  {t('preferredLanguage')}{' '}
                  <span className="text-pink-500">*</span>
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                >
                  <option value="">{t('languagePlaceholder')}</option>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                  className="w-5 h-5 mt-0.5 accent-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-500 leading-relaxed"
                >
                  I accept the{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Privacy Policy
                  </Link>{' '}
                  <span className="text-pink-500">*</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                style={{ boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
              >
                {loading ? t('creatingAccount') : t('createAccountBtn')}
              </button>
            </form>

            <div className="flex items-center my-6 text-gray-400">
              <div className="flex-1 h-px bg-indigo-100" />
              <span className="px-4 font-semibold text-sm">
                {t('orSignUpWith')}
              </span>
              <div className="flex-1 h-px bg-indigo-100" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
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
              {t('signUpWithGoogle')}
            </button>

            <p className="text-center mt-6 text-gray-500">
              {t('alreadyHaveAccount')}{' '}
              <Link
                href="/login"
                className="text-indigo-600 font-bold hover:underline"
              >
                {t('loginLink')}
              </Link>
            </p>
          </div>

          {/* Info Side */}
          <div className="flex-1 text-white text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Join KinderCode!
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Start your coding journey today with our fun and interactive
              platform
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 justify-center lg:justify-start text-lg"
                >
                  <CheckCircle className="w-6 h-6 text-amber-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SignupPage() {
  return <SignupContent />
}
