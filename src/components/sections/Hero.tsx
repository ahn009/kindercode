'use client'

import Link from 'next/link'

const STARS = [
  { top: '10%', left: '4%',  size: 18, opacity: 0.9 },
  { top: '58%', left: '2%',  size: 12, opacity: 0.6 },
  { top: '20%', left: '44%', size: 14, opacity: 0.7 },
  { top: '6%',  left: '66%', size: 20, opacity: 0.85 },
  { top: '44%', left: '54%', size: 10, opacity: 0.55 },
  { top: '16%', left: '84%', size: 13, opacity: 0.7 },
  { top: '70%', left: '72%', size: 11, opacity: 0.5 },
]

function Sparkle({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity }} aria-hidden="true">
      <path
        d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
        fill="#FFD93D"
      />
    </svg>
  )
}

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/asset-0.png), linear-gradient(160deg, #1048c8 0%, #1565d8 35%, #1b7fe8 70%, #2196f3 100%)',
        backgroundSize: 'cover, cover',
        backgroundPosition: '85% center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundAttachment: 'scroll, scroll',
        minHeight: 'clamp(460px, 54vw, 620px)',
      }}
    >
      {/* Scattered star decorations */}
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none z-10"
          style={{ top: s.top, left: s.left }}
        >
          <Sparkle size={s.size} opacity={s.opacity} />
        </span>
      ))}

      {/* Wave / cloud layer at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C80,40 160,100 240,70 C320,40 400,90 480,65
               C560,40 640,85 720,60 C800,35 880,80 960,55
               C1040,30 1120,75 1200,55 C1280,35 1360,70 1440,50 L1440,120 L0,120 Z"
            fill="rgba(255,255,255,0.12)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 90"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full absolute bottom-0"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C100,20 200,70 320,45 C440,20 520,65 640,40
               C760,15 860,60 980,38 C1100,16 1220,55 1340,35 L1440,30 L1440,90 L0,90 Z"
            fill="rgba(255,255,255,0.22)"
          />
        </svg>
        <div className="h-3 bg-white/30" />
      </div>

      {/* Two-column layout */}
      <div className="relative z-20 max-w-[1280px] mx-auto px-6 md:px-10 xl:px-16 h-full">
        <div
          className="flex items-center justify-between gap-8"
          style={{ minHeight: 'clamp(460px, 54vw, 620px)' }}
        >
          {/* LEFT — text content */}
          <div className="flex-1 max-w-lg py-16 md:py-20 lg:py-24">

            {/* Headline */}
            <div className="flex items-start gap-3 mb-5">
              <Sparkle size={28} opacity={1} />
              <h1
                className="font-fredoka font-bold leading-[1.1]"
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)',
                  color: '#FFFFFF',
                  textShadow: '0 2px 12px rgba(0,0,0,0.25)',
                }}
              >
                Where Kids Become{' '}
                <span className="whitespace-nowrap">Future Coders!</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className="font-semibold leading-snug mb-8"
              style={{
                fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
                color: '#FFFFFF',
                textShadow: '0 1px 6px rgba(0,0,0,0.2)',
              }}
            >
              Learn to code through games, stories &amp; AI!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {/* Get Started — solid orange */}
              <Link
                href="/signup/"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-extrabold text-[1.05rem] text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
                style={{
                  background: '#F5A623',
                  boxShadow: '0 4px 16px rgba(245,166,35,0.5)',
                }}
              >
                Get Started
              </Link>

              {/* Watch Demo — transparent outline */}
              <Link
                href="#"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-extrabold text-[1.05rem] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:scale-95"
                style={{
                  background: 'transparent',
                  border: '2px solid #4A90E2',
                }}
              >
                Watch Demo
              </Link>
            </div>
          </div>

          {/* RIGHT — illustration is now the background, remove this container */}
        </div>
      </div>
    </section>
  )
}
