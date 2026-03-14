'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

const skillPaths = [
  {
    id: 1,
    title: 'Problem Solving',
    description: 'Develop critical thinking and logical reasoning skills through fun challenges',
    emoji: '🧠',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glowColor: 'rgba(102,126,234,0.35)',
    borderColor: '#667eea',
    image: '/images/problem-solving.png',
    tag: 'Ages 6–8',
  },
  {
    id: 2,
    title: 'Game Logic',
    description: 'Build your own games and learn programming fundamentals as you play',
    emoji: '🎲',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    glowColor: 'rgba(240,147,251,0.35)',
    borderColor: '#f093fb',
    image: '/images/game-logic.png',
    tag: 'Ages 8–10',
  },
  {
    id: 3,
    title: 'Web Thinking',
    description: 'Create awesome websites and learn how the internet works from the inside',
    emoji: '🌐',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    glowColor: 'rgba(79,172,254,0.35)',
    borderColor: '#4facfe',
    image: '/images/web-thinking.png',
    tag: 'Ages 10–12',
  },
  {
    id: 4,
    title: 'AI Thinking',
    description: 'Explore artificial intelligence and build your first machine learning models',
    emoji: '🤖',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    glowColor: 'rgba(67,233,123,0.35)',
    borderColor: '#43e97b',
    image: '/images/ai-thinking.png',
    tag: 'Ages 12–14',
  },
  {
    id: 5,
    title: 'Robotics Logic',
    description: 'Program real robots and bring your ideas to life in the physical world',
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    glowColor: 'rgba(250,112,154,0.35)',
    borderColor: '#fa709a',
    image: '/images/robotics-logic.png',
    tag: 'Ages 14–16',
  },
]

function SkillCard({ path }: { path: (typeof skillPaths)[number] }) {
  const [imgError, setImgError] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 18
    setTilt({ x, y })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      className="flex-shrink-0 w-64 sm:w-72 flex flex-col rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? path.borderColor + '66' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: hovered
          ? `0 24px 60px ${path.glowColor}, 0 0 0 1px ${path.borderColor}33`
          : '0 8px 32px rgba(0,0,0,0.3)',
        transform: hovered
          ? `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.04) translateY(-6px)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0px)',
        transition: hovered ? 'transform 0.12s ease-out, box-shadow 0.3s ease, border-color 0.3s ease' : 'transform 0.4s ease-out, box-shadow 0.4s ease, border-color 0.3s ease',
        willChange: 'transform',
      }}
    >
      {/* Gradient top accent line */}
      <div className="h-0.5 w-full" style={{ background: path.gradient }} />

      {/* Image area */}
      <div className="relative h-44 overflow-hidden" style={{ background: path.gradient + '22' }}>
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center text-6xl" style={{ background: path.gradient }}>
            {path.emoji}
          </div>
        ) : (
          <Image
            src={path.image}
            alt={path.title}
            fill
            className="object-cover"
            style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s ease' }}
            sizes="(max-width: 640px) 256px, 288px"
            onError={() => setImgError(true)}
          />
        )}
        {/* Age tag */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
        >
          {path.tag}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-fredoka font-bold text-lg text-white mb-2 leading-tight">{path.title}</h3>
        <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>{path.description}</p>

        {/* Start Path button — expands on hover */}
        <Link
          href="#"
          className="group relative w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-300"
          style={{ background: path.gradient, boxShadow: hovered ? `0 6px 20px ${path.glowColor}` : 'none' }}
        >
          <span
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
          />
          <span className="relative z-10">Start Path</span>
          <svg
            className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default function SkillPaths() {
  const sectionRef = useReveal<HTMLElement>()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, scrollLeft: el.scrollLeft })
    el.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const dx = e.clientX - dragStart.x
    scrollRef.current.scrollLeft = dragStart.scrollLeft - dx
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-kinder relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f0c29 0%, #1a1060 40%, #24105a 70%, #0d1b3e 100%)' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Nebula blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)' }} />

      <div className="container-kinder relative z-10">
        {/* Heading */}
        <div className="text-center mb-12 reveal">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
            style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            5 Unique Learning Paths
          </span>
          <h2
            className="section-title"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Explore Our Skill Paths
          </h2>
          <p className="mt-3 text-lg max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Drag to explore all paths — each one built for a different age and skill level
          </p>
        </div>

        {/* Horizontal scroll — drag + snap */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex gap-5 overflow-x-auto pb-6 reveal"
          style={{
            cursor: 'grab',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Fade padding */}
          <div className="flex-shrink-0 w-2" />
          {skillPaths.map((path) => (
            <div key={path.id} style={{ scrollSnapAlign: 'start' }}>
              <SkillCard path={path} />
            </div>
          ))}
          <div className="flex-shrink-0 w-2" />
        </div>

        {/* Scroll hint */}
        <div className="flex justify-center items-center gap-3 mt-4">
          {skillPaths.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
