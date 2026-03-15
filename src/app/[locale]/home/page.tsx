'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import {
  Brain,
  Trophy,
  Flame,
  Star,
  Users,
  BarChart3,
  Award,
  User,
  Gamepad2,
  Bot,
  Target,
  Swords,
  Mic,
  BookOpen,
  Zap,
  MessageCircle,
  Heart,
  Puzzle,
  Cpu,
  Rocket,
  Play,
  Lightbulb,
  Medal,
  TrendingUp,
  Calendar,
  Coins,
  Sparkles,
} from 'lucide-react'

/* ──────────────────────────────────────────────
   Sidebar navigation data
────────────────────────────────────────────── */
const skillPaths = [
  { label: 'Problem Solving', icon: Lightbulb, color: '#FFD93D' },
  { label: 'AI Thinking', icon: Brain, color: '#9B59B6' },
  { label: 'Game Dev', icon: Gamepad2, color: '#FF6B6B' },
  { label: 'Robotics', icon: Cpu, color: '#4A90E2' },
]

const navItems = [
  { label: 'Challenges', icon: Target, color: '#FF8C42' },
  { label: 'Competition', icon: Swords, color: '#FF6B6B' },
  { label: 'Leaderboard', icon: Trophy, color: '#FFD93D' },
  { label: 'Community', icon: Users, color: '#6BCB77' },
  { label: 'Progress', icon: BarChart3, color: '#4A90E2' },
  { label: 'Certificates', icon: Award, color: '#9B59B6' },
  { label: 'Profile', icon: User, color: '#FF8C42' },
]

/* ──────────────────────────────────────────────
   Skill progress data
────────────────────────────────────────────── */
const skillData = [
  { label: 'Problem Solving', pct: 75, color: '#4A90E2', gradFrom: '#4A90E2', gradTo: '#2575fc' },
  { label: 'Game Development', pct: 60, color: '#FF8C42', gradFrom: '#FF8C42', gradTo: '#FF6B6B' },
  { label: 'Programming', pct: 45, color: '#9B59B6', gradFrom: '#9B59B6', gradTo: '#6C3483' },
]

/* ──────────────────────────────────────────────
   Learning path tabs
────────────────────────────────────────────── */
const learningTabs = [
  { label: 'Card Coding', icon: BookOpen, active: true, color: '#4A90E2', bg: 'rgba(74,144,226,0.12)' },
  { label: 'Puzzles', icon: Puzzle, active: false, color: '#FF8C42', bg: 'rgba(255,140,66,0.12)' },
  { label: 'Games', icon: Gamepad2, active: false, color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)' },
  { label: 'AI Stories', icon: Sparkles, active: false, color: '#9B59B6', bg: 'rgba(155,89,182,0.12)' },
]

