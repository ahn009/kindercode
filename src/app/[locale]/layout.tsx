import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { Fredoka, Nunito } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '../globals.css'

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
    <html
      lang={locale}
      dir={dir}
      className={`${fredoka.variable} ${nunito.variable}`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/asset-0.png"
          fetchPriority="high"
        />
      </head>
      <body className="font-nunito antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
