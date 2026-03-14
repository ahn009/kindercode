import type { ReactNode } from 'react'
import { Fredoka, Nunito } from 'next/font/google'
import './globals.css'

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['400', '600', '700'],
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

/**
 * Root layout — required by Next.js to contain <html> and <body>.
 *
 * suppressHydrationWarning is set on both elements because the
 * LocaleHtmlAttributes client component (inside [locale]/layout)
 * updates lang and dir after hydration to match the active locale.
 * Without suppressHydrationWarning, React would log a mismatch
 * warning when the server-rendered html has no lang attribute but
 * the client sets one immediately on mount.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${fredoka.variable} ${nunito.variable}`}
    >
      <head>
        {/* Preload the hero background image so it doesn't block LCP */}
        {/* eslint-disable-next-line @next/next/no-head-element */}
        <link rel="preload" as="image" href="/images/asset-0.png" />
      </head>
      <body className="font-nunito antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
