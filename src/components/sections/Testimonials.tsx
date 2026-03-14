'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    role: 'Parent',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    quote:
      'KinderCode made learning fun and easy for my son! He went from playing games to creating them in just 3 months.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Mr. Thompson',
    role: 'Teacher, Oakwood Elementary',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    quote:
      "Our students love the coding competitions. It's amazing to see their creativity and problem-solving skills grow!",
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily R.',
    role: 'Parent of 2',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    quote:
      'The curriculum is perfectly structured. My daughter looks forward to her coding time every single day.',
    rating: 5,
  },
]

export default function Testimonials() {
  const sectionRef = useReveal<HTMLElement>()
  // activeDot is now wired to actually show/hide testimonials on mobile
  const [activeDot, setActiveDot] = useState(0)

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-kinder"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}
    >
      <div className="container-kinder">
        <h2 className="section-title reveal">exciting coding competitions</h2>

        {/* Desktop: show all 3. Mobile: show only the active one */}
        <div className="grid-kinder grid-cols-1 md:grid-cols-3 gap-10 reveal">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`card-kinder p-10 text-center relative transition-all duration-300 ${
                // On mobile screens hide non-active cards
                index !== activeDot ? 'hidden md:block' : ''
              }`}
              style={{ border: '1px solid rgba(0,0,0,0.05)' }}
            >
              {/* Quote decoration */}
              <div className="absolute top-5 left-8 text-8xl text-kinder-primary opacity-10 font-serif leading-none">
                &ldquo;
              </div>

              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-5">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                    priority={index === 0}
                  />
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-kinder-accent text-kinder-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="italic text-gray-600 mb-5 text-lg leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <p className="font-extrabold text-kinder-primary text-lg">{testimonial.name}</p>
              <p className="text-gray-500 text-sm font-semibold">{testimonial.role}</p>
            </div>
          ))}
        </div>

        {/* Carousel dots — only meaningful on mobile where one card is shown at a time */}
        <div className="flex justify-center gap-3 mt-10 md:hidden">
          {testimonials.map((_, dot) => (
            <button
              key={dot}
              onClick={() => setActiveDot(dot)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeDot === dot
                  ? 'bg-kinder-accent scale-125 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              style={
                activeDot === dot ? { boxShadow: '0 0 10px rgba(255,193,7,0.5)' } : {}
              }
              aria-label={`Go to testimonial ${dot + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
