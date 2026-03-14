import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LocaleHtmlAttributes from '@/components/LocaleHtmlAttributes'

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
