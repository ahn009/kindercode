'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const STARS = [
  { top: '10%', left: '4%',  size: 18, opacity: 0.9, delay: '0s' },
  { top: '58%', left: '2%',  size: 12, opacity: 0.6, delay: '0.4s' },
  { top: '20%', left: '44%', size: 14, opacity: 0.7, delay: '0.8s' },
  { top: '6%',  left: '66%', size: 20, opacity: 0.85, delay: '1.2s' },
  { top: '44%', left: '54%', size: 10, opacity: 0.55, delay: '0.3s' },
  { top: '16%', left: '84%', size: 13, opacity: 0.7, delay: '0.7s' },
  { top: '70%', left: '72%', size: 11, opacity: 0.5, delay: '1.1s' },
]

function Sparkle({ size, opacity, delay }: { size: number; opacity: number; delay: string }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      style={{ opacity, animation: `hero-sparkle 3s ease-in-out ${delay} infinite` }}
      aria-hidden="true"
    >
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" fill="#FFD93D" />
    </svg>
  )
}

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/asset-0.png), linear-gradient(160deg, #1048c8 0%, #1565d8 35%, #1b7fe8 70%, #2196f3 100%)',
        backgroundSize: 'cover, cover',
        backgroundPosition: '85% center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        minHeight: 'clamp(480px, 56vw, 660px)',
      }}
    >
      {/* Noise texture for premium depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      {/* Animated sparkles */}
      {STARS.map((s, i) => (
        <span key={i} className="absolute pointer-events-none select-none z-10" style={{ top: s.top, left: s.left }}>
          <Sparkle size={s.size} opacity={s.opacity} delay={s.delay} />
        </span>
      ))}

      {/* Wave layers at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10" aria-hidden="true">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0,80 C80,40 160,100 240,70 C320,40 400,90 480,65 C560,40 640,85 720,60 C800,35 880,80 960,55 C1040,30 1120,75 1200,55 C1280,35 1360,70 1440,50 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.12)" />
        </svg>
        <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" className="w-full absolute bottom-0" preserveAspectRatio="none">
          <path d="M0,60 C100,20 200,70 320,45 C440,20 520,65 640,40 C760,15 860,60 980,38 C1100,16 1220,55 1340,35 L1440,30 L1440,90 L0,90 Z" fill="rgba(255,255,255,0.22)" />
        </svg>
        <div className="h-3 bg-white/30" />
      </div>

      {/* Content */}
      <div
        className="relative z-20 max-w-[1280px] mx-auto px-6 md:px-10 xl:px-16"
        style={{ minHeight: 'clamp(480px, 56vw, 660px)', display: 'flex', alignItems: 'center' }}
      >
        <div className="max-w-xl py-16 md:py-20 lg:py-24">

          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-bold"
            style={{
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.28)',
              color: '#FFD93D',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#FFD93D]" style={{ animation: 'hero-dot-pulse 2s ease-in-out infinite' }} />
            {t('badge')}
          </div>

          {/* Headline */}
          <h1
            className="font-fredoka font-bold leading-[1.1] mb-5"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)', color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
          >
            {t('headline')}{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FFD93D 0%, #FF8C42 50%, #FF6B6B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {t('headlineHighlight')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-semibold leading-relaxed mb-8" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: 'rgba(255,255,255,0.82)' }}>
            {t('subtitle')}{' '}
            <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, fontSize: '0.9em' }}>{t('subtitleAge')}</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            {/* Primary — orange gradient + shine */}
            <Link
              href="/signup/"
              className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-extrabold text-[1.05rem] text-white overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #FF8C42 0%, #FFD93D 100%)',
                boxShadow: '0 6px 28px rgba(255,140,66,0.55), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
              />
              <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10">{t('getStartedFree')}</span>
            </Link>

            {/* Secondary — glassmorphism */}
            <Link
              href="#"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-extrabold text-[1.05rem] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255,255,255,0.3)',
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              {t('watchDemo')}
            </Link>
          </div>

          {/* Social proof row */}
          <div className="flex flex-wrap items-center gap-6">
            {[
              { value: '10K+', label: t('learnersLabel') },
              { value: '500+', label: t('schoolsLabel') },
              { value: '4.9★', label: t('ratingLabel') },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-xl font-extrabold text-white leading-tight">{stat.value}</div>
                <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
              </div>
            ))}
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {['#FF6B6B', '#4A90E2', '#6BCB77', '#FFD93D'].map((color, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center text-xs font-extrabold text-white" style={{ background: color }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center text-xs font-bold text-white" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  +
                </div>
              </div>
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('joinToday')}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-sparkle {
          0%, 100% { opacity: 0.35; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.25) rotate(18deg); }
        }
        @keyframes hero-dot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  )
}
