'use client'

import Link from 'next/link'
import {
  BookOpen,
  BarChart3,
  Target,
  Award,
  Bird,
  Users,
  TrendingUp,
  GraduationCap,
} from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

const schoolFeatures = [
  { id: 1, title: 'Get Ciriculum', description: 'Ready-to-use lesson plans', icon: BookOpen },
  { id: 2, title: 'Moniter Progress', description: 'Track student progress easily', icon: BarChart3 },
  { id: 3, title: 'Engage Students', description: 'Engage students with contests', icon: Target },
  { id: 4, title: 'Get Certified', description: 'Motivate with achievements', icon: Award },
  { id: 5, title: 'Turn-Key Ciriculum', description: 'Friendly AI learning assistant', icon: Bird },
  { id: 6, title: 'Teachers dashbaord', description: 'Manage multiple students', icon: Users },
  { id: 7, title: 'Fun Competitions', description: 'Detailed analytics & insights', icon: TrendingUp },
  { id: 8, title: 'Certificates and rewards', description: 'Training for educators', icon: GraduationCap },
]

export default function Schools() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="schools"
      ref={sectionRef}
      className="section-kinder relative"
      style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' }}
    >
      {/* Wave decoration at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.4' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
        }}
      />

      <div className="container-kinder relative z-10">
        <h2 className="section-title reveal">For Schools</h2>

        <div className="grid-kinder grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
          {schoolFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                className="card-kinder p-6 min-h-[200px] flex flex-col items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.92)' }}
              >
                <div className="mb-4 text-kinder-primary">
                  <Icon className="w-12 h-12" />
                </div>
                <h3 className="text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm text-center">{feature.description}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12 reveal">
          <Link
            href="#"
            className="btn-kinder btn-kinder-success px-12 py-5 text-xl font-bold inline-block"
            style={{ boxShadow: '0 10px 30px rgba(107, 203, 119, 0.4)' }}
          >
            🚀 Get Your School Started
          </Link>
        </div>
      </div>
    </section>
  )
}
