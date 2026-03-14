'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    role: 'Parent',
    badge: 'Verified Parent',
    badgeColor: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    quote:
      'KinderCode made learning fun and easy for my son! He went from playing games to creating them in just 3 months.',
    metric: '3 months progress',
    metricIcon: '🚀',
    gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  },
  {
    id: 2,
    name: 'Mr. Thompson',
    role: 'Teacher, Oakwood Elementary',
    badge: 'Verified Teacher',
    badgeColor: '#10b981',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    quote:
      "Our students love the coding competitions. It's amazing to see their creativity and problem-solving skills grow!",
    metric: 'Top 5% student',
    metricIcon: '🏆',
    gradient: 'linear-gradient(135deg, #10b981, #3b82f6)',
  },
  {
    id: 3,
    name: 'Emily R.',
    role: 'Parent of 2',
    badge: 'Verified Parent',
    badgeColor: '#a855f7',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    quote:
      'The curriculum is perfectly structured. My daughter looks forward to her coding time every single day.',
    metric: '6 months streak',
    metricIcon: '⚡',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
  },
]

const TRUST_STATS = [
  { value: '10,000+', label: 'Families', icon: '👨‍👩‍👧' },
  { value: '500+', label: 'Schools', icon: '🏫' },
  { value: '4.9 ★', label: 'Rating', icon: '⭐' },
  { value: '50+', label: 'Countries', icon: '🌍' },
]

// Static star positions
const STARS = [
  { top: '6%', left: '4%', s: 2 }, { top: '14%', left: '14%', s: 1.5 },
  { top: '4%', left: '28%', s: 2.5 }, { top: '20%', left: '42%', s: 1 },
  { top: '9%', left: '58%', s: 2 }, { top: '16%', left: '72%', s: 1.5 },
  { top: '5%', left: '85%', s: 2.5 }, { top: '22%', left: '93%', s: 1 },
  { top: '30%', left: '6%', s: 1.5 }, { top: '35%', left: '96%', s: 2 },
  { top: '3%', left: '50%', s: 1 }, { top: '26%', left: '66%', s: 1.5 },
]

interface CardProps {
  testimonial: (typeof testimonials)[0]
  state: 'active' | 'side'
  onClick?: () => void
  index: number
}

