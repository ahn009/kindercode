'use client'

import { useTranslations } from 'next-intl'
import { useAuth } from '@/context/AuthContext'
import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { useEffect } from 'react'
import {
  Trophy,
  Flame,
  Star,
  BookOpen,
  Calculator,
  Globe,
  Brain,
  Palette,
  ChevronRight,
  Zap,
} from 'lucide-react'

const gameCategories = [
  { icon: Calculator, color: '#FF6B6B', bg: 'rgba(255,107,107,0.1)', key: 'mathGames' },
  { icon: Globe, color: '#4A90E2', bg: 'rgba(74,144,226,0.1)', key: 'languageLearning' },
  { icon: Brain, color: '#9B59B6', bg: 'rgba(155,89,182,0.1)', key: 'logicPuzzles' },
  { icon: Palette, color: '#27AE60', bg: 'rgba(39,174,96,0.1)', key: 'creativeArts' },
]

const achievements = [
  { emoji: '🏆', label: 'First Code', earned: true },
  { emoji: '⚡', label: 'Speed Coder', earned: true },
  { emoji: '🌟', label: '7-Day Streak', earned: true },
  { emoji: '🎯', label: 'Perfect Score', earned: false },
  { emoji: '🚀', label: 'Level 10', earned: false },
  { emoji: '🧩', label: 'Puzzle Master', earned: false },
]

export default function HomePage() {
  const t = useTranslations('dashboard')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2d3748]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#FFD93D] border-t-transparent animate-spin" />
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  // Show spinner while redirecting unauthenticated users — prevents blank flash
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2d3748]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#FFD93D] border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  const displayName = user.displayName ?? user.email?.split('@')[0] ?? 'Coder'
  const userInitials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Dashboard Hero */}
      <div
        className="relative overflow-hidden py-10 px-6 md:px-10"
        style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #FFD93D 0%, transparent 50%), radial-gradient(circle at 80% 20%, #FF6B6B 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FFD93D 100%)' }}
              >
                {userInitials}
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">{t('welcome')},</p>
                <h1 className="font-fredoka text-3xl font-bold text-white">{displayName}! 👋</h1>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6">
              {[
                { icon: Flame, value: '7', label: t('streak'), color: '#FF8C42' },
                { icon: Star, value: '1,240', label: t('points'), color: '#FFD93D' },
                { icon: Zap, value: '5', label: t('level'), color: '#4A90E2' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Icon className="w-4 h-4" style={{ color }} />
                    <span className="text-xl font-extrabold text-white">{value}</span>
                  </div>
                  <span className="text-white/60 text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 space-y-8">
        {/* Daily Challenge */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-fredoka text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#FFD93D]" />
              {t('dailyChallenge')}
            </h2>
          </div>
          <div
            className="rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Today&apos;s Challenge</p>
              <h3 className="font-fredoka text-2xl font-bold text-white mb-2">Build a Number Sorter 🔢</h3>
              <p className="text-white/70 text-sm">Use loops and arrays to sort numbers from smallest to largest.</p>
            </div>
            <Link
              href="#"
              className="flex-shrink-0 px-6 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)' }}
            >
              {t('startCoding')} →
            </Link>
          </div>
        </section>

        {/* Progress */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-fredoka text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#4A90E2]" />
              {t('progress')}
            </h2>
            <Link href="#" className="text-sm font-semibold text-[#4A90E2] hover:underline flex items-center gap-1">
              {t('viewAll')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Python Basics', progress: 72, color: '#4A90E2', emoji: '🐍' },
              { title: 'Web Design', progress: 45, color: '#FF6B6B', emoji: '🎨' },
              { title: 'Math Logic', progress: 88, color: '#27AE60', emoji: '🔢' },
            ].map((course) => (
              <div key={course.title} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{course.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{course.title}</h3>
                    <p className="text-slate-500 text-xs">{t('continueLearning')}</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%`, background: course.color }}
                  />
                </div>
                <p className="text-right text-xs font-semibold mt-1" style={{ color: course.color }}>
                  {course.progress}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Game Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-fredoka text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Star className="w-6 h-6 text-[#FFD93D]" />
              {t('recommended')}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gameCategories.map(({ icon: Icon, color, bg, key }) => (
              <Link
                key={key}
                href="#"
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center gap-3 text-center"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <span className="font-bold text-slate-700 text-sm">{t(key as 'mathGames' | 'languageLearning' | 'logicPuzzles' | 'creativeArts')}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-fredoka text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#FFD93D]" />
              {t('achievements')}
            </h2>
            <Link href="#" className="text-sm font-semibold text-[#4A90E2] hover:underline flex items-center gap-1">
              {t('viewAll')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {achievements.map((badge) => (
              <div
                key={badge.label}
                className={`bg-white rounded-2xl p-4 shadow-sm border flex flex-col items-center gap-2 text-center transition-all ${
                  badge.earned ? 'border-[#FFD93D]/30 shadow-[#FFD93D]/20' : 'border-slate-100 opacity-40 grayscale'
                }`}
              >
                <span className="text-3xl">{badge.emoji}</span>
                <span className="font-semibold text-slate-700 text-xs leading-tight">{badge.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
