'use client'

import Link from 'next/link'
import {
  BookOpen,
  BarChart3,
  Target,
  Award,
  Cpu,
  Users,
  TrendingUp,
  GraduationCap,
} from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

const schoolFeatures = [
  {
    id: 1,
    title: 'Ready Curriculum',
    description: 'Ready-to-use lesson plans aligned with education standards',
    icon: BookOpen,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    glow: 'rgba(59,130,246,0.3)',
    bg: 'rgba(59,130,246,0.06)',
    border: 'rgba(59,130,246,0.15)',
  },
  {
    id: 2,
    title: 'Monitor Progress',
    description: 'Real-time student analytics and progress tracking',
    icon: BarChart3,
    gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    glow: 'rgba(16,185,129,0.3)',
    bg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.15)',
  },
  {
    id: 3,
    title: 'Engage Students',
    description: 'Motivate students through contests and interactive challenges',
    icon: Target,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    glow: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.15)',
  },
  {
    id: 4,
    title: 'Get Certified',
    description: 'Digital certificates and achievement badges for students',
    icon: Award,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    glow: 'rgba(139,92,246,0.3)',
    bg: 'rgba(139,92,246,0.06)',
    border: 'rgba(139,92,246,0.15)',
  },
  {
    id: 5,
    title: 'AI Assistant',
    description: 'Friendly AI learning assistant guides every student',
    icon: Cpu,
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    glow: 'rgba(6,182,212,0.3)',
    bg: 'rgba(6,182,212,0.06)',
    border: 'rgba(6,182,212,0.15)',
  },
  {
    id: 6,
    title: 'Teacher Dashboard',
    description: 'Manage multiple classes and students from one place',
    icon: Users,
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    glow: 'rgba(16,185,129,0.3)',
    bg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.15)',
  },
  {
    id: 7,
    title: 'Fun Competitions',
    description: 'School-vs-school coding championships and team events',
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
    glow: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.15)',
  },
  {
    id: 8,
    title: 'Certificates & Rewards',
    description: 'Motivate students with verified credentials and rewards',
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
    glow: 'rgba(139,92,246,0.3)',
    bg: 'rgba(139,92,246,0.06)',
    border: 'rgba(139,92,246,0.15)',
  },
]

export default function Schools() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="schools"
      ref={sectionRef}
      className="section-kinder relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef2ff 50%, #f0fdf4 100%)' }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />

      <div className="container-kinder relative z-10">

        {/* Heading */}
        <div className="text-center mb-14 reveal">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
            style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.15)' }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            Trusted by 500+ Schools
          </span>
          <h2 className="section-title" style={{ color: '#0f172a' }}>
            Built for Schools &amp; Teachers
          </h2>
          <p className="text-gray-500 text-lg mt-3 max-w-xl mx-auto">
            Everything educators need to bring world-class coding to their classrooms
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14 reveal">
          {schoolFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: feature.bg,
                  border: `1px solid ${feature.border}`,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ boxShadow: `0 12px 40px ${feature.glow}` }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: feature.gradient, boxShadow: `0 6px 20px ${feature.glow}` }}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>

                <h3 className="font-extrabold text-gray-900 text-base mb-1.5 leading-tight">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Stats bar */}
        <div
          className="rounded-3xl p-6 md:p-8 mb-10 reveal"
          style={{
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.1)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Partner Schools', icon: '🏫' },
              { value: '12K+', label: 'Active Students', icon: '👩‍💻' },
              { value: '98%', label: 'Teacher Satisfaction', icon: '⭐' },
              { value: '40+', label: 'Countries', icon: '🌍' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-extrabold text-gray-900 leading-tight">{stat.value}</div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center reveal">
          <Link
            href="#"
            className="group relative inline-flex items-center gap-3 px-12 py-4 rounded-2xl font-extrabold text-lg text-white overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
            />
            <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            <span className="relative z-10">Get Your School Started</span>
            <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-gray-400 text-sm mt-4 font-medium">Free 30-day trial · No credit card required</p>
        </div>
      </div>
    </section>
  )
}