function TestimonialCard({ testimonial, state, onClick, index }: CardProps) {
  const isActive = state === 'active'

  return (
    <div
      role={state === 'side' ? 'button' : undefined}
      tabIndex={state === 'side' ? 0 : undefined}
      aria-label={state === 'side' ? `View testimonial from ${testimonial.name}` : undefined}
      onClick={onClick}
      onKeyDown={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick()
      }}
      className="relative flex flex-col rounded-3xl transition-all duration-500 select-none"
      style={{
        background: isActive
          ? 'rgba(255,255,255,0.09)'
          : 'rgba(255,255,255,0.04)',
        backdropFilter: isActive ? 'blur(24px)' : 'blur(12px)',
        WebkitBackdropFilter: isActive ? 'blur(24px)' : 'blur(12px)',
        border: isActive
          ? '1px solid rgba(255,255,255,0.18)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isActive
          ? '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 8px 32px rgba(0,0,0,0.3)',
        transform: isActive ? 'scale(1)' : 'scale(0.92)',
        opacity: isActive ? 1 : 0.55,
        cursor: state === 'side' ? 'pointer' : 'default',
        padding: isActive ? '2rem' : '1.5rem',
        willChange: 'transform, opacity',
      }}
    >
      {/* Top gradient accent */}
      <div
        className="absolute top-0 left-8 right-8 h-px rounded-full"
        style={{ background: testimonial.gradient, opacity: isActive ? 1 : 0.4 }}
      />

      {/* Decorative quote mark */}
      <div
        className="absolute top-4 right-6 font-serif leading-none pointer-events-none"
        style={{
          fontSize: isActive ? '120px' : '80px',
          lineHeight: 1,
          backgroundImage: testimonial.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity: 0.12,
          userSelect: 'none',
        }}
      >
        &ldquo;
      </div>

      {/* Header: avatar + badge */}
      <div className="flex items-start justify-between mb-5">
        <div>
          {/* Verified badge */}
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
            style={{ background: testimonial.badgeColor + '33', color: testimonial.badgeColor, border: `1px solid ${testimonial.badgeColor}55` }}
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 0L7.5 4.5H12L8.25 7.25L9.75 12L6 9L2.25 12L3.75 7.25L0 4.5H4.5L6 0Z" />
            </svg>
            {testimonial.badge}
          </span>

          {/* Metric chip */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white/70"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span>{testimonial.metricIcon}</span>
            <span>{testimonial.metric}</span>
          </div>
        </div>

        {/* Avatar with gradient ring */}
        <div className="relative flex-shrink-0">
          <div
            className="p-[2px] rounded-full transition-all duration-300"
            style={{
              background: testimonial.gradient,
              boxShadow: isActive ? `0 0 20px ${testimonial.badgeColor}55` : 'none',
            }}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-900">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={56}
                height={56}
                className="object-cover w-full h-full"
                priority={index === 0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <p
        className="italic leading-relaxed text-white/80 mb-6 flex-1"
        style={{ fontSize: isActive ? '1.05rem' : '0.9rem' }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div>
        <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="flex items-center justify-between">
          <div>
            <p
              className="font-bold text-white"
              style={{
                fontSize: isActive ? '1rem' : '0.875rem',
                backgroundImage: isActive ? testimonial.gradient : undefined,
                WebkitBackgroundClip: isActive ? 'text' : undefined,
                WebkitTextFillColor: isActive ? 'transparent' : undefined,
                backgroundClip: isActive ? 'text' : undefined,
              }}
            >
              {testimonial.name}
            </p>
            <p className="text-white/40 text-xs mt-0.5">{testimonial.role}</p>
          </div>
          {isActive && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: testimonial.gradient }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const sectionRef = useReveal<HTMLElement>()
  const [active, setActive] = useState(0)
  const [progressKey, setProgressKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const dragStartX = useRef(0)
  const total = testimonials.length

  const goNext = useCallback(() => {
    setActive(i => (i + 1) % total)
    setProgressKey(k => k + 1)
  }, [total])

  const goPrev = useCallback(() => {
    setActive(i => (i - 1 + total) % total)
    setProgressKey(k => k + 1)
  }, [total])

  const goTo = useCallback((i: number) => {
    setActive(i)
    setProgressKey(k => k + 1)
  }, [])

  // Auto-advance
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [isPaused, goNext])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const prev = (active - 1 + total) % total
  const next = (active + 1) % total

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-kinder relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #050714 0%, #0d1340 35%, #130a2e 65%, #07111f 100%)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={e => { dragStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        const diff = dragStartX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
      }}
      onMouseDown={e => { dragStartX.current = e.clientX }}
      onMouseUp={e => {
        const diff = dragStartX.current - e.clientX
        if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
      }}
      aria-label="Testimonials carousel"
    >
      {/* Stars */}
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none bg-white"
          style={{
            top: star.top, left: star.left,
            width: `${star.s}px`, height: `${star.s}px`,
            opacity: 0.6,
            animation: `twinkle-t ${2 + (i % 3)}s ease-in-out ${(i * 0.4).toFixed(1)}s infinite`,
          }}
        />
      ))}

      {/* Sparkles */}
      {['8%', '45%', '88%'].map((left, i) => (
        <div
          key={i}
          className="absolute pointer-events-none text-yellow-200/50 text-sm"
          style={{
            top: ['10%', '6%', '15%'][i],
            left,
            animation: `twinkle-t ${3 + i}s ease-in-out ${(i * 0.7).toFixed(1)}s infinite`,
          }}
        >
          ✦
        </div>
      ))}

      {/* Nebula glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
        <div className="absolute top-10 -right-32 w-[450px] h-[450px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="container-kinder relative z-10">

        {/* Trust bar */}
        <div className="reveal mb-12">
          <div
            className="inline-flex flex-wrap justify-center gap-6 md:gap-10 mx-auto px-8 py-4 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {TRUST_STATS.map((stat, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <span className="text-xl">{stat.icon}</span>
                <div>
                  <div className="text-sm font-extrabold leading-tight"
                    style={{ background: 'linear-gradient(90deg,#fff,#a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/40 leading-tight">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-14 reveal">
          <h2
            className="section-title"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            What Parents &amp; Teachers Say
          </h2>
          <p className="text-white/40 text-lg mt-3">
            Real stories from our growing community
          </p>
        </div>

        {/* === Desktop: 3-card focus layout === */}
        <div
          className="hidden lg:grid lg:grid-cols-[1fr_1.45fr_1fr] gap-5 items-center mb-10 reveal"
          aria-live="polite"
          aria-atomic="true"
        >
          <TestimonialCard
            testimonial={testimonials[prev]}
            state="side"
            onClick={goPrev}
            index={prev}
          />
          <TestimonialCard
            testimonial={testimonials[active]}
            state="active"
            index={active}
          />
          <TestimonialCard
            testimonial={testimonials[next]}
            state="side"
            onClick={goNext}
            index={next}
          />
        </div>

        {/* === Mobile / tablet: single card === */}
        <div className="lg:hidden mb-10 reveal" aria-live="polite" aria-atomic="true">
          <TestimonialCard
            testimonial={testimonials[active]}
            state="active"
            index={active}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">

          {/* Progress bar segments */}
          <div className="flex items-center gap-3" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                aria-label={`Testimonial ${i + 1} of ${total}: ${testimonials[i].name}`}
                onClick={() => goTo(i)}
                className="relative h-1 rounded-full overflow-hidden transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50"
                style={{
                  width: i === active ? '64px' : '24px',
                  background: 'rgba(255,255,255,0.15)',
                }}
              >
                {i === active && (
                  <div
                    key={progressKey}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: testimonials[active].gradient,
                      animation: isPaused
                        ? 'none'
                        : 'progressFill 5s linear forwards',
                      width: isPaused ? '100%' : undefined,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-white/30 text-sm tabular-nums">
              {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>

            <button
              onClick={goNext}
              aria-label="Next testimonial"
              className="group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes twinkle-t {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.5); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  )
}
