'use client'

import Link from 'next/link'
import { Shield, Users, Share2, Lightbulb, PartyPopper } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

const communityTop = [
  {
    id: 1,
    title: 'Safe & Friendly Environment',
    description: 'Moderated community designed specifically for kids with safety as our top priority',
    icon: Shield,
  },
  {
    id: 2,
    title: 'Connect With Kids',
    description: 'Make friends with other young coders from around the world',
    icon: Users,
  },
  {
    id: 3,
    title: 'Share Projects',
    description: 'Showcase your creations and get feedback from peers',
    icon: Share2,
  },
]

const communityBottom = [
  {
    id: 4,
    title: 'Get Support & Tips',
    description: '24/7 help from mentors and community members',
    icon: Lightbulb,
  },
  {
    id: 5,
    title: 'Clubs & Fun Events',
    description: 'Join coding clubs and participate in special events',
    icon: PartyPopper,
  },
]

export default function Community() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="community"
      ref={sectionRef}
      className="section-kinder"
      style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' }}
    >
      <div className="container-kinder">
        <h2 className="section-title reveal">Community</h2>

        {/* Top Row — 3 cards */}
        <div className="grid-kinder grid-cols-1 md:grid-cols-3 gap-8 mb-8 reveal">
          {communityTop.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.id} className="card-kinder relative overflow-hidden group">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(135deg, transparent 0%, rgba(74,144,226,0.05) 100%)',
                  }}
                />
                <div className="mb-4 text-kinder-primary">
                  <Icon className="w-14 h-14 mx-auto" />
                </div>
                <h3>{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            )
          })}
        </div>

        {/* Bottom Row — 2 centered cards */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 reveal">
          {communityBottom.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="card-kinder max-w-md w-full relative overflow-hidden group"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(135deg, transparent 0%, rgba(74,144,226,0.05) 100%)',
                  }}
                />
                <div className="mb-4 text-kinder-primary">
                  <Icon className="w-14 h-14 mx-auto" />
                </div>
                <h3>{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center reveal">
          <Link href="#" className="btn-kinder btn-kinder-primary px-10 py-4 text-lg">
            Join our community
          </Link>
        </div>
      </div>
    </section>
  )
}
