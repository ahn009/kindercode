'use client'

import { Link } from '@/i18n/navigation'
import { useReveal } from '@/hooks/useReveal'

const pricingPlans = [
  {
    id: 1,
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    accentColor: '#94a3b8',
    badgeText: null,
    badgeColor: null,
    features: [
      'Basic Starter Lessons',
      'Weekly Challenges',
      'Skill Paths Access',
      'Community Support',
      'Contests & Badges',
    ],
    buttonText: 'Signup',
    buttonGradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    buttonShadow: 'rgba(100,116,139,0.4)',
    popular: false,
    cardAccent: 'rgba(148,163,184,0.15)',
  },
  {
    id: 2,
    name: 'Plus',
    price: '5',
    description: 'Great for serious learners',
    accentColor: '#3b82f6',
    badgeText: 'POPULAR',
    badgeColor: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    features: [
      'All Free Features',
      'Advanced Lessons',
      'Priority Support',
      'Extra Curriculum',
      'Monthly Challenges',
    ],
    buttonText: 'Signup',
    buttonGradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    buttonShadow: 'rgba(59,130,246,0.4)',
    popular: false,
    cardAccent: 'rgba(59,130,246,0.15)',
  },
  {
    id: 3,
    name: 'Pro',
    price: '9',
    description: 'Best value for families',
    accentColor: '#a855f7',
    badgeText: '⭐ BEST VALUE',
    badgeColor: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    features: [
      'All Plus Features',
      'Unlimited Projects',
      '1-on-1 Mentoring',
      'All Curriculum',
      'Family Dashboard',
    ],
    buttonText: 'Signup',
    buttonGradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    buttonShadow: 'rgba(168,85,247,0.4)',
    popular: true,
    cardAccent: 'rgba(168,85,247,0.15)',
  },
  {
    id: 4,
    name: 'School Plan',
    price: '12',
    description: 'Per student / month',
    accentColor: '#22c55e',
    badgeText: 'SCHOOLS',
    badgeColor: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    features: [
      'Classroom Management',
      'Teacher Dashboard',
      'Group Contests',
      'Certificates',
      'Dedicated Support',
    ],
    buttonText: 'Contact Us',
    buttonGradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    buttonShadow: 'rgba(34,197,94,0.4)',
    popular: false,
    cardAccent: 'rgba(34,197,94,0.15)',
  },
]

// Static star positions to avoid hydration mismatch
const STARS = [
  { top: '8%', left: '5%', size: 2, opacity: 0.8, delay: '0s' },
  { top: '15%', left: '12%', size: 3, opacity: 0.6, delay: '0.5s' },
  { top: '5%', left: '22%', size: 1.5, opacity: 0.9, delay: '1s' },
  { top: '20%', left: '35%', size: 2.5, opacity: 0.7, delay: '1.5s' },
  { top: '10%', left: '48%', size: 2, opacity: 0.8, delay: '0.3s' },
  { top: '18%', left: '60%', size: 3, opacity: 0.5, delay: '0.8s' },
  { top: '6%', left: '72%', size: 1.5, opacity: 0.9, delay: '1.2s' },
  { top: '25%', left: '82%', size: 2, opacity: 0.6, delay: '0.6s' },
  { top: '12%', left: '92%', size: 2.5, opacity: 0.7, delay: '1.8s' },
  { top: '30%', left: '8%', size: 1.5, opacity: 0.5, delay: '2s' },
  { top: '35%', left: '95%', size: 2, opacity: 0.8, delay: '0.4s' },
  { top: '3%', left: '55%', size: 1, opacity: 0.9, delay: '1.6s' },
  { top: '22%', left: '28%', size: 1.5, opacity: 0.6, delay: '0.9s' },
  { top: '28%', left: '68%', size: 2, opacity: 0.7, delay: '1.3s' },
  { top: '40%', left: '45%', size: 1, opacity: 0.4, delay: '2.2s' },
]

const SPARKLES = [
  { top: '12%', left: '18%', delay: '0s' },
  { top: '8%', left: '40%', delay: '1s' },
  { top: '20%', left: '75%', delay: '0.5s' },
  { top: '5%', left: '88%', delay: '1.5s' },
  { top: '30%', left: '55%', delay: '0.7s' },
]

