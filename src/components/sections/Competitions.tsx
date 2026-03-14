'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

const competitions = [
  {
    id: 1,
    title: 'Leader board',
    description: 'Compete with coders worldwide and climb the ranks',
    emoji: '🏆',
    gradient: 'linear-gradient(135deg, #FFD93D 0%, #FF8C42 100%)',
    buttonClass: 'btn-kinder-accent',
    buttonText: 'Signup Now',
  },
  {
    id: 2,
    title: 'Weekly Challenge',
    description: 'New coding puzzles every week with cool prizes',
    emoji: '📅',
    gradient: 'linear-gradient(135deg, #6BCB77 0%, #4D96FF 100%)',
    buttonClass: 'btn-kinder-success',
    buttonText: 'Register now',
  },
  {
    id: 3,
    title: 'Live Tournament',
    description: 'Real-time coding battles against other kids',
    emoji: '🔴',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    buttonClass: 'btn-kinder-orange',
    buttonText: 'Signup Now',
  },
  {
    id: 4,
    title: 'School Contests',
    description: 'Represent your school in coding championships',
    emoji: '🏫',
    gradient: 'linear-gradient(135deg, #9B59B6 0%, #3498DB 100%)',
    buttonClass: 'btn-kinder-primary',
    buttonText: 'Signup Now',
  },
]

export default function Competitions() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="competitions"
      ref={sectionRef}
      className="section-kinder"
      style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)' }}
    >
      <div className="container-kinder">
        <h2 className="section-title reveal">Exciting Coding Competitions</h2>

        <div className="grid-kinder grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className="card-kinder relative group"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                border: '2px solid transparent',
                backgroundClip: 'padding-box',
              }}
            >
              {/* Gradient border on hover */}
              <div
                className="absolute -inset-0.5 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                style={{ background: 'linear-gradient(135deg, #4A90E2, #FFD93D)' }}
              />

              <div
                className="card-img-container flex items-center justify-center"
                style={{ background: comp.gradient }}
              >
                <span className="text-7xl">{comp.emoji}</span>
              </div>
              <h3 className="text-kinder-primary">{comp.title}</h3>
              <p className="text-gray-600 mb-5">{comp.description}</p>
              <Link href="#" className={`btn-kinder ${comp.buttonClass} btn-kinder-sm`}>
                {comp.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
