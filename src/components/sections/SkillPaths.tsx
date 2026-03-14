'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'

const skillPaths = [
  {
    id: 1,
    title: 'Problem Solving',
    description: 'Develop critical thinking skills',
    emoji: '🧠',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    rotation: '-5deg',
    image: '/images/problem-solving.png',
  },
  {
    id: 2,
    title: 'Game Logic',
    description: 'Build amazing games',
    emoji: '🎲',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    rotation: '-2deg',
    image: '/images/game-logic.png',
  },
  {
    id: 3,
    title: 'Web Thinking',
    description: 'Create awesome websites',
    emoji: '🌐',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    rotation: '0deg',
    image: '/images/web-thinking.png',
  },
  {
    id: 4,
    title: 'AI Thinking',
    description: 'Explore artificial intelligence',
    emoji: '🤖',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    rotation: '2deg',
    image: '/images/ai-thinking.png',
  },
  {
    id: 5,
    title: 'Robotics Logic',
    description: 'Program real robots',
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    rotation: '5deg',
    image: '/images/robotics-logic.png',
  },
]

function SkillCard({ path }: { path: (typeof skillPaths)[number] }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="card-kinder group"
      style={{
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(255,255,255,0.3)',
        transform: `rotateY(${path.rotation})`,
      }}
    >
      <div className="card-img-container">
        {imgError ? (
          <div
            className="w-full h-full flex items-center justify-center text-6xl"
            style={{ background: path.gradient }}
          >
            {path.emoji}
          </div>
        ) : (
          <Image
            src={path.image}
            alt={path.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <h3>{path.title}</h3>
      <p className="text-gray-600 mb-5">{path.description}</p>
      <Link href="#" className="btn-kinder btn-kinder-primary btn-kinder-sm">
        Code Now
      </Link>
    </div>
  )
}

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
            <SkillCard key={path.id} path={path} />
          ))}
        </div>
      </div>
    </section>
  )
}
