'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

const skillPaths = [
  {
    id: 1,
    title: 'Problem Solving',
    description: 'Develop critical thinking skills',
    emoji: '🧠',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    rotation: '-5deg',
  },
  {
    id: 2,
    title: 'Game Logic',
    description: 'Build amazing games',
    emoji: '🎲',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    rotation: '-2deg',
  },
  {
    id: 3,
    title: 'Web Thinking',
    description: 'Create awesome websites',
    emoji: '🌐',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    rotation: '0deg',
  },
  {
    id: 4,
    title: 'AI Thinking',
    description: 'Explore artificial intelligence',
    emoji: '🤖',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    rotation: '2deg',
  },
  {
    id: 5,
    title: 'Robotics Logic',
    description: 'Program real robots',
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    rotation: '5deg',
  },
]

export default function SkillPaths() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-kinder relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      {/*
        Removed the 200%×200% continuously-spinning background pattern.
        It consumed GPU constantly even when the section was offscreen.
        Replaced with a static radial dot pattern at normal size.
      */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container-kinder relative z-[2]">
        <h2 className="section-title text-white reveal">Explore Our Skill Paths</h2>

        <div className="grid-kinder grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 reveal">
          {skillPaths.map((path) => (
            <div
              key={path.id}
              className="card-kinder group"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(255,255,255,0.3)',
                transform: `rotateY(${path.rotation})`,
              }}
            >
              <div
                className="card-img-container flex items-center justify-center"
                style={{ background: path.gradient }}
              >
                <span className="text-6xl">{path.emoji}</span>
              </div>
              <h3>{path.title}</h3>
              <p className="text-gray-600 mb-5">{path.description}</p>
              <Link href="#" className="btn-kinder btn-kinder-primary btn-kinder-sm">
                Code Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
