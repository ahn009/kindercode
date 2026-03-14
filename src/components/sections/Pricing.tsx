'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

const pricingPlans = [
  {
    id: 1,
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    color: '#666',
    features: [
      'Basic Starter Lessons',
      'Weekly Challenges',
      'Skill Paths Access',
      'Community Support',
      'Contests & Badges',
    ],
    buttonClass: 'btn-kinder-secondary',
    buttonText: 'Signup',
    popular: false,
    buttonStyle: undefined as React.CSSProperties | undefined,
  },
  {
    id: 2,
    name: 'Plus',
    price: '5',
    description: 'Great for serious learners',
    color: '#4A90E2',
    features: [
      'All Free Features',
      'Advanced Lessons',
      'Priority Support',
      'Extra Curriculum',
      'Monthly Challenges',
    ],
    buttonClass: 'btn-kinder-primary',
    buttonText: 'Signup',
    popular: false,
    buttonStyle: undefined as React.CSSProperties | undefined,
  },
  {
    id: 3,
    name: 'Pro',
    price: '9',
    description: 'Best value for families',
    color: '#FF6B6B',
    features: [
      'All Plus Features',
      'Unlimited Projects',
      '1-on-1 Mentoring',
      'All Curriculum',
      'Family Dashboard',
    ],
    buttonClass: 'btn-kinder-primary',
    buttonText: 'Signup',
    popular: true,
    buttonStyle: {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)',
    } as React.CSSProperties,
  },
  {
    id: 4,
    name: 'School Plan',
    price: '12',
    description: 'Per student / month',
    color: '#6BCB77',
    features: [
      'Classroom Management',
      'Teacher Dashboard',
      'Group Contests',
      'Certificates',
      'Dedicated Support',
    ],
    buttonClass: 'btn-kinder-success',
    buttonText: 'Signup',
    popular: false,
    buttonStyle: undefined as React.CSSProperties | undefined,
  },
]

export default function Pricing() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="section-kinder relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-kinder relative z-[2]">
        <h2 className="section-title text-white reveal">plans</h2>

        <div className="grid-kinder grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch reveal">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`card-kinder relative ${
                plan.popular ? 'border-2 border-kinder-accent scale-105 lg:scale-110 z-10 shadow-2xl' : ''
              }`}
              style={{ background: '#ffffff' }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-sm font-extrabold animate-bounce-3d"
                  style={{
                    background: 'linear-gradient(135deg, #FFD93D 0%, #FF8C42 100%)',
                    color: '#2C3E50',
                    boxShadow: '0 5px 20px rgba(255,193,7,0.4)',
                  }}
                >
                  ⭐ MOST POPULAR
                </div>
              )}

              <h3 className="text-xl font-bold mb-2" style={{ color: plan.color }}>
                {plan.name}
              </h3>

              <div
                className="text-5xl font-fredoka font-extrabold my-6 relative inline-block"
                style={{
                  background: plan.popular
                    ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)'
                    : 'linear-gradient(135deg, #4A90E2 0%, #9B59B6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <span className="text-2xl absolute -left-5 top-1">$</span>
                {plan.price}
              </div>

              <p className="text-gray-500 mb-6">{plan.description}</p>

              <ul className="space-y-4 mb-8 text-left">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-600 font-semibold text-sm"
                  >
                    <Check className="w-5 h-5 text-kinder-success flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className={`btn-kinder ${plan.buttonClass} btn-kinder-block`}
                style={plan.buttonStyle}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
