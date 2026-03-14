'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'
import { LEARNING_METHOD_IMAGES } from '@/lib/imageConfig'

const learningMethods = [
  {
    id: 1,
    title: '📖 Story Based Coding',
    description: 'Learn programming through interactive stories and adventures',
    image: LEARNING_METHOD_IMAGES.storyBased,
  },
  {
    id: 2,
    title: '🎂 Age Based Coding',
    description: "Curriculum tailored to your child's age and skill level",
    image: LEARNING_METHOD_IMAGES.ageBased,
  },
  {
    id: 3,
    title: '🃏 Card Based Coding',
    description: 'Physical coding cards for hands-on learning experience',
    image: LEARNING_METHOD_IMAGES.cardBased,
  },
]

const bottomMethods = [
  {
    id: 4,
    title: '🎮 Game Based Coding',
    description: 'Create games while learning fundamental concepts',
    image: LEARNING_METHOD_IMAGES.gameBased,
  },
  {
    id: 5,
    title: '🧩 Puzzle Based Coding',
    description: 'Solve puzzles to unlock new coding challenges',
    image: LEARNING_METHOD_IMAGES.puzzleBased,
  },
]

function MethodCard({
  method,
  className = '',
}: {
  method: { id: number; title: string; description: string; image: string }
  className?: string
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className={`card-kinder group ${className}`}>
      <div className="card-img-container overflow-hidden">
        {imgError ? (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {method.title.split(' ')[0]}
          </div>
        ) : (
          <Image
            src={method.image}
            alt={method.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <h3>{method.title}</h3>
      <p className="text-gray-600 mb-5">{method.description}</p>
      <Link href="#" className="btn-kinder btn-kinder-primary btn-kinder-sm">
        Code Now
      </Link>
    </div>
  )
}

export default function LearningMethods() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="learning"
      ref={sectionRef}
      className="section-kinder"
      style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)' }}
    >
      <div className="container-kinder">
        <h2 className="section-title reveal">Multiple Ways of Learning</h2>

        {/* Top Row — 3 cards */}
        <div className="grid-kinder grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 reveal">
          {learningMethods.map((method) => (
            <MethodCard key={method.id} method={method} />
          ))}
        </div>

        {/* Bottom Row — 2 centered cards */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 reveal">
          {bottomMethods.map((method) => (
            <MethodCard key={method.id} method={method} className="max-w-md w-full" />
          ))}
        </div>

        <div className="text-center reveal">
          <Link href="#" className="btn-kinder btn-kinder-secondary px-10 py-4 text-lg">
            Get Started
          </Link>
        </div>
      </div>
    </section>
  )
}