export default function Pricing() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="section-kinder relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f0c29 0%, #1a1a4e 30%, #24243e 60%, #1e3a5f 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Stars */}
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: '#ffffff',
            opacity: star.opacity,
            animation: `twinkle 3s ease-in-out ${star.delay} infinite`,
          }}
        />
      ))}

      {/* Sparkles (4-point stars) */}
      {SPARKLES.map((sp, i) => (
        <div
          key={i}
          className="absolute pointer-events-none text-yellow-200"
          style={{
            top: sp.top,
            left: sp.left,
            fontSize: '14px',
            opacity: 0.7,
            animation: `twinkle 4s ease-in-out ${sp.delay} infinite`,
          }}
        >
          ✦
        </div>
      ))}

      {/* Nebula glow blobs */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '10%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '20%',
          right: '-10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
        }}
      />

      {/* Clouds at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
        {/* Cloud layer 1 — back */}
        <div
          className="absolute bottom-0"
          style={{ animation: 'floatCloud 20s ease-in-out infinite' }}
        >
          <svg viewBox="0 0 1440 180" className="w-screen" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,120 C80,80 160,100 240,90 C320,80 380,60 460,70 C540,80 580,50 660,55 C740,60 800,40 880,50 C960,60 1020,80 1100,75 C1180,70 1260,90 1340,85 C1380,82 1410,88 1440,90 L1440,180 L0,180 Z"
              fill="rgba(255,255,255,0.06)"
            />
          </svg>
        </div>
        {/* Cloud layer 2 — mid */}
        <div
          className="absolute bottom-0"
          style={{ animation: 'floatCloud 15s ease-in-out 2s infinite reverse' }}
        >
          <svg viewBox="0 0 1440 140" className="w-screen" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,100 C100,60 200,80 300,70 C400,60 450,40 550,50 C650,60 700,30 800,40 C900,50 950,70 1050,65 C1150,60 1250,80 1350,75 L1440,78 L1440,140 L0,140 Z"
              fill="rgba(255,255,255,0.08)"
            />
          </svg>
        </div>
        {/* Cloud layer 3 — front */}
        <div
          className="absolute bottom-0"
          style={{ animation: 'floatCloud 12s ease-in-out 1s infinite' }}
        >
          <svg viewBox="0 0 1440 110" className="w-screen" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,80 C120,50 240,65 360,55 C480,45 540,25 660,35 C780,45 840,20 960,30 C1080,40 1140,60 1260,55 C1330,52 1390,58 1440,60 L1440,110 L0,110 Z"
              fill="rgba(255,255,255,0.12)"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="container-kinder relative z-10">
        <div className="text-center mb-12 reveal">
          <h2 className="section-title text-white">Pricing</h2>
          <p className="text-blue-200 text-lg mt-2 opacity-80">
            Choose the plan that works best for your child
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch reveal">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className="relative flex flex-col rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: plan.popular
                  ? `2px solid ${plan.accentColor}`
                  : '1px solid rgba(255,255,255,0.15)',
                boxShadow: plan.popular
                  ? `0 8px 40px ${plan.buttonShadow}, 0 0 0 1px rgba(255,255,255,0.05)`
                  : '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-6 right-6 h-0.5 rounded-full"
                style={{ background: plan.buttonGradient }}
              />

              {/* Badge */}
              {plan.badgeText && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold text-white whitespace-nowrap"
                  style={{
                    background: plan.badgeColor ?? undefined,
                    boxShadow: `0 4px 15px ${plan.buttonShadow}`,
                  }}
                >
                  {plan.badgeText}
                </div>
              )}

              {/* Plan name & description */}
              <div className="text-center mb-4 pt-2">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-blue-200 text-sm opacity-75">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-blue-200 text-xl font-semibold mb-2">$</span>
                <span
                  className="text-6xl font-extrabold leading-none"
                  style={{
                    background: plan.buttonGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {plan.price}
                </span>
                <div className="flex flex-col mb-2 ml-1">
                  <span className="text-blue-200 text-xs leading-tight opacity-75">/month</span>
                  <span
                    className="text-xs font-bold rounded-full px-2 py-0.5 mt-1 text-white"
                    style={{ background: plan.buttonGradient }}
                  >
                    {plan.id === 1 ? 'FREE' : plan.id === 2 ? 'BASIC' : plan.id === 3 ? 'ADVANCED' : 'SCHOOL'}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div
                className="w-full h-px my-4 opacity-20"
                style={{ background: plan.accentColor }}
              />

              {/* Features */}
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-blue-100 text-sm">
                    <span style={{ color: plan.accentColor }} className="text-base leading-none flex-shrink-0">
                      •
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Link
                href="#"
                className="block text-center py-3 px-6 rounded-2xl font-bold text-white text-sm transition-all duration-300 hover:scale-105 hover:brightness-110"
                style={{
                  background: plan.buttonGradient,
                  boxShadow: `0 4px 20px ${plan.buttonShadow}`,
                }}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes floatCloud {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(20px); }
        }
      `}</style>
    </section>
  )
}
