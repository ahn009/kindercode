'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

// Path segments (after the locale prefix) where Header/Footer must NOT render.
// These pages own their full-screen chrome (dashboards, etc.).
const APP_PREFIXES = [
  '/teacher/',
  '/parent/',
]

export default function ConditionalPublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // pathname is /en/teacher/dashboard — strip the locale segment to get /teacher/dashboard
  const segments = pathname.split('/')
  const pathWithoutLocale = '/' + segments.slice(2).join('/')

  const isAppRoute = APP_PREFIXES.some((prefix) =>
    pathWithoutLocale.startsWith(prefix)
  )

  if (isAppRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
