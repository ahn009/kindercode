'use client'

import { useEffect, useRef } from 'react'

const observerOptions: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
}

/**
 * Progressive-enhancement reveal hook.
 *
 * Default state (SSR / no JS): content is FULLY VISIBLE — no blank page.
 * When JS loads: the section gets the `js-enhanced` class which enables
 * the `opacity:0` starting state, then the IntersectionObserver fires and
 * adds `active` to animate elements in.
 *
 * Elements that are already inside the viewport when the hook mounts
 * receive `active` immediately — no hide-then-show flash.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const section = ref.current
    if (!section) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, observerOptions)

    const elements = section.querySelectorAll<HTMLElement>('.reveal')

    // Enable the CSS animation system for this section
    section.classList.add('js-enhanced')

    elements.forEach((el) => {
      // Already in viewport → mark active before hiding, so there's no flash
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('active')
      }
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return ref
}
