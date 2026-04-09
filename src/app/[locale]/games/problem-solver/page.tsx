'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import {
  Brain,
  Star,
  Trophy,
  Bell,
  ChevronRight,
  ChevronDown,
  Play,
  Clock,
  Map,
  Target,
  BookOpen,
  Award,
  Zap,
  Code,
  Cpu,
  Rocket,
  Lightbulb,
  Puzzle,
  Gamepad2,
  CheckCircle2,
  Medal,
  Scroll,
  Crown,
  Settings,
  Home,
  User,
  LogOut,
  Shield,
} from 'lucide-react';

export default function KinderCodeProblemSolving() {
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  /* Close dropdowns on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a237e] to-[#0d1642] text-white font-sans overflow-x-hidden relative">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }, (_, i) => ({
          top: `${((i * 13.71 + 4.5) % 97).toFixed(2)}%`,
          left: `${((i * 17.93 + 9.1) % 99).toFixed(2)}%`,
          delay: `${((i * 0.37) % 3).toFixed(2)}s`,
          opacity: (0.2 + (i % 9) * 0.07).toFixed(2),
        })).map((s, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: s.top,
              left: s.left,
              animationDelay: s.delay,
              opacity: Number(s.opacity),
            }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute top-32 right-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-bounce" />
      <div className="absolute top-40 right-1/3 w-12 h-12 bg-cyan-400/20 rounded-full blur-lg animate-pulse" />

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-6 py-3 bg-gradient-to-r from-[#1e3a8a]/90 to-[#1e1b4b]/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Settings className="w-8 h-8 text-yellow-400 absolute -left-1 -top-1 animate-spin-slow" />
            <Brain className="w-8 h-8 text-pink-400 relative z-10" />
          </div>
          <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            KinderCode
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#2d1b4e] px-3 py-1.5 rounded-full border border-purple-500/30">
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
              L5
            </div>
            <span className="text-sm font-bold">Level 5</span>
          </div>

          <div className="flex items-center gap-2 bg-[#2d1b4e] px-4 py-1.5 rounded-full border border-purple-500/30">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <div className="flex flex-col min-w-[80px]">
              <span className="text-[10px] text-purple-200">Total Progress: <span className="text-green-400">40%</span></span>
              <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mt-0.5">
                <div className="w-[40%] h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
              </div>
            </div>
            <span className="font-bold text-yellow-400 ml-1">250</span>
          </div>

          {/* Bell with notification dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
              className="relative p-2 bg-[#2d1b4e] rounded-full border border-purple-500/30 hover:bg-purple-800/50 transition"
            >
              <Bell className="w-5 h-5 text-yellow-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-[#0a0e27]">
                8
              </span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 rounded-2xl shadow-2xl z-[100] overflow-hidden border border-purple-500/30"
                style={{ background: 'linear-gradient(145deg,#1e1b4b,#1e3a8a)' }}>
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <p className="font-extrabold text-white text-sm">Notifications</p>
                  <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">8 new</span>
                </div>
                {[
                  { icon: '🏆', msg: 'You earned Logic Star badge!', time: '2m ago' },
                  { icon: '🎯', msg: 'New challenge unlocked: Robot Rescue', time: '1h ago' },
                  { icon: '⭐', msg: 'Weekly contest starts in 2 hours', time: '1h ago' },
                  { icon: '🎓', msg: 'Complete 3 more lessons for certificate', time: '3h ago' },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors">
                    <span className="text-xl mt-0.5">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold leading-snug">{n.msg}</p>
                      <p className="text-purple-300 text-[10px] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2.5 text-center text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                  View all notifications →
                </button>
              </div>
            )}
          </div>

          {/* Profile avatar with dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-yellow-300 overflow-hidden shadow-lg group-hover:ring-2 group-hover:ring-yellow-400 transition-all">
                <div className="w-full h-full flex items-center justify-center text-xl select-none">👦</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 w-64 rounded-2xl shadow-2xl z-[100] overflow-hidden border border-purple-500/30"
                style={{ background: 'linear-gradient(145deg,#1e1b4b,#1e3a8a)' }}>

                {/* User info */}
                <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl flex-shrink-0 border-2 border-yellow-300">
                    👦
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-extrabold text-sm truncate">Alex Johnson</p>
                    <p className="text-purple-300 text-xs truncate">alex@kindercode.com</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-green-400 text-[10px] font-semibold">Level 5 Coder</span>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex divide-x divide-white/10 border-b border-white/10">
                  {[{ label: 'Stars', val: '250', icon: '⭐' }, { label: 'Progress', val: '40%', icon: '📈' }, { label: 'Badges', val: '4', icon: '🏅' }].map(s => (
                    <div key={s.label} className="flex-1 py-2.5 flex flex-col items-center">
                      <span className="text-base">{s.icon}</span>
                      <span className="text-white font-extrabold text-xs">{s.val}</span>
                      <span className="text-purple-300 text-[9px]">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Menu items */}
                <div className="py-2">
                  {[
                    { icon: Home, label: 'Home', path: '/home' },
                    { icon: User, label: 'My Profile', path: '/profile' },
                    { icon: Settings, label: 'Settings', path: '/settings' },
                    { icon: Shield, label: 'Privacy', path: '/privacy-policy' },
                  ].map(({ icon: Icon, label, path }) => (
                    <button
                      key={path}
                      onClick={() => { setProfileOpen(false); router.push(path) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/8 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <Icon className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-white/80 font-semibold text-sm group-hover:text-white transition-colors">{label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-white/30 ml-auto group-hover:text-white/60 transition-colors" />
                    </button>
                  ))}
                </div>

                {/* Sign out */}
                <div className="px-3 pb-3 pt-1 border-t border-white/10">
                  <button
                    onClick={() => { setProfileOpen(false); router.push('/login') }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-semibold text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sub Header */}
      <div className="relative z-40 flex justify-end px-6 py-2 gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full border border-blue-400/50 shadow-lg hover:scale-105 transition">
          <Scroll className="w-4 h-4 text-blue-100" />
          <span className="text-sm font-bold">Certificates</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full border border-yellow-400/50 shadow-lg hover:scale-105 transition">
          <Trophy className="w-4 h-4 text-yellow-100" />
          <span className="text-sm font-bold">Leaderboard</span>
        </button>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-4 space-y-8 pb-32">
        {/* Hero Section */}
        <div className="relative">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Settings className="w-10 h-10 text-yellow-400 absolute -left-2 -top-2 animate-spin-slow" />
                  <Brain className="w-10 h-10 text-pink-500 relative z-10" />
                </div>
                <div className="px-4 py-1.5 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-full border border-blue-400/50 shadow-lg shadow-blue-500/20">
                  <span className="text-sm font-bold text-blue-100">★ Complete Course ★</span>
                </div>
              </div>

              <h1 className="text-6xl font-black tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent drop-shadow-lg">
                  Problem Solving
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
                  Mastery
                </span>
              </h1>

              <p className="text-2xl text-blue-100 font-medium drop-shadow-md">
                Learn to Think, Code & Solve Real Problems!
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-2 h-2 bg-white rounded-sm" />
                      <div className="w-2 h-2 bg-yellow-300 rounded-sm" />
                      <div className="w-2 h-2 bg-green-400 rounded-sm" />
                      <div className="w-2 h-2 bg-blue-400 rounded-sm" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">25+</div>
                    <div className="text-xs text-blue-200 font-medium">Coding Challenges</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Story-Based</div>
                    <div className="text-xs text-blue-200 font-medium">Learning</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Medal className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Certificate</div>
                    <div className="text-xs text-blue-200 font-medium">Reward</div>
                  </div>
                </div>
              </div>

              <button className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400 rounded-2xl font-black text-xl shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-300 flex items-center gap-3 border-2 border-yellow-300/50">
                <span>Start Learning</span>
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>

            {/* Today's Challenge Panel */}
            <div className="w-full lg:w-[420px] relative">
              {/* Ribbon Header */}
              <div className="absolute -top-3 left-0 right-0 z-20">
                <div className="relative mx-4">
                  <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 py-3 px-6 rounded-lg shadow-xl border-b-4 border-red-800 flex items-center justify-center gap-3">
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    <span className="font-black text-xl tracking-wide">Today's Challenge</span>
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  </div>
                  {/* Ribbon tails */}
                  <div className="absolute -bottom-2 left-0 w-6 h-6 bg-red-800 transform rotate-45 -z-10" />
                  <div className="absolute -bottom-2 right-0 w-6 h-6 bg-red-800 transform rotate-45 -z-10" />
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] rounded-3xl border-2 border-blue-400/30 overflow-hidden shadow-2xl">
                <div className="pt-12 pb-6 px-6 space-y-4">
                  <div className="flex items-center gap-2 justify-center bg-blue-900/50 rounded-full py-2 px-4 border border-blue-400/20">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span className="font-black text-xl text-white">Robot Rescue</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>

                  <div className="bg-gradient-to-r from-green-900/40 to-green-800/40 rounded-xl p-3 border border-green-500/30 flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                    <span className="text-sm text-green-100 font-medium">If battery &gt; 50% → move forward</span>
                  </div>

                  <div className="bg-gradient-to-r from-orange-900/40 to-orange-800/40 rounded-xl p-3 border border-orange-500/30 flex items-center gap-3">
                    <span className="w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
                    <span className="text-sm text-orange-100 font-medium">Else → find charging station</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-300 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                      <span>Write Code:</span>
                    </div>
                    <div className="bg-[#0f172a] rounded-xl p-4 font-mono text-sm border border-slate-700 shadow-inner">
                      <div className="flex items-center">
                        <span className="text-pink-500 font-bold">if</span>
                        <span className="text-slate-300 ml-2">battery</span>
                        <span className="text-slate-400 mx-1">&gt;</span>
                        <span className="text-yellow-400 font-bold">50</span>
                        <span className="text-slate-400">:</span>
                      </div>
                      <div className="pl-6 text-cyan-400 flex items-center">
                        <span className="text-slate-500 mr-2">|</span>
                        move(<span className="text-green-400">&quot;forward&quot;</span>)
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-pink-500 font-bold">else</span>
                        <span className="text-slate-400">:</span>
                      </div>
                      <div className="pl-6 text-cyan-400 flex items-center">
                        <span className="text-slate-500 mr-2">|</span>
                        find(<span className="text-green-400">&quot;charger&quot;</span>)
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:from-orange-400 hover:to-red-400 transition shadow-lg shadow-orange-500/30 border-b-4 border-red-700 active:border-b-0 active:translate-y-1">
                    <span>Run</span>
                    <Play className="w-5 h-5 fill-white" />
                  </button>

                  <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-500/50 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-green-500/20">
                    <span className="text-green-400 font-bold text-lg">Output:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-300 font-bold">Mission Complete!</span>
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Skill Path */}
        <div className="relative mt-16">
          {/* Title Banner */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 px-8 py-3 rounded-full shadow-2xl border-2 border-yellow-400/50">
                <span className="font-black text-2xl tracking-wide text-white drop-shadow-lg">Course Skill Path</span>
              </div>
              {/* Decorative ribbon ends */}
              <div className="absolute top-1/2 -left-2 w-4 h-8 bg-indigo-800 -translate-y-1/2 rounded-l-full" />
              <div className="absolute top-1/2 -right-2 w-4 h-8 bg-indigo-800 -translate-y-1/2 rounded-r-full" />
            </div>
          </div>

          <div className="relative bg-gradient-to-b from-blue-600/20 to-indigo-900/20 backdrop-blur-md rounded-[2.5rem] border-2 border-white/10 p-8 pt-16 overflow-hidden shadow-2xl">
            {/* Background Clouds */}
            <div className="absolute top-10 left-20 opacity-30">
              <div className="w-24 h-10 bg-white rounded-full relative blur-sm">
                <div className="absolute -top-6 left-4 w-12 h-12 bg-white rounded-full" />
                <div className="absolute -top-8 left-8 w-14 h-14 bg-white rounded-full" />
              </div>
            </div>
            <div className="absolute top-20 right-32 opacity-20">
              <div className="w-20 h-8 bg-white rounded-full relative blur-sm">
                <div className="absolute -top-4 left-3 w-10 h-10 bg-white rounded-full" />
              </div>
            </div>

            {/* Grid Layout for Path */}
            <div className="relative z-10 grid grid-cols-12 gap-4 min-h-[400px]">
              
              {/* Module 1 - Left Top */}
              <div className="col-span-4 row-span-1">
                <div className="bg-gradient-to-br from-blue-500/90 to-blue-700/90 backdrop-blur-md rounded-3xl p-5 border-2 border-blue-300/50 shadow-xl hover:scale-105 transition-all cursor-pointer relative group">
                  <div className="absolute -top-3 -left-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border-2 border-white z-10">
                    1
                  </div>
                  <div className="mt-2">
                    <h3 className="font-black text-lg text-white mb-1">Logic Foundations</h3>
                    <p className="text-xs text-blue-200 mb-3">If-Else, Rules, Thinking</p>
                    <div className="flex items-center gap-1 bg-blue-900/50 rounded-full px-3 py-1.5 w-fit border border-blue-400/30">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">0/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Character - Boy */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl border-4 border-white/30 relative overflow-hidden">
                    <span className="text-4xl">👦</span>
                    <div className="absolute bottom-1 right-1 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-xs">💻</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module 2 - Top Right */}
              <div className="col-span-4 col-start-9">
                <div className="bg-gradient-to-br from-pink-500/90 to-rose-600/90 backdrop-blur-md rounded-3xl p-5 border-2 border-pink-300/50 shadow-xl hover:scale-105 transition-all cursor-pointer relative">
                  <div className="absolute -top-3 -left-2 w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border-2 border-white z-10">
                    2
                  </div>
                  <div className="mt-2">
                    <h3 className="font-black text-lg text-white mb-1">Loops & Patterns</h3>
                    <p className="text-xs text-pink-200 mb-3">Repeat, Patterns, Sequences</p>
                    <div className="flex items-center gap-1 bg-pink-900/50 rounded-full px-3 py-1.5 w-fit border border-pink-400/30">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">0/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module 3 - Bottom Left */}
              <div className="col-span-4 row-start-2 mt-8">
                <div className="bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-md rounded-3xl p-5 border-2 border-green-300/50 shadow-xl hover:scale-105 transition-all cursor-pointer relative">
                  <div className="absolute -top-3 -left-2 w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border-2 border-white z-10">
                    3
                  </div>
                  <div className="mt-2">
                    <h3 className="font-black text-lg text-white mb-1">Smart Decisions</h3>
                    <p className="text-xs text-green-200 mb-3">Conditionals & Logic</p>
                    <div className="flex items-center gap-1 bg-green-900/50 rounded-full px-3 py-1.5 w-fit border border-green-400/30">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">0/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Robot Character - Center */}
              <div className="col-span-2 row-start-2 flex items-center justify-center mt-8">
                <div className="relative">
                  <div className="w-28 h-28 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/40 animate-bounce">
                    <Cpu className="w-14 h-14 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Module 4 - Bottom Middle */}
              <div className="col-span-3 row-start-2 mt-8 col-start-6">
                <div className="bg-gradient-to-br from-purple-500/90 to-violet-600/90 backdrop-blur-md rounded-3xl p-5 border-2 border-purple-300/50 shadow-xl hover:scale-105 transition-all cursor-pointer relative">
                  <div className="absolute -top-3 -left-2 w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border-2 border-white z-10">
                    4
                  </div>
                  <div className="mt-2">
                    <h3 className="font-black text-lg text-white mb-1">Functions</h3>
                    <p className="text-xs text-purple-200 mb-3">Reuse & Build</p>
                    <div className="flex items-center gap-1 bg-purple-900/50 rounded-full px-3 py-1.5 w-fit border border-purple-400/30">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">0/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Girl Character */}
              <div className="col-span-2 row-start-2 flex items-center justify-center mt-8 col-start-9">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl -rotate-12 flex items-center justify-center shadow-2xl border-4 border-white/30">
                  <span className="text-4xl">👧</span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <Trophy className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
              </div>

              {/* Module 6 - Right */}
              <div className="col-span-4 row-start-2 mt-8 col-start-10">
                <div className="bg-gradient-to-br from-orange-500/90 to-amber-600/90 backdrop-blur-md rounded-3xl p-5 border-2 border-orange-300/50 shadow-xl hover:scale-105 transition-all cursor-pointer relative">
                  <div className="absolute -top-3 -left-2 w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border-2 border-white z-10">
                    6
                  </div>
                  <div className="mt-2">
                    <h3 className="font-black text-lg text-white mb-1">Problem Projects</h3>
                    <p className="text-xs text-orange-200 mb-3">Build Real Solutions</p>
                    <div className="flex items-center gap-1 bg-orange-900/50 rounded-full px-3 py-1.5 w-fit border border-orange-400/30">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">0/5</span>
                    </div>
                  </div>
                  <Rocket className="absolute bottom-3 right-3 w-6 h-6 text-orange-200 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Connecting Paths (Decorative Lines) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{zIndex: 5}}>
              <path d="M 200 80 Q 300 80 350 120" stroke="white" strokeWidth="3" strokeDasharray="5,5" fill="none" />
              <path d="M 350 200 Q 400 220 450 200" stroke="white" strokeWidth="3" strokeDasharray="5,5" fill="none" />
              <path d="M 150 250 Q 200 280 250 250" stroke="white" strokeWidth="3" strokeDasharray="5,5" fill="none" />
            </svg>
          </div>
        </div>

        {/* Bottom Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* What You'll Learn */}
          <div className="bg-gradient-to-br from-blue-800/80 to-indigo-900/80 backdrop-blur-md rounded-3xl p-6 border-2 border-blue-400/30 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-black text-xl">What You&apos;ll Learn:</h3>
              <Star className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex flex-wrap gap-3">
              {['Critical Thinking', 'Block & Text Coding', 'Logic & Creativity', 'Problem Solving'].map((skill) => (
                <span key={skill} className="px-4 py-2 bg-blue-900/50 rounded-full text-sm font-bold border border-blue-400/30 hover:bg-blue-800/50 transition cursor-default shadow-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Rewards & Badges */}
          <div className="bg-gradient-to-br from-purple-800/80 to-pink-900/80 backdrop-blur-md rounded-3xl p-6 border-2 border-purple-400/30 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-black text-xl">Rewards & Badges:</h3>
            </div>
            <div className="flex gap-4 justify-between">
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-3 border-yellow-300 shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition relative">
                  <Star className="w-7 h-7 text-white fill-white" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white">★</div>
                </div>
                <span className="text-xs font-bold text-center text-yellow-100">Logic Star</span>
              </div>
              
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center border-3 border-green-300 shadow-lg shadow-green-500/30 group-hover:scale-110 transition relative">
                  <Zap className="w-7 h-7 text-white fill-white" />
                  <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-center text-green-100">Loop Hero</span>
              </div>

              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center border-3 border-blue-300 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition relative">
                  <Puzzle className="w-7 h-7 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
                </div>
                <span className="text-xs font-bold text-center text-blue-100">Problem Solver</span>
              </div>

              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center border-3 border-purple-300 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-center text-purple-100">Coder Master</span>
              </div>

              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center border-3 border-red-400 shadow-lg shadow-red-500/30 group-hover:scale-110 transition transform rotate-12 relative">
                  <span className="font-black text-sm text-white tracking-wider">PRO</span>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center transform -rotate-12">
                    <Crown className="w-3 h-3 text-yellow-800" />
                  </div>
                </div>
                <span className="text-xs font-bold text-center text-red-100">Pro</span>
              </div>
            </div>
          </div>

          {/* Join Live Challenge */}
          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-6 border-2 border-orange-400/50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <h3 className="font-black text-xl text-yellow-100">Join Live Challenge</h3>
              </div>
              <p className="text-orange-100 text-sm font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-300" />
                Weekly Contest: &quot;Code to Win!&quot;
              </p>
              
              <div className="flex items-center gap-3 mb-5 bg-black/20 rounded-2xl p-3 border border-white/10">
                <Clock className="w-6 h-6 text-yellow-300 animate-pulse" />
                <div className="flex gap-1 font-mono text-2xl font-black text-yellow-300 tracking-wider">
                  <span className="bg-black/30 rounded-lg px-2 py-1">02</span>
                  <span className="text-yellow-500">:</span>
                  <span className="bg-black/30 rounded-lg px-2 py-1">13</span>
                  <span className="text-yellow-500">:</span>
                  <span className="bg-black/30 rounded-lg px-2 py-1">45</span>
                </div>
              </div>

              <button className="w-full py-4 bg-white text-orange-600 rounded-2xl font-black text-lg hover:bg-orange-50 transition shadow-xl border-b-4 border-orange-200 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 group">
                <span>Join Now</span>
                <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0e27] via-[#1a237e] to-[#1a237e]/95 backdrop-blur-lg border-t border-white/10 px-6 py-4 z-50 shadow-2xl">
        <div className="container mx-auto flex items-center justify-between max-w-5xl relative">
          <button className="flex flex-col items-center gap-1 text-blue-400 hover:text-blue-300 transition group relative">
            <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:bg-blue-500/30 transition border border-blue-400/30 shadow-lg shadow-blue-500/20">
              <Map className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold">Skill Map</span>
            <div className="absolute -bottom-4 w-1 h-1 bg-blue-400 rounded-full" />
          </button>

          <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition border border-white/10">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold">Challenges</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition border border-white/10">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold">Practice Zone</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition border border-white/10">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold">Projects</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition border border-white/10">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold">Certificate</span>
          </button>
        </div>

        {/* AI Tutor Floating Button */}
        <button className="absolute -top-8 right-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center gap-3 shadow-2xl shadow-blue-500/40 hover:scale-105 transition border-2 border-white/30 group">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
            <Brain className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-black text-lg">Ai Tutor</span>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white animate-bounce">
            1
          </div>
        </button>
      </nav>
    </div>
  );
}