/* ──────────────────────────────────────────────
   Main component
────────────────────────────────────────────── */
export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(24)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2d3748]">
        <div className="w-12 h-12 rounded-full border-4 border-[#FFD93D] border-t-transparent animate-spin" />
      </div>
    )
  }

  const displayName = user.displayName ?? user.email?.split('@')[0] ?? 'Aarav'
  const firstName = displayName.split(' ')[0]
  const userInitials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  function handleLike() {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
      {/* ═══════════════════════════════════════
          LEFT SIDEBAR
      ═══════════════════════════════════════ */}
      <aside
        className="flex-shrink-0 flex flex-col py-6 px-4 gap-1 overflow-y-auto"
        style={{
          width: 225,
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #1a2744 0%, #1e3a6e 60%, #1a2f5e 100%)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4A90E2, #9B59B6)' }}
          >
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-xl font-bold text-white"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            KinderCode
          </span>
        </div>

        {/* Skill Paths group */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-1 mt-2">
          Skill Paths
        </p>
        {skillPaths.map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium text-left w-full"
          >
            <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
            {label}
          </button>
        ))}

        <div className="my-2 border-t border-white/10" />

        {/* Other nav items */}
        {navItems.map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium text-left w-full"
          >
            <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
            {label}
          </button>
        ))}
      </aside>

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <main className="flex-1 min-w-0 overflow-x-hidden">

        {/* ── Top bar ── */}
        <div
          className="flex items-center justify-between px-8 py-4 border-b border-white/20"
          style={{ background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)' }}
        >
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Welcome Back,{' '}
            <span style={{ color: '#FFD93D' }}>{firstName}!</span>
          </h1>
          <div className="flex items-center gap-5">
            {/* Coins */}
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <span className="text-base">🪙</span>
              <span className="text-white font-bold text-sm">340</span>
            </div>
            {/* Stars */}
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-[#FFD93D] fill-[#FFD93D]" />
              <span className="text-white font-bold text-sm">⭐ 8</span>
            </div>
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF8C42, #FFD93D)' }}
            >
              {userInitials}
            </div>
          </div>
        </div>

        {/* ── Dashboard grid ── */}
        <div className="p-6 space-y-5">

          {/* ┌───────────────────────────────────────────────────────────┐
              ROW 1  — Greeting  |  Continue Learning
          └───────────────────────────────────────────────────────────┘ */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Greeting card */}
            <div
              className="lg:col-span-3 rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
            >
              {/* decorative circles */}
              <div
                className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #FFD93D, transparent)' }}
              />
              <div
                className="absolute bottom-0 left-1/3 w-28 h-28 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #4A90E2, transparent)' }}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white/60 text-sm font-medium mb-1">Hello,</p>
                  <h2
                    className="text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    {firstName}! 👋
                  </h2>
                  <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full mb-4">
                    <Zap className="w-3.5 h-3.5 text-[#FFD93D]" />
                    <span className="text-[#FFD93D] text-xs font-bold">Level 5 — Code Explorer</span>
                  </div>

                  {/* XP Bar */}
                  <div className="mb-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/70 text-xs font-medium flex items-center gap-1">
                        <span className="text-sm">🏅</span> XP Progress
                      </span>
                      <span className="text-white text-xs font-bold">350 / 500 XP</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: '70%',
                          background: 'linear-gradient(90deg, #FFD93D, #FF8C42)',
                          boxShadow: '0 0 8px rgba(255,217,61,0.6)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar bubble */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 mt-1"
                  style={{ background: 'linear-gradient(135deg, #FF8C42, #FFD93D)' }}
                >
                  {userInitials}
                </div>
              </div>

              {/* Bottom stats row */}
              <div className="relative flex items-center gap-4 mt-3 pt-3 border-t border-white/15">
                {[
                  { icon: '🔥', label: 'Streak', val: '12 Days' },
                  { icon: '⭐', label: 'Stars', val: '8 / 20' },
                  { icon: '🏆', label: 'Rank', val: '#15' },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <p className="text-white/50 text-[10px] leading-none">{label}</p>
                      <p className="text-white text-xs font-bold">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Learning */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3
                  className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  <BookOpen className="w-5 h-5 text-[#4A90E2]" />
                  Continue Learning
                </h3>

                {/* Lesson thumbnail */}
                <div
                  className="rounded-xl h-20 flex items-center justify-center mb-3 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  <Bot className="w-10 h-10 text-white/80" />
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 70% 30%, #FFD93D 0%, transparent 60%)',
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-white/20 rounded-full px-2 py-0.5 text-white text-[10px] font-bold">
                    70% Done
                  </div>
                </div>

                <p className="text-[#9B59B6] text-xs font-bold uppercase tracking-wide mb-0.5">
                  AI Thinking Skills
                </p>
                <p className="text-slate-800 font-bold text-sm leading-snug mb-1">
                  Lesson 4: How AI Makes Decisions
                </p>

                {/* Mini progress bar */}
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '70%',
                      background: 'linear-gradient(90deg, #9B59B6, #4A90E2)',
                    }}
                  />
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                style={{ background: 'linear-gradient(135deg, #9B59B6, #6C3483)' }}
              >
                <Play className="w-4 h-4 fill-white" />
                Resume Lesson
              </button>
            </div>
          </div>

          {/* ┌───────────────────────────────────────────────────────────┐
              ROW 2  — Skill Progress  |  Weekly Challenge
          └───────────────────────────────────────────────────────────┘ */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Skill Progress Overview */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="font-bold text-slate-800 text-lg flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  <BarChart3 className="w-5 h-5 text-[#4A90E2]" />
                  Skill Progress Overview
                </h3>
              </div>

              <div className="space-y-4 mb-4">
                {skillData.map(({ label, pct, gradFrom, gradTo }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-700 text-sm font-semibold">{label}</span>
                      <span className="text-sm font-bold" style={{ color: gradFrom }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Weak area badge */}
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4">
                <span className="text-base">⚠️</span>
                <span className="text-red-600 text-sm font-semibold">
                  Weak Area: <span className="font-bold">Loops</span>
                </span>
              </div>

              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 text-sm"
                style={{ background: 'linear-gradient(135deg, #4A90E2, #357ABD)' }}
              >
                <Lightbulb className="w-4 h-4" />
                Recommended Lesson
              </button>
            </div>

            {/* Weekly Challenge */}
            <div
              className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
              style={{ background: 'linear-gradient(135deg, #f5a623 0%, #f76b1c 100%)' }}
            >
              <div
                className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #fff, transparent)' }}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className="font-bold text-white text-lg"
                    style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    Weekly Challenge
                  </h3>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    ⏱ Ends in: 3d 12h
                  </span>
                </div>

                <div
                  className="rounded-xl h-20 flex items-center justify-center mb-3 mt-2 relative overflow-hidden"
                  style={{ background: 'rgba(0,0,0,0.15)' }}
                >
                  <Cpu className="w-10 h-10 text-white/90" />
                  <div className="absolute top-2 left-2 bg-white/20 rounded-full px-2 py-0.5 text-white text-[10px] font-bold">
                    🤖 Robot Builder
                  </div>
                </div>

                <p className="text-white font-bold text-base mb-1">Build a Smart Robot</p>
                <div className="flex items-center gap-1.5 mb-4">
                  <Star className="w-3.5 h-3.5 text-white/80 fill-white/80" />
                  <span className="text-white/90 text-xs font-semibold">Reward: 200 XP + 50 coins</span>
                </div>
              </div>

              <button
                className="w-full py-3 rounded-xl font-bold text-slate-800 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 text-sm"
                style={{ background: 'linear-gradient(135deg, #6BCB77, #27AE60)' }}
              >
                <span className="text-white">Join Challenge</span>
              </button>
            </div>
          </div>

          {/* ┌───────────────────────────────────────────────────────────┐
              ROW 3  — Competition  |  AI Quick Help
          └───────────────────────────────────────────────────────────┘ */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Competition */}
            <div
              className="lg:col-span-3 rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #FF6B6B, transparent)' }}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      🔴 LIVE
                    </span>
                    <span className="text-white/60 text-xs">Upcoming Event</span>
                  </div>
                  <h3
                    className="text-white font-bold text-xl mb-1"
                    style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    Upcoming Competition
                  </h3>
                  <p
                    className="font-bold mb-3"
                    style={{
                      fontFamily: 'var(--font-fredoka), sans-serif',
                      fontSize: 17,
                      background: 'linear-gradient(90deg, #FF6B6B, #FFD93D)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    National Coding Battle
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Calendar className="w-4 h-4 text-[#4A90E2]" />
                      <span>Saturday, 5:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Coins className="w-4 h-4 text-[#FFD93D]" />
                      <span>Prize Pool: <span className="text-[#FFD93D] font-bold">10,000 coins</span></span>
                    </div>
                  </div>

                  <button
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 text-sm"
                    style={{ background: 'linear-gradient(135deg, #9B59B6, #6C3483)' }}
                  >
                    <Rocket className="w-4 h-4" />
                    Register Now
                  </button>
                </div>

                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,107,107,0.15)', border: '1.5px solid rgba(255,107,107,0.3)' }}
                >
                  <Trophy className="w-8 h-8 text-[#FFD93D]" />
                </div>
              </div>
            </div>

            {/* AI Quick Help */}
            <div
              className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
              style={{ background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' }}
            >
              <div
                className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #fff, transparent)' }}
              />

              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.25)' }}
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <h3
                    className="font-bold text-white text-lg"
                    style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    AI Quick Help
                  </h3>
                </div>
                <p className="text-white/75 text-xs mb-5 leading-relaxed">
                  Stuck? Your AI mentor is ready to help you understand any concept instantly.
                </p>
              </div>

              <div className="relative flex flex-col gap-3">
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 text-sm"
                  style={{ background: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.4)' }}
                >
                  <Mic className="w-4 h-4" />
                  Ask AI
                </button>
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 text-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}
                >
                  <Lightbulb className="w-4 h-4" />
                  Explain Last Mistake
                </button>
              </div>
            </div>
          </div>

          {/* ┌───────────────────────────────────────────────────────────┐
              ROW 4  — Community Updates  |  My Learning Path
          └───────────────────────────────────────────────────────────┘ */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Community Updates */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3
                className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                <Users className="w-5 h-5 text-[#6BCB77]" />
                Community Updates
              </h3>

              {/* Post card */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF8C42)' }}
                  >
                    PS
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold text-sm">Priya Sharma</p>
                    <p className="text-slate-400 text-[11px]">Completed Game Dev Level 3!</p>
                  </div>
                  <span className="ml-auto text-xs text-slate-400">2h ago</span>
                </div>

                {/* Mini achievement banner */}
                <div
                  className="rounded-lg px-3 py-2 mb-3 flex items-center gap-2"
                  style={{ background: 'linear-gradient(90deg, #FF8C42 0%, #FFD93D 100%)' }}
                >
                  <Gamepad2 className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold">Built my first platformer game! 🎮</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[#4A90E2] bg-blue-50 hover:bg-blue-100 transition-colors text-xs font-bold"
                    onClick={() => {}}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Reply
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold ml-auto"
                    style={{
                      color: liked ? '#FF6B6B' : '#94a3b8',
                      background: liked ? 'rgba(255,107,107,0.1)' : '#f8fafc',
                    }}
                    onClick={handleLike}
                  >
                    <Heart
                      className="w-3.5 h-3.5"
                      style={{ fill: liked ? '#FF6B6B' : 'none', stroke: liked ? '#FF6B6B' : '#94a3b8' }}
                    />
                    {likeCount}
                  </button>
                </div>
              </div>

              {/* New badge unlocked */}
              <div className="mt-3 bg-gradient-to-r from-[#FFD93D]/10 to-[#FF8C42]/10 border border-[#FFD93D]/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-slate-800 font-bold text-sm">New Badge Unlocked!</p>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1 w-24">
                    <div
                      className="h-full rounded-full"
                      style={{ width: '60%', background: 'linear-gradient(90deg, #FFD93D, #FF8C42)' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* My Learning Path */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3
                className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-5"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                <Rocket className="w-5 h-5 text-[#FF8C42]" />
                My Learning Path
              </h3>

              {/* Tab row */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {learningTabs.map(({ label, icon: Icon, active, color, bg }) => (
                  <button
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-xl py-3 px-2 transition-all hover:-translate-y-0.5"
                    style={{
                      background: active ? bg : '#F8FAFC',
                      border: `1.5px solid ${active ? color + '40' : '#e2e8f0'}`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: active ? bg : '#F1F5F9' }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span
                      className="text-[11px] font-bold leading-tight text-center"
                      style={{ color: active ? color : '#64748b' }}
                    >
                      {active ? '✓ Active' : ''}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 leading-tight text-center">
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                  Quick Stats
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Flame, color: '#FF8C42', bg: 'rgba(255,140,66,0.1)', label: 'Current Streak', val: '12 Days' },
                    { icon: Medal, color: '#FFD93D', bg: 'rgba(255,217,61,0.1)', label: 'Badges Earned', val: '8 / 20' },
                    { icon: TrendingUp, color: '#6BCB77', bg: 'rgba(107,203,119,0.1)', label: 'Rank', val: '#15' },
                  ].map(({ icon: Icon, color, bg, label, val }) => (
                    <div
                      key={label}
                      className="rounded-xl p-3 flex flex-col items-center gap-1 text-center"
                      style={{ background: bg, border: `1px solid ${color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                      <p className="text-slate-800 font-bold text-base">{val}</p>
                      <p className="text-slate-500 text-[10px] font-semibold leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom padding */}
          <div className="h-4" />
        </div>
      </main>
    </div>
  )
}
