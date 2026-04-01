'use client'

import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'

/* ── All skill path data — no hardcoded values in JSX ── */
const SKILL_PATHS = [
  {
    id: 'problem-solver',
    image: '/images/problem-solving.png',
    cardStyle: { background: 'linear-gradient(145deg, #1a1a5e 0%, #2d2d8f 100%)' },
    btnStyle: { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    glowColor: 'rgba(79, 172, 254, 0.55)',
    gamePath: '/games/problem-solver',
  },
  {
    id: 'game-builder',
    image: '/images/game-logic.png',
    cardStyle: { background: 'linear-gradient(145deg, #1a0a2e 0%, #44107a 100%)' },
    btnStyle: { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    glowColor: 'rgba(245, 87, 108, 0.55)',
    gamePath: '/games/game-builder',
  },
  {
    id: 'ai-explorer',
    image: '/images/ai-thinking.png',
    cardStyle: { background: 'linear-gradient(145deg, #0d1b2a 0%, #1b3a6b 100%)' },
    btnStyle: { background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)' },
    glowColor: 'rgba(167, 139, 250, 0.55)',
    gamePath: '/games/ai-explorer',
  },
  {
    id: 'web-creator',
    image: '/images/web-thinking.png',
    cardStyle: { background: 'linear-gradient(145deg, #052e16 0%, #064e3b 100%)' },
    btnStyle: { background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    glowColor: 'rgba(17, 153, 142, 0.55)',
    gamePath: '/games/web-creator',
  },
  {
    id: 'robot-thinker',
    image: '/images/robotics-logic.png',
    cardStyle: { background: 'linear-gradient(145deg, #1a0a0a 0%, #7f1d1d 100%)' },
    btnStyle: { background: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)' },
    glowColor: 'rgba(249, 83, 198, 0.55)',
    gamePath: '/games/robot-thinker',
  },
] as const

type SkillPath = (typeof SKILL_PATHS)[number]

/* ── Single card component ── */
function SkillCard({ path, onStart }: { path: SkillPath; onStart: () => void }) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      style={{
        ...path.cardStyle,
        boxShadow: `0 12px 40px ${path.glowColor}`,
        transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease',
      }}
      onClick={onStart}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'scale(1.06) translateY(-6px)'
        el.style.boxShadow = `0 24px 64px ${path.glowColor}`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'scale(1) translateY(0)'
        el.style.boxShadow = `0 12px 40px ${path.glowColor}`
      }}
    >
      {/* Image fills the card */}
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={path.image}
          alt={path.id}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
        />
        {/* subtle shimmer overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Button */}
      <div className="px-5 pb-5 pt-1">
        <button
          className="w-full py-3 rounded-2xl font-extrabold text-white text-base tracking-wide transition-all duration-200 hover:brightness-110 active:scale-95 select-none"
          style={{
            ...path.btnStyle,
            boxShadow: `0 4px 18px ${path.glowColor}`,
          }}
          onClick={(e) => {
            e.stopPropagation()
            onStart()
          }}
        >
          ▶ &nbsp;Start Path
        </button>
      </div>
    </div>
  )
}

/* ── Page ── */
export default function ChooseSkillPathPage() {
  const router = useRouter()

  function handleStartPath(path: SkillPath) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kindercode_selected_path', path.id)
    }
    router.push(path.gamePath as string)
  }

  return (
    <div
      className="min-h-screen flex flex-col py-12 px-4"
      style={{
        background:
          'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}
    >
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/5 w-72 h-72 rounded-full blur-3xl opacity-20 animate-float"
          style={{
            background: 'radial-gradient(circle, #f472b6, transparent)',
            animationDelay: '1.8s',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Step pill + Title */}
        <div className="text-center mb-12 animate-slide-up-3d">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-white/70 text-sm font-semibold mb-5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Step 2 of 3 — Choose Your Path
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            Choose Your{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, #a78bfa 0%, #f472b6 60%, #fb923c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Skill Path
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-sm mx-auto">
            Pick your adventure. You can always explore others later!
          </p>
        </div>

        {/* Cards — Row 1: 3, Row 2: 2 centred */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {SKILL_PATHS.slice(0, 3).map((path) => (
            <SkillCard
              key={path.id}
              path={path}
              onStart={() => handleStartPath(path)}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {SKILL_PATHS.slice(3).map((path) => (
            <SkillCard
              key={path.id}
              path={path}
              onStart={() => handleStartPath(path)}
            />
          ))}
        </div>

        {/* ── Go to Dashboard ── */}
        <div className="flex justify-center mt-14">
          <button
            onClick={() => router.push('/home')}
            className="px-14 py-4 rounded-2xl text-white text-xl font-extrabold transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-3d"
            style={{
              background:
                'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
              boxShadow: '0 12px 48px rgba(99,102,241,0.55)',
            }}
          >
            🚀 &nbsp;Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
