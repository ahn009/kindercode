import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LocaleHtmlAttributes from '@/components/LocaleHtmlAttributes'
import type { Metadata } from 'next'

// Pre-render all 10 locale routes at build time (static generation)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: {
    default: 'KinderCode — Where Kids Become Future Coders',
    template: '%s | KinderCode',
  },
  description:
    'KinderCode is an AI-powered coding platform for kids aged 6–16. Learn to code through games, stories, and interactive challenges in 10 languages.',
  keywords: ['kids coding', 'learn coding', 'children programming', 'coding for kids', 'AI learning'],
  openGraph: {
    title: 'KinderCode — Where Kids Become Future Coders',
    description: 'AI-powered coding platform for kids aged 6–16. Games, stories, and challenges in 10 languages.',
    type: 'website',
    siteName: 'KinderCode',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KinderCode — Where Kids Become Future Coders',
    description: 'AI-powered coding platform for kids aged 6–16.',
  },
  robots: { index: true, follow: true },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === locale)
  const dir = lang?.dir ?? 'ltr'

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Updates <html lang="…" dir="…"> on the client after hydration */}
      <LocaleHtmlAttributes locale={locale} dir={dir} />
      <Providers>
        <Header />
        {children}
        <Footer />
      </Providers>
    </NextIntlClientProvider>
  )
}
