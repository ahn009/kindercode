'use client'

import { Link } from '@/i18n/navigation'
import { useReveal } from '@/hooks/useReveal'

const schoolFeatures = [
  {
    id: 1,
    title: 'Turnkey Curriculum',
    bg: 'from-blue-100 to-sky-50',
    iconBg: '#dbeafe',
    placeholder: '📚',
    placeholderGrad: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)',
  },
  {
    id: 2,
    title: 'Teacher Dashboard',
    bg: 'from-emerald-100 to-teal-50',
    iconBg: '#d1fae5',
    placeholder: '🦉',
    placeholderGrad: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)',
  },
  {
    id: 3,
    title: 'Fun Competitions',
    bg: 'from-yellow-100 to-orange-50',
    iconBg: '#fef9c3',
    placeholder: '🏆',
    placeholderGrad: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
  },
  {
    id: 4,
    title: 'Certificates & Rewards',
    bg: 'from-purple-100 to-pink-50',
    iconBg: '#ede9fe',
    placeholder: '🎓',
    placeholderGrad: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
  },
]

export default function Schools() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="schools"
      ref={sectionRef}
      className="section-kinder relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
      }}
    >
      {/* Stars / sparkles */}
      {[
        { top: '8%', left: '5%', size: 8, delay: '0s' },
        { top: '15%', left: '18%', size: 6, delay: '0.4s' },
        { top: '6%', left: '70%', size: 10, delay: '0.8s' },
        { top: '20%', left: '85%', size: 7, delay: '0.2s' },
        { top: '40%', left: '3%', size: 5, delay: '1s' },
        { top: '55%', left: '92%', size: 9, delay: '0.6s' },
        { top: '30%', left: '50%', size: 5, delay: '1.2s' },
      ].map((star, i) => (
        <div
          key={i}
          className="absolute pointer-events-none animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
            animationDuration: '2.5s',
          }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 10 10" fill="none">
            <path d="M5 0L5.8 3.8L9 5L5.8 6.2L5 10L4.2 6.2L1 5L4.2 3.8L5 0Z" fill="rgba(255,255,255,0.8)" />
          </svg>
        </div>
      ))}

      {/* Top cloud layer */}
      <div className="absolute top-0 left-0 w-full pointer-events-none overflow-hidden" style={{ height: 120 }}>
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,40 C80,0 160,80 240,40 C320,0 400,70 480,40 C560,10 640,60 720,35 C800,10 880,65 960,40 C1040,15 1120,60 1200,35 C1280,10 1360,55 1440,30 L1440,0 L0,0 Z"
            fill="white"
            fillOpacity="0.85"
          />
          <path
            d="M0,70 C100,30 200,100 300,60 C400,20 500,90 600,55 C700,20 800,80 900,50 C1000,20 1100,75 1200,50 C1300,25 1380,70 1440,50 L1440,0 L0,0 Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      <div className="container-kinder relative z-10">

        {/* Heading */}
        <div className="text-center mb-12 reveal">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            For Schools
          </h2>
          <p className="text-lg text-slate-500 max-w-md mx-auto">
            Empower Your Students through Coding!
          </p>
        </div>

        {/* Feature Cards — 4 in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 reveal">
          {schoolFeatures.map((feature) => (
            <div
              key={feature.id}
              className="group relative rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(186,230,253,0.6)',
                boxShadow: '0 4px 24px rgba(14,116,144,0.08)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: '0 12px 40px rgba(14,116,144,0.15)' }}
              />

              {/* Illustration placeholder */}
              <div
                className="relative z-10 w-full aspect-square max-w-[160px] rounded-xl mb-4 flex items-center justify-center text-6xl"
                style={{
                  background: feature.placeholderGrad,
                  opacity: 0.85,
                }}
              >
                {feature.placeholder}
              </div>

              <h3 className="relative z-10 text-base font-semibold text-slate-700 leading-snug">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center reveal">
          <Link
            href="#"
            className="group inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-base text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
            }}
          >
            Get Your School Started
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <p className="text-sm text-slate-400 mt-4 font-medium">
            Join Over 1,000+ Schools Making Coding Fun
          </p>
        </div>
      </div>

      {/* Bottom cloud layer */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none overflow-hidden" style={{ height: 100 }}>
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,60 C120,20 240,90 360,55 C480,20 600,80 720,50 C840,20 960,75 1080,50 C1200,25 1320,70 1440,45 L1440,100 L0,100 Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M0,80 C100,50 200,100 300,70 C400,40 500,95 600,65 C700,35 800,85 900,60 C1000,35 1100,80 1200,60 C1300,40 1380,75 1440,58 L1440,100 L0,100 Z"
            fill="white"
            fillOpacity="0.55"
          />
        </svg>
      </div>
    </section>
  )
}
