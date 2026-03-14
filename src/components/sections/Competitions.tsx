'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

const leaderboard = [
  { rank: 1, name: 'Alex K.', score: 2840, medal: '🥇', color: '#f59e0b' },
  { rank: 2, name: 'Mia T.',  score: 2650, medal: '🥈', color: '#94a3b8' },
  { rank: 3, name: 'Omar R.', score: 2490, medal: '🥉', color: '#b45309' },
]

export default function Competitions() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="competitions"
      ref={sectionRef}
      className="section-kinder relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f0f9ff 0%, #e8f4fd 50%, #f0f4ff 100%)' }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(30,64,175,0.06) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container-kinder relative z-10">

        {/* Heading */}
        <div className="text-center mb-14 reveal">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
            style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.15)' }}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" style={{ animation: 'comp-pulse 2s ease-in-out infinite' }} />
            Live &amp; Weekly Events
          </span>
          <h2 className="section-title">Exciting Coding Competitions</h2>
          <p className="text-gray-500 text-lg mt-3 max-w-xl mx-auto">
            Compete, earn badges, and become a top coder in our global community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal">

          {/* ── Card 1: Leaderboard ── */}
          <div
            className="group relative rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(160deg, #fffbeb, #fff9f0)',
              border: '1px solid rgba(245,158,11,0.2)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            {/* Shimmer on hover */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(253,230,138,0.35), transparent)' }}
              />
            </div>

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5"
              style={{ background: 'linear-gradient(135deg, #FFD93D 0%, #FF8C42 100%)', boxShadow: '0 8px 24px rgba(255,140,66,0.35)' }}
            >
              🏆
            </div>
            <h3 className="text-[1.1rem] font-extrabold text-gray-900 mb-1">Leaderboard</h3>
            <p className="text-gray-500 text-sm mb-5">Compete globally and climb the ranks</p>

            {/* Mini leaderboard */}
            <div className="space-y-3 mb-5">
              {leaderboard.map((l) => (
                <div key={l.rank} className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{l.medal}</span>
                  <span className="text-sm font-semibold text-gray-700 flex-1 truncate">{l.name}</span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: l.color + '22', color: l.color }}
                  >
                    {l.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="#"
              className="group/btn relative w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #FFD93D 0%, #FF8C42 100%)', boxShadow: '0 4px 16px rgba(255,140,66,0.3)' }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-600" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              <span className="relative z-10">View Rankings</span>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>

          {/* ── Card 2: Weekly Challenge ── */}
          <div
            className="group relative rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(160deg, #f0fdf4, #ecfdf5)',
              border: '1px solid rgba(34,197,94,0.2)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5"
              style={{ background: 'linear-gradient(135deg, #6BCB77 0%, #4D96FF 100%)', boxShadow: '0 8px 24px rgba(77,150,255,0.35)' }}
            >
              📅
            </div>
            <h3 className="text-[1.1rem] font-extrabold text-gray-900 mb-1">Weekly Challenge</h3>
            <p className="text-gray-500 text-sm mb-4">New coding puzzles every week with prizes</p>

            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-500">Entries this week</span>
                <span className="text-green-600 font-bold">847 / 1,000</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: '84.7%',
                    background: 'linear-gradient(90deg, #6BCB77, #4D96FF)',
                    animation: 'comp-grow 1.5s ease-out forwards',
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">⏰ Closes in 3 days</p>
            </div>

            <Link
              href="#"
              className="group/btn relative w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #6BCB77 0%, #4D96FF 100%)', boxShadow: '0 4px 16px rgba(77,150,255,0.3)' }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-600" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              <span className="relative z-10">Register Now</span>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>

          {/* ── Card 3: Live Tournament ── */}
          <div
            className="group relative rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(160deg, #fff5f5, #fff0f0)',
              border: '1px solid rgba(239,68,68,0.2)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            {/* Header row: icon + LIVE badge */}
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', boxShadow: '0 8px 24px rgba(255,107,107,0.35)' }}
              >
                ⚡
              </div>
              {/* Pulsing LIVE badge */}
              <span
                className="relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-white"
                style={{ background: '#ef4444' }}
              >
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-white" />
                <span className="relative">LIVE</span>
              </span>
            </div>

            <h3 className="text-[1.1rem] font-extrabold text-gray-900 mb-1">Live Tournament</h3>
            <p className="text-gray-500 text-sm mb-4">Real-time coding battles — happening now!</p>

            {/* Active participants */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex -space-x-1.5">
                {['#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77'].map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-600">124 competing now</span>
            </div>

            <Link
              href="#"
              className="group/btn relative w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', boxShadow: '0 4px 16px rgba(255,107,107,0.35)' }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-600" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              <span className="relative z-10">Join Now</span>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>

          {/* ── Card 4: School Contests ── */}
          <div
            className="group relative rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(160deg, #f5f3ff, #ede9fe)',
              border: '1px solid rgba(139,92,246,0.2)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5"
              style={{ background: 'linear-gradient(135deg, #9B59B6 0%, #3498DB 100%)', boxShadow: '0 8px 24px rgba(155,89,182,0.35)' }}
            >
              🏫
            </div>
            <h3 className="text-[1.1rem] font-extrabold text-gray-900 mb-1">School Contests</h3>
            <p className="text-gray-500 text-sm mb-4">Represent your school in coding championships</p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {[{ v: '500+', l: 'Schools' }, { v: '12K+', l: 'Students' }].map((s, i) => (
                <div key={i} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(139,92,246,0.08)' }}>
                  <div className="text-lg font-extrabold text-purple-700">{s.v}</div>
                  <div className="text-xs text-gray-500 font-medium">{s.l}</div>
                </div>
              ))}
            </div>

            <Link
              href="#"
              className="group/btn relative w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #9B59B6 0%, #3498DB 100%)', boxShadow: '0 4px 16px rgba(155,89,182,0.3)' }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-600" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              <span className="relative z-10">Sign Up School</span>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes comp-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        @keyframes comp-grow {
          from { width: 0%; }
          to { width: 84.7%; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  )
}
