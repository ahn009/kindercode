'use client'

import React, { useState } from 'react'
import { 
  Brain, 
  Star, 
  Trophy, 
  ChevronLeft,
  Lock,
  Play,
  Map,
  Target,
  Gamepad2,
  User,
  Cpu,
  BarChart3,
  ChevronRight,
  Sparkles
} from 'lucide-react'

export default function AIThinkingSkillsPage() {
  const [selectedLevel, setSelectedLevel] = useState(4)

  const levels = [
    { id: 1, unlocked: true },
    { id: 2, unlocked: true },
    { id: 3, unlocked: true },
    { id: 4, unlocked: true, active: true },
    { id: 5, unlocked: false },
    { id: 6, unlocked: false },
    { id: 7, unlocked: false },
    { id: 8, unlocked: false },
    { id: 9, unlocked: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a237e] via-[#283593] to-[#1a237e] text-white font-sans overflow-x-hidden relative">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>

      {/* Clouds Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-12 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-40 right-20 w-40 h-16 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-40 left-1/4 w-48 h-20 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1e3a8a]/90 to-[#1e1b4b]/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
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
            <span className="font-bold text-yellow-400 ml-1">350</span>
          </div>

          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-yellow-300 overflow-hidden shadow-lg flex items-center justify-center text-xl">
            👦
          </div>
        </div>
      </header>

      {/* Back Button & Title */}
      <div className="relative z-40 px-6 py-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/50 hover:bg-blue-600/70 rounded-full border border-blue-400/30 transition w-fit backdrop-blur-sm">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-bold">Back</span>
        </button>

        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center border-2 border-blue-400/50">
              <Brain className="w-7 h-7 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
              AI Thinking Skills
            </h1>
          </div>
          <p className="text-blue-200 text-lg">Learn How Artificial Intelligence Thinks and Makes Decisions!</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="relative z-10 container mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* Left Column - Locked Cards */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-md rounded-3xl p-4 border border-white/10 opacity-80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-300">Machine Learning Basics</h3>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="relative h-32 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 opacity-50">
                    <div className="w-full h-full border-4 border-slate-400 rounded-lg relative">
                      <div className="absolute top-2 left-2 w-4 h-4 bg-slate-400 rounded" />
                      <div className="absolute top-2 right-2 w-4 h-4 bg-slate-400 rounded" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-yellow-500/90 rounded-xl flex items-center justify-center border-2 border-yellow-300 shadow-lg">
                    <Lock className="w-6 h-6 text-yellow-900" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Unlock at Level 15</span>
                <div className="flex gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <Lock className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-md rounded-3xl p-4 border border-white/10 opacity-80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-300">Machine Learning Basics</h3>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <div className="relative h-32 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-20 bg-slate-400 rounded-full relative">
                    <div className="absolute top-4 left-2 w-4 h-4 bg-slate-300 rounded-full" />
                    <div className="absolute top-4 right-2 w-4 h-4 bg-slate-300 rounded-full" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-yellow-500/90 rounded-xl flex items-center justify-center border-2 border-yellow-300 shadow-lg">
                    <Lock className="w-6 h-6 text-yellow-900" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Unlock at Level 15</span>
                <div className="flex gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Main Card */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] rounded-3xl border-2 border-blue-400/50 overflow-hidden shadow-2xl relative">
              {/* Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />
              
              <div className="p-6 relative">
                {/* Title Section */}
                <div className="text-center mb-4">
                  <h2 className="text-3xl font-black text-white mb-2">AI Thinking Skills</h2>
                  <p className="text-blue-200 text-sm">Learn How Artificial Intelligence Thinks and Makes Decisions!</p>
                </div>

                {/* Brain Illustration */}
                <div className="relative h-48 mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent rounded-2xl" />
                  <div className="relative w-40 h-40">
                    {/* Brain Circuit Illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-32 h-32 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                    </div>
                    {/* Circuit Lines */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-lg" />
                  </div>
                  {/* Robot Character */}
                  <div className="absolute bottom-0 left-4 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg transform -rotate-6">
                    <span className="text-3xl">🤖</span>
                  </div>
                </div>

                {/* AI Thinking Skills Label */}
                <div className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 rounded-xl p-3 mb-4 border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-black text-xl text-white">AI Thinking Skills</span>
                </div>

                {/* Difficulty & Focus */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-blue-200">Difficulty:</span>
                    <span className="text-yellow-400 font-bold">Intermediate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-blue-200">Focus: Logic + Decision Making</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-blue-200">Progress:</span>
                    <span className="text-orange-400 font-bold">40%</span>
                    <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden ml-2">
                      <div className="w-[40%] h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full" />
                    </div>
                    <div className="flex items-center gap-1 bg-blue-900/50 px-2 py-1 rounded-full border border-blue-400/30">
                      <span className="text-yellow-400 text-xs">🧠</span>
                      <span className="text-xs font-bold">6 / 15</span>
                    </div>
                  </div>
                </div>

                {/* Levels Unlocked */}
                <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold">6</span>
                      </div>
                      <span className="text-sm font-bold text-white">6 / 15 Levels Unlocked</span>
                    </div>
                    <div className="flex gap-1">
                      {[1,2].map((star) => (
                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                      {[3,4,5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-slate-600" />
                      ))}
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-400" />
                  </div>
                </div>

                {/* Start Learning Button */}
                <button className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl font-black text-xl flex items-center justify-center gap-2 hover:from-green-500 hover:to-green-400 transition shadow-lg shadow-green-500/30 border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
                  <ChevronRight className="w-6 h-6 rotate-180" />
                  <ChevronRight className="w-6 h-6 -ml-3" />
                  <span>Start Learning</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Locked Cards */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-md rounded-3xl p-4 border border-white/10 opacity-80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-300">Smart Bots</h3>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <div className="relative h-32 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <div className="w-16 h-20 bg-slate-400 rounded-full relative">
                    <div className="absolute top-4 left-2 w-3 h-3 bg-slate-300 rounded-full" />
                    <div className="absolute top-4 right-2 w-3 h-3 bg-slate-300 rounded-full" />
                  </div>
                  <div className="w-12 h-12 bg-slate-400 rounded-full relative">
                    <div className="absolute top-3 left-2 w-2 h-2 bg-slate-300 rounded-full" />
                    <div className="absolute top-3 right-2 w-2 h-2 bg-slate-300 rounded-full" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-yellow-500/90 rounded-xl flex items-center justify-center border-2 border-yellow-300 shadow-lg">
                    <Lock className="w-6 h-6 text-yellow-900" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Unlock at Level 15</span>
                <div className="flex gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-md rounded-3xl p-4 border border-white/10 opacity-80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-300">Data Explorer</h3>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <div className="relative h-32 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-slate-400 rounded-full relative">
                    <div className="absolute top-5 left-3 w-4 h-4 bg-slate-300 rounded-full" />
                    <div className="absolute top-5 right-3 w-4 h-4 bg-slate-300 rounded-full" />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-300 rounded-full" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-yellow-500/90 rounded-xl flex items-center justify-center border-2 border-yellow-300 shadow-lg">
                    <Lock className="w-6 h-6 text-yellow-900" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Unlock at Level 15</span>
                <div className="flex gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Robot Helper & Speech Bubble */}
        <div className="mt-8 flex items-end justify-center gap-4 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center border-4 border-white/30 shadow-2xl transform -rotate-6 relative z-10">
            <span className="text-5xl">🤖</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-3 h-3 text-cyan-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 max-w-md shadow-xl relative border-4 border-blue-300/50">
            <div className="absolute -left-3 bottom-8 w-6 h-6 bg-white transform rotate-45 border-l-4 border-b-4 border-blue-300/50" />
            <p className="text-slate-800 font-bold text-lg mb-1">Use code to help the hero reach the flag!</p>
            <p className="text-slate-600 font-medium">Try moveForward() and jump()!</p>
          </div>
        </div>

        {/* Level Selector */}
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
          <div className="bg-blue-900/50 rounded-full px-4 py-2 border border-blue-400/30 flex items-center gap-2">
            <span className="text-xs font-bold text-blue-200">Level:</span>
          </div>
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => level.unlocked && setSelectedLevel(level.id)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                level.id === selectedLevel
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-2 border-yellow-300 shadow-lg scale-110'
                  : level.unlocked
                  ? 'bg-blue-600/50 text-white border border-blue-400/30 hover:bg-blue-600/70'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600/30 cursor-not-allowed'
              }`}
            >
              {level.unlocked ? level.id : <Lock className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0e27] via-[#1a237e] to-[#1a237e]/95 backdrop-blur-lg border-t border-white/10 px-6 py-4 z-50 shadow-2xl">
        <div className="container mx-auto flex items-center justify-around max-w-4xl">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300">
            <Map className="w-5 h-5" />
            <span className="text-sm font-bold">Skill Map</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-white/60 hover:bg-white/5 transition">
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-bold">Challenges</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-white/60 hover:bg-white/5 transition">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm font-bold">Practice Zone</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-white/60 hover:bg-white/5 transition">
            <User className="w-5 h-5" />
            <span className="text-sm font-bold">Profile</span>
          </button>
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="h-24" />
    </div>
  )
}

// Missing import for Settings
import { Settings } from 'lucide-react